import sqlite3
import bcrypt

# Read the debuguser password hash
conn = sqlite3.connect('backend/users.db')
cursor = conn.cursor()
cursor.execute("SELECT email, password_hash FROM users WHERE email='debuguser@test.com'")
result = cursor.fetchone()
conn.close()

if result:
    email, hash_from_db = result
    print(f"Email: {email}")
    print(f"Hash in DB (first 50): {hash_from_db[:50]}...")
    
    # Test with the password we THINK is correct
    password_to_test = 'debug123'
    
    print(f"\nTesting password: '{password_to_test}'")
    print(f"Password as bytes: {password_to_test.encode()}")
    
    # Test bcrypt
    try:
        matches = bcrypt.checkpw(password_to_test.encode('utf-8'), hash_from_db.encode('utf-8'))
        print(f"Bcrypt result: {matches}")
        
        if not matches:
            # The hash doesn't match - let's see why
            print("\n" + "="*60)
            print("PASSWORD MISMATCH - INVESTIGATING")
            print("="*60)
            
            # Let's manually create what the hash SHOULD be
            correct_hash = bcrypt.hashpw(password_to_test.encode('utf-8'), bcrypt.gensalt())
            print(f"\nIf we hash '{password_to_test}' now, we get:")
            print(f"  {correct_hash.decode()[:50]}...")
            print(f"\nBut the database has:")
            print(f"  {hash_from_db[:50]}...")
            print("\nThese are different hashes (expected with bcrypt salt)")
            print("But they should still match when using checkpw...")
            
            # The issue must be that the password stored is NOT 'debug123'
            print("\n" + "="*60)
            print("ROOT CAUSE: The password hash in the database")
            print("was created from a DIFFERENT password than 'debug123'")
            print("="*60)
            
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
else:
    print("User not found!")
