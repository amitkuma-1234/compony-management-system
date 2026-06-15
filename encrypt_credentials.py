"""
Amdox ERP — Credential Encryption Utility
==========================================
Run this script ONCE to encrypt ALL sensitive credentials:
  - Gmail App Password
  - Google OAuth Client Secret
  - JWT Secret Key

It generates:
  1. .email_key  — The master encryption key (NEVER commit this!)
  2. .email_cred — Encrypted Gmail app password
  3. .oauth_cred — Encrypted Google OAuth client secret
  4. .jwt_cred   — Encrypted JWT secret key

Usage:
  python encrypt_credentials.py
"""

import os
import sys
from cryptography.fernet import Fernet

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
KEY_FILE   = os.path.join(SCRIPT_DIR, ".email_key")

CREDENTIALS = {
    ".email_cred": "mjlt lksl mbmt lypx",                  # Gmail App Password
    ".oauth_cred": "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", # Google OAuth Client Secret
    ".jwt_cred":   "super-secret-key",                      # JWT Secret
}

def encrypt_all():
    # ── 1. Generate or load encryption key ────────────────────
    if os.path.exists(KEY_FILE):
        with open(KEY_FILE, "rb") as f:
            key = f.read()
        print(f"[INFO] Using existing encryption key from: {KEY_FILE}")
    else:
        key = Fernet.generate_key()
        with open(KEY_FILE, "wb") as f:
            f.write(key)
        print(f"[OK] New encryption key saved to: {KEY_FILE}")

    fernet = Fernet(key)

    # ── 2. Encrypt each credential ────────────────────────────
    for filename, plain_text in CREDENTIALS.items():
        filepath = os.path.join(SCRIPT_DIR, filename)
        encrypted = fernet.encrypt(plain_text.encode())

        with open(filepath, "wb") as f:
            f.write(encrypted)

        # Verify
        with open(filepath, "rb") as f:
            loaded = f.read()
        decrypted = fernet.decrypt(loaded).decode()

        if decrypted == plain_text:
            print(f"[OK] {filename} -- encrypted and verified OK")
        else:
            print(f"[FAIL] {filename} -- verification FAILED!")
            sys.exit(1)

    print("\n[SECURE] All credentials encrypted successfully!")
    print("[SECURE] IMPORTANT: .email_key must NEVER be committed to git.")
    print("[SECURE] The .gitignore has been configured to exclude it.")

if __name__ == "__main__":
    encrypt_all()
