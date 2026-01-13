"""
COMPLETE AUTHENTICATION FIX
This script will:
1. Delete the old broken database
2. Create a fresh new database
3. Add a working test user
4. Verify it works
"""
import os
import sqlite3
import bcrypt
from pathlib import Path

# Path to database
db_path = Path('backend/users.db')

print("=" * 70)
print("FIXING AUTHENTICATION - COMPLETE RESET")
print("=" * 70)

# Step 1: Delete old database
if db_path.exists():
    print(f"\n1. Deleting old database: {db_path}")
    os.remove(db_path)
    print("   ✓ Old database deleted")
else:
    print(f"\n1. No existing database found at {db_path}")

# Step 2: Create fresh database with schema
print("\n2. Creating fresh database...")
conn = sqlite3.connect(str(db_path))
cursor = conn.cursor()

# Create users table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        phone TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
''')

# Create other necessary tables
cursor.execute('''
    CREATE TABLE IF NOT EXISTS user_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        education TEXT,
        skills TEXT,
        interests TEXT,
        location TEXT,
        previous_experience INTEGER DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
''')

cursor.execute('''
    CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        company_name TEXT NOT NULL,
        role_title TEXT NOT NULL,
        status TEXT DEFAULT 'Applied',
        applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        job_link TEXT,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
''')

cursor.execute('''
    CREATE TABLE IF NOT EXISTS ats_scans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        role_title TEXT,
        match_score REAL,
        missing_keywords TEXT,
        scan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
''')

cursor.execute('''
    CREATE TABLE IF NOT EXISTS quiz_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        subject TEXT,
        score REAL,
        total_questions INTEGER,
        scan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
''')

conn.commit()
print("   ✓ Fresh database created with all tables")

# Step 3: Create working test user
print("\n3. Creating test user...")
email = 'admin@test.com'
password = 'admin123'
full_name = 'Admin User'
phone = '9999999999'

# Hash the password
password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# Insert user
cursor.execute(
    'INSERT INTO users (email, password_hash, full_name, phone) VALUES (?, ?, ?, ?)',
    (email.lower(), password_hash, full_name, phone)
)
conn.commit()
user_id = cursor.lastrowid
print(f"   ✓ Created user: {email} (ID: {user_id})")

# Step 4: Verify it works
print("\n4. Verifying authentication...")
cursor.execute('SELECT email, password_hash FROM users WHERE email=?', (email.lower(),))
user = cursor.fetchone()

if user:
    stored_email, stored_hash = user
    # Test password
    is_valid = bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8'))
    
    if is_valid:
        print(f"   ✓ Authentication test PASSED!")
        print(f"\n" + "=" * 70)
        print("SUCCESS! Login is now fixed.")
        print("=" * 70)
        print("\nUSE THESE CREDENTIALS TO LOGIN:")
        print(f"  Email: {email}")
        print(f"  Password: {password}")
        print("=" * 70)
    else:
        print(f"   ✗ Authentication test FAILED")
else:
    print(f"   ✗ User not found after creation")

conn.close()
