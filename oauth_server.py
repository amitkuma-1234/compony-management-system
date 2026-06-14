import os
import sqlite3
import time
import urllib.parse
import hashlib
import base64
import secrets
from flask import Flask, redirect, request, session, url_for
from google_auth_oauthlib.flow import Flow
import jwt
import requests
import json
from cryptography.fernet import Fernet

app = Flask(__name__)
app.secret_key = "some_random_flask_secret_key"

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

# ── Decrypt secrets at runtime ────────────────────────────
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
KEY_FILE   = os.path.join(SCRIPT_DIR, ".email_key")

def decrypt_credential(cred_filename):
    """Decrypt a credential file using the master encryption key."""
    with open(KEY_FILE, "rb") as f:
        key = f.read()
    cred_path = os.path.join(SCRIPT_DIR, cred_filename)
    with open(cred_path, "rb") as f:
        encrypted = f.read()
    return Fernet(key).decrypt(encrypted).decode()

GOOGLE_CLIENT_ID = "784181504436-hgpqo6aajunr1o1maslrc1h9m3kplo62.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET = decrypt_credential(".oauth_cred")  # Decrypted at runtime
JWT_SECRET = decrypt_credential(".jwt_cred")               # Decrypted at runtime

client_secrets = {
    "web": {
        "client_id": GOOGLE_CLIENT_ID,
        "project_id": "project-id",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uris": ["http://127.0.0.1:5000/callback"]
    }
}

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "server", "database.sqlite")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# Generate PKCE code verifier and challenge
def generate_pkce():
    code_verifier = secrets.token_urlsafe(64)
    code_challenge = base64.urlsafe_b64encode(
        hashlib.sha256(code_verifier.encode()).digest()
    ).rstrip(b'=').decode('ascii')
    return code_verifier, code_challenge

@app.route("/")
def home():
    return '<a href="/login">Login with Google</a>'

@app.route("/login")
def login():
    flow = Flow.from_client_config(
        client_secrets,
        scopes=[
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
            "openid"
        ],
        redirect_uri="http://127.0.0.1:5000/callback"
    )

    # Generate PKCE verifier and challenge
    code_verifier, code_challenge = generate_pkce()
    session["code_verifier"] = code_verifier

    auth_url, state = flow.authorization_url(
        code_challenge=code_challenge,
        code_challenge_method="S256"
    )
    session["state"] = state

    return redirect(auth_url)

@app.route("/callback")
def callback():
    flow = Flow.from_client_config(
        client_secrets,
        scopes=[
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
            "openid"
        ],
        state=session["state"],
        redirect_uri="http://127.0.0.1:5000/callback"
    )

    # Use the stored code_verifier for PKCE token exchange
    flow.fetch_token(
        authorization_response=request.url,
        code_verifier=session.get("code_verifier")
    )
    credentials = flow.credentials

    # Get User Details from Google UserInfo API
    userinfo_response = requests.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        headers={"Authorization": f"Bearer {credentials.token}"}
    )
    userinfo = userinfo_response.json()
    email = userinfo.get("email")
    name = userinfo.get("name", email.split('@')[0])

    if not email:
        return "Failed to get email from Google Auth.", 400

    # DB Operations to check/create user
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if user already exists
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()

    if not user:
        # User doesn't exist, check if they are in employees table
        cursor.execute("SELECT * FROM employees WHERE email = ?", (email,))
        emp = cursor.fetchone()
        
        # Determine role
        role = emp["role"] if emp else "employee"
        emp_name = emp["name"] if emp else name
        
        # Create a new user account with OAuth-linked password
        cursor.execute(
            "INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)",
            (email, "password_oauth_linked", emp_name, role)
        )
        conn.commit()
        
        # Fetch newly created user
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()
    
    conn.close()

    # Generate JWT Token matching Express Server format
    user_id = user["id"]
    user_email = user["email"]
    user_name = user["name"]
    user_role = user["role"]
    user_tenant = user["tenantId"] if "tenantId" in user.keys() else "main"

    payload = {
        "id": user_id,
        "email": user_email,
        "role": user_role,
        "name": user_name,
        "tenantId": user_tenant,
        "exp": int(time.time()) + 8 * 3600  # 8 hours expiration
    }
    
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    
    # URL encode parameters to send to login.html
    user_data = {
        "id": user_id,
        "email": user_email,
        "name": user_name,
        "role": user_role,
        "status": "Active"
    }
    user_data_encoded = urllib.parse.quote(json.dumps(user_data))

    # Redirect to frontend server (running on port 4000)
    return redirect(f"http://localhost:4000/login.html?sso_token={token}&sso_user={user_data_encoded}")

if __name__ == "__main__":
    app.run(port=5000, debug=True)
