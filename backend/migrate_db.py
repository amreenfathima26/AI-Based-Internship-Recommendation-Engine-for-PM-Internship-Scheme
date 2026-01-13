import sqlite3
import os

DB_PATH = 'users.db'

def migrate():
    print(f"Migrating database at {DB_PATH}...")
    if not os.path.exists(DB_PATH):
        print("Database not found!")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    columns_to_add = [
        ("bio", "TEXT"),
        ("institution", "TEXT"),
        ("gpa", "TEXT"),
        ("academic_score", "TEXT"),
        ("languages", "TEXT"),
        ("certifications", "TEXT"),
        ("github", "TEXT")
    ]

    for col_name, col_type in columns_to_add:
        try:
            print(f"Adding column '{col_name}'...")
            cursor.execute(f"ALTER TABLE user_profiles ADD COLUMN {col_name} {col_type}")
            print(f"Column '{col_name}' added successfully.")
        except sqlite3.OperationalError as e:
            if "duplicate column" in str(e):
                print(f"Column '{col_name}' already exists.")
            else:
                print(f"Error adding column '{col_name}': {e}")

    conn.commit()
    conn.close()
    print("Migration complete.")

if __name__ == "__main__":
    migrate()
