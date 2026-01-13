import sqlite3
import bcrypt

# Connect to the actual database the backend uses
conn = sqlite3.connect('backend/users.db')
cursor = conn.cursor()

# Get the user you registered
cursor.execute("SELECT id, email, full_name, password_hash FROM users WHERE email='newuser@test.com'")
user = cursor.fetchone()

if user:
    user_id, email, name, stored_hash = user
    print(f"Found user: {email}")
    print(f"Stored hash (first 40 chars): {stored_hash[:40]}...")
    
    # Test if the password you THINK you used actually works
    test_passwords = ['password123', 'Password123', 'password', 'test123']
    
    print("\nTesting passwords:")
    for pwd in test_passwords:
        try:
            matches = bcrypt.checkpw(pwd.encode('utf-8'), stored_hash.encode('utf-8'))
            print(f"  '{pwd}': {'✓ MATCH' if matches else '✗ No match'}")
            if matches:
                print(f"\n** FOUND IT! The actual password is: {pwd} **")
        except Exception as e:
            print(f"  '{pwd}': Error - {e}")
    
    # Now let's create a NEW user with a password we KNOW works
    print("\n" + "="*50)
    print("Creating a guaranteed working test account...")
    
    # Delete if exists
    cursor.execute("DELETE FROM users WHERE email='verified@test.com'")
    conn.commit()
    
    # Create with known password
    new_password = 'verified123'
    password_hash = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    cursor.execute(
        "INSERT INTO users (email, password_hash, full_name, phone) VALUES (?, ?, ?, ?)",
        ('verified@test.com', password_hash, 'Verified User', '1111111111')
    )
    conn.commit()
    new_id = cursor.lastrowid
    
    # Verify it works
    test_match = bcrypt.checkpw(new_password.encode('utf-8'), password_hash.encode('utf-8'))
    print(f"Created user ID: {new_id}")
    print(f"Password verification: {'✓ WORKS' if test_match else '✗ FAILED'}")
    
    print("\n" + "="*50)
    print("USE THESE CREDENTIALS TO LOGIN:")
    print(f"  Email: verified@test.com")
    print(f"  Password: {new_password}")
    print("="*50)
    
else:
    print("User newuser@test.com not found in database!")

conn.close()
