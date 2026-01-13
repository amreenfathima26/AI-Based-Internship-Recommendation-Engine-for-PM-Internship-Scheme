import sqlite3
import os
from typing import Optional, Dict, Any
import bcrypt
try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
except ImportError:
    psycopg2 = None

def get_jwt_secret_key():
    return os.environ.get('JWT_SECRET_KEY', 'default-super-secret-key-change-in-production')

class Database:
    """Database handler for user management (Supports SQLite and PostgreSQL)"""
    
    def __init__(self, db_path='users.db'):
        self.db_url = os.environ.get('DATABASE_URL')
        self.db_path = db_path
        self.is_postgres = bool(self.db_url)
        self.init_database()
    
    def get_connection(self):
        """Get database connection"""
        if self.is_postgres:
            if not psycopg2:
                raise ImportError("psycopg2 is required for PostgreSQL connections")
            conn = psycopg2.connect(self.db_url)
            return conn
        else:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            return conn
    
    def get_cursor(self, conn):
        if self.is_postgres:
            return conn.cursor(cursor_factory=RealDictCursor)
        else:
            return conn.cursor()

    def _query(self, sql, params=()):
        """Helper to handle parameter substitution difference"""
        if self.is_postgres:
            sql = sql.replace('?', '%s')
        return sql, params

    def init_database(self):
        """Initialize database tables"""
        conn = self.get_connection()
        cursor = self.get_cursor(conn)
        
        # SQLite uses AUTOINCREMENT, Postgres uses SERIAL (which is handled by creating table standard SQL mostly)
        # But for compatibility, we will use specific dialetcs if needed. 
        # Ideally, we create tables only if they don't exist.
        
        # Helper to adjust types
        def adjust_type(sql):
            if self.is_postgres:
                sql = sql.replace('INTEGER PRIMARY KEY AUTOINCREMENT', 'SERIAL PRIMARY KEY')
                sql = sql.replace('datetime', 'TIMESTAMP')
            return sql

        cursor.execute(adjust_type('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                full_name TEXT NOT NULL,
                phone TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        '''))
        
        cursor.execute(adjust_type('''
            CREATE TABLE IF NOT EXISTS user_profiles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                education TEXT,
                skills TEXT,
                interests TEXT,
                location TEXT,
                previous_experience INTEGER DEFAULT 0,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                bio TEXT,
                institution TEXT,
                gpa TEXT,
                academic_score TEXT,
                languages TEXT,
                certifications TEXT,
                github TEXT,
                linkedin TEXT,
                projects_json TEXT,
                work_history_json TEXT,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        '''))

        cursor.execute(adjust_type('''
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
        '''))

        cursor.execute(adjust_type('''
            CREATE TABLE IF NOT EXISTS ats_scans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                role_title TEXT,
                match_score REAL,
                missing_keywords TEXT,
                scan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        '''))

        cursor.execute(adjust_type('''
            CREATE TABLE IF NOT EXISTS quiz_results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                subject TEXT,
                score REAL,
                total_questions INTEGER,
                scan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        '''))
        
        conn.commit()
        conn.close()
    
    def hash_password(self, password: str) -> str:
        """Hash a password using bcrypt"""
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def verify_password(self, password: str, password_hash: str) -> bool:
        """Verify a password against its hash"""
        try:
            return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))
        except Exception:
            return False
    
    def create_user(self, email: str, password: str, full_name: str, phone: str = None) -> Optional[int]:
        """Create a new user"""
        try:
            conn = self.get_connection()
            cursor = self.get_cursor(conn)
            
            password_hash = self.hash_password(password)
            
            sql, params = self._query('''
                INSERT INTO users (email, password_hash, full_name, phone)
                VALUES (?, ?, ?, ?)
            ''', (email.lower(), password_hash, full_name, phone))
            
            cursor.execute(sql, params)
            
            if self.is_postgres:
                if isinstance(cursor, psycopg2.extensions.cursor):  # Check if it's a raw cursor or RealDictCursor
                     pass # RealDictCursor might not have lastrowid easily accessible if not returned
                
                # In Postgres, we need RETURNING id to get the inserted ID
                # Re-executing with RETURNING is cleaner for Postgres
                # But to keep simple logic, let's just fetch by email after or use RETURNING
                conn.rollback() # Rollback the previous insert attempt to restart with correct syntax
                
                cursor.execute('INSERT INTO users (email, password_hash, full_name, phone) VALUES (%s, %s, %s, %s) RETURNING id', 
                               (email.lower(), password_hash, full_name, phone))
                user_id = cursor.fetchone()['id']
            else:
                user_id = cursor.lastrowid
                
            conn.commit()
            conn.close()
            return user_id
        except Exception as e:
            print(f"Create user error: {e}")
            return None  # Email already exists
    
    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get user by email"""
        conn = self.get_connection()
        cursor = self.get_cursor(conn)
        
        sql, params = self._query('SELECT * FROM users WHERE email = ?', (email.lower(),))
        cursor.execute(sql, params)
        row = cursor.fetchone()
        conn.close()
        
        if row:
            return dict(row)
        return None
    
    def get_user_by_id(self, user_id: int) -> Optional[Dict[str, Any]]:
        """Get user by ID"""
        conn = self.get_connection()
        cursor = self.get_cursor(conn)
        
        sql, params = self._query('SELECT id, email, full_name, phone, created_at FROM users WHERE id = ?', (user_id,))
        cursor.execute(sql, params)
        row = cursor.fetchone()
        conn.close()
        
        if row:
            return dict(row)
        return None
    
    def authenticate_user(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        """Authenticate user with email and password"""
        user = self.get_user_by_email(email)
        if user and self.verify_password(password, user['password_hash']):
            # Return user without password hash
            return {
                'id': user['id'],
                'email': user['email'],
                'full_name': user['full_name'],
                'phone': user['phone']
            }
        return None
    
    def save_user_profile(self, user_id: int, profile: Dict[str, Any]) -> bool:
        """Save or update user profile with comprehensive fields"""
        try:
            conn = self.get_connection()
            cursor = self.get_cursor(conn)
            
            # Check if profile exists
            sql, params = self._query('SELECT id FROM user_profiles WHERE user_id = ?', (user_id,))
            cursor.execute(sql, params)
            existing = cursor.fetchone()
            
            skills_json = ','.join(profile.get('skills', []))
            interests_json = ','.join(profile.get('interests', []))
            previous_exp = 1 if profile.get('previous_experience', False) else 0
            
            # New fields
            bio = profile.get('bio', '')
            institution = profile.get('institution', '')
            gpa = profile.get('gpa', '')
            academic_score = profile.get('academic_score', '')
            languages = profile.get('languages', '')
            certifications = profile.get('certifications', '')
            github = profile.get('github', '')
            
            # V2 Fields - Full Profile Expansion
            linkedin = profile.get('linkedin', '')
            projects_json = profile.get('projects_json', '[]')
            work_history_json = profile.get('work_history_json', '[]')
            
            if existing:
                # Update existing profile
                sql, params = self._query('''
                    UPDATE user_profiles
                    SET education = ?, skills = ?, interests = ?, location = ?,
                        previous_experience = ?, updated_at = CURRENT_TIMESTAMP,
                        bio = ?, institution = ?, gpa = ?, academic_score = ?,
                        languages = ?, certifications = ?, github = ?,
                        linkedin = ?, projects_json = ?, work_history_json = ?
                    WHERE user_id = ?
                ''', (profile.get('education'), skills_json, interests_json,
                      profile.get('location'), previous_exp,
                      bio, institution, gpa, academic_score, languages, certifications, github,
                      linkedin, projects_json, work_history_json,
                      user_id))
                cursor.execute(sql, params)
            else:
                # Insert new profile
                sql, params = self._query('''
                    INSERT INTO user_profiles (
                        user_id, education, skills, interests, location, previous_experience,
                        bio, institution, gpa, academic_score, languages, certifications, github,
                        linkedin, projects_json, work_history_json
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (user_id, profile.get('education'), skills_json, interests_json,
                      profile.get('location'), previous_exp,
                      bio, institution, gpa, academic_score, languages, certifications, github,
                      linkedin, projects_json, work_history_json))
                cursor.execute(sql, params)
            
            conn.commit()
            conn.close()
            return True
        except Exception as e:
            print(f"Error saving profile: {e}")
            return False
    
    def get_user_profile(self, user_id: int) -> Optional[Dict[str, Any]]:
        """Get user profile"""
        conn = self.get_connection()
        cursor = self.get_cursor(conn)
        
        sql, params = self._query('SELECT * FROM user_profiles WHERE user_id = ?', (user_id,))
        cursor.execute(sql, params)
        row = cursor.fetchone()
        conn.close()
        
        if row:
            profile = dict(row)
            # Parse skills and interests from comma-separated strings
            profile['skills'] = profile['skills'].split(',') if profile.get('skills') else []
            profile['interests'] = profile['interests'].split(',') if profile.get('interests') else []
            profile['previous_experience'] = bool(profile.get('previous_experience'))
            
            profile['linkedin'] = profile.get('linkedin') or ''
            profile['projects_json'] = profile.get('projects_json') or '[]'
            profile['work_history_json'] = profile.get('work_history_json') or '[]'
            
            return profile
        return None
    
    def add_application(self, user_id, company, role, link):
        conn = self.get_connection()
        cursor = self.get_cursor(conn)
        sql, params = self._query('''
            INSERT INTO applications (user_id, company_name, role_title, status, job_link)
            VALUES (?, ?, ?, ?, ?)
        ''', (user_id, company, role, 'Applied', link))
        cursor.execute(sql, params)
        conn.commit()
        conn.close()
    
    def get_applications(self, user_id):
        conn = self.get_connection()
        cursor = self.get_cursor(conn)
        
        sql, params = self._query('SELECT * FROM applications WHERE user_id = ? ORDER BY applied_date DESC', (user_id,))
        cursor.execute(sql, params)
        rows = cursor.fetchall()
        
        conn.close()
        return [dict(row) for row in rows]
    
    def add_ats_scan(self, user_id, role, score, missing):
        conn = self.get_connection()
        cursor = self.get_cursor(conn)
        
        sql, params = self._query('INSERT INTO ats_scans (user_id, role_title, match_score, missing_keywords) VALUES (?, ?, ?, ?)',
                       (user_id, role, score, missing))
        cursor.execute(sql, params)
        conn.commit()
        conn.close()
        
    def add_quiz_result(self, user_id, subject, score, total):
        conn = self.get_connection()
        cursor = self.get_cursor(conn)
        
        sql, params = self._query('INSERT INTO quiz_results (user_id, subject, score, total_questions) VALUES (?, ?, ?, ?)',
                       (user_id, subject, score, total))
        cursor.execute(sql, params)
        conn.commit()
        conn.close()

    def get_dashboard_stats(self, user_id):
        conn = self.get_connection()
        cursor = self.get_cursor(conn)
        
        stats = {"applications": {"total": 0, "breakdown": {}}, "learning": {"avg_quiz_score": 0}, "recent_activity": []}
        
        try:
             # App Stats
            sql, params = self._query('SELECT COUNT(*), status FROM applications WHERE user_id = ? GROUP BY status', (user_id,))
            cursor.execute(sql, params)
            rows = cursor.fetchall()
            
            app_stats = {}
            for row in rows:
                if self.is_postgres:
                    app_stats[row['status']] = row['count']
                else:
                     app_stats[row[1]] = row[0]
            
            stats["applications"]["total"] = sum(app_stats.values()) if app_stats else 0
            stats["applications"]["breakdown"] = app_stats
            
            # Quiz Stats
            sql, params = self._query('SELECT AVG(score) as avg_s, AVG(total_questions) as avg_t FROM quiz_results WHERE user_id = ?', (user_id,))
            cursor.execute(sql, params)
            avg_row = cursor.fetchone()
            
            avg_quiz = 0
            if avg_row:
                 # Standardize access
                s = avg_row['avg_s'] if self.is_postgres else avg_row[0]
                t = avg_row['avg_t'] if self.is_postgres else avg_row[1]
                
                if s is not None and t is not None:
                    avg_quiz = round((s / t) * 100, 1)
            stats["learning"]["avg_quiz_score"] = avg_quiz
            
            # Recent Activity
            # This query is tricky across DBs due to string literals and column aliasing slightly diff
            # But standard SQL should hold for simple unions.
            # CAST(score AS TEXT) is valid in both.
            
            sql = '''
                SELECT company_name as title, role_title as subtitle, applied_date as date, 'Application' as type 
                FROM applications WHERE user_id = ? 
                UNION ALL 
                SELECT subject as title, CAST(score AS TEXT) as subtitle, scan_date as date, 'Quiz' as type 
                FROM quiz_results WHERE user_id = ? 
                ORDER BY date DESC LIMIT 5
            '''
            
            sql, params = self._query(sql, (user_id, user_id))
            cursor.execute(sql, params)
            stats["recent_activity"] = [dict(row) for row in cursor.fetchall()]
            
        except Exception as e:
            print(f"Stats error: {e}")
            
        conn.close()
        return stats
