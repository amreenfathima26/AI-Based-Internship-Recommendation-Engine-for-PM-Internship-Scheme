import os
import secrets
from pathlib import Path

def get_jwt_secret_key():
    """
    Get JWT secret key dynamically:
    1. Check environment variable first (for production)
    2. If not found, check for .jwt_secret file
    3. If not found, generate a new secure random key and save it
    """
    # Check environment variable first (production use)
    env_secret = os.getenv('JWT_SECRET_KEY')
    if env_secret:
        return env_secret
    
    # Get the backend directory path
    backend_dir = Path(__file__).parent
    secret_file = backend_dir / '.jwt_secret'
    
    # Try to read existing secret from file
    if secret_file.exists():
        try:
            with open(secret_file, 'r') as f:
                secret = f.read().strip()
            if secret:
                return secret
        except Exception as e:
            print(f"Warning: Could not read JWT secret file: {e}")
    
    # Generate a new secure random secret key (32 bytes = 256 bits)
    # Using URL-safe base64 encoding for the secret
    new_secret = secrets.token_urlsafe(32)
    
    # Save the secret to file for future use
    try:
        with open(secret_file, 'w') as f:
            f.write(new_secret)
        # Set restrictive permissions (owner read/write only)
        os.chmod(secret_file, 0o600)
        print("Generated new JWT secret key and saved to .jwt_secret")
    except Exception as e:
        print(f"Warning: Could not save JWT secret to file: {e}")
        print("JWT secret will be regenerated on next restart")
    
    return new_secret

