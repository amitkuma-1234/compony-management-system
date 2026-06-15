import smtplib
import sys
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from cryptography.fernet import Fernet

# Check if arguments are provided
if len(sys.argv) < 3:
    print("Usage: python send_email.py <receiver_email> <verification_code>")
    sys.exit(1)

# ── Paths ─────────────────────────────────────────────────
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
KEY_FILE   = os.path.join(SCRIPT_DIR, ".email_key")
CRED_FILE  = os.path.join(SCRIPT_DIR, ".email_cred")

# ── Decrypt the Gmail App Password at runtime ────────────
def load_encrypted_password():
    """Load and decrypt the Gmail app password from encrypted files."""
    if not os.path.exists(KEY_FILE):
        print("ERROR: Encryption key file (.email_key) not found!")
        print("       Run 'python encrypt_credentials.py' first.")
        sys.exit(1)
    if not os.path.exists(CRED_FILE):
        print("ERROR: Encrypted credential file (.email_cred) not found!")
        print("       Run 'python encrypt_credentials.py' first.")
        sys.exit(1)

    with open(KEY_FILE, "rb") as f:
        key = f.read()
    with open(CRED_FILE, "rb") as f:
        encrypted_password = f.read()

    fernet = Fernet(key)
    return fernet.decrypt(encrypted_password).decode()

# Sender Email
sender_email = "devyanibpatil3132@gmail.com"

# Decrypt the app password (no plain text stored anywhere!)
app_password = load_encrypted_password()

# Receiver Email and Code from arguments
receiver_email = sys.argv[1]
verification_code = sys.argv[2]

# Create Message
message = MIMEMultipart()
message["From"] = sender_email
message["To"] = receiver_email
message["Subject"] = "Amdox ERP - Password Reset Verification Code"

body = f"""Hello,

You have requested a password reset for your Amdox ERP account.
Your 6-digit verification code is:

{verification_code}

Please enter this code on the verification screen to proceed with resetting your password.
If you did not request this, please ignore this email.

Regards,
Amdox ERP Team"""

message.attach(MIMEText(body, "plain"))

server = None
try:
    # Connect to Gmail SMTP Server
    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()

    # Login with decrypted password
    server.login(sender_email, app_password)

    # Send Email
    server.sendmail(
        sender_email,
        receiver_email,
        message.as_string()
    )

    print("Email sent successfully!")

except Exception as e:
    print("Error:", e)
    sys.exit(1)

finally:
    if server:
        try:
            server.quit()
        except:
            pass
