from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, verify_jwt_in_request
from datetime import timedelta
from dotenv import load_dotenv
import os

load_dotenv() # Load env vars from .env if present

# Set API Key
os.environ['GROQ_API_KEY'] = os.getenv('GROQ_API_KEY', 'default_key_if_needed')

# Import Services
from database import Database, get_jwt_secret_key
from recommendation_engine import RecommendationEngine
from live_jobs_service import LiveJobsService
from ats_service import ATSService
from interview_service import InterviewService
from quiz_service import QuizService

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = get_jwt_secret_key()
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
CORS(app)

jwt = JWTManager(app)

# Initialize Services
db = Database()
recommendation_engine = RecommendationEngine()
live_jobs_service = LiveJobsService()
ats_service = ATSService()
interview_service = InterviewService()
quiz_service = QuizService()

# --- Auth & User Management (Existing) ---

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        "status": "online",
        "message": "AI Based Internship Recommendation API",
        "endpoints": {
            "health": "/api/health",
            "auth": "/api/auth/*",
            "recommend": "/api/recommend"
        }
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Recommendation API is running"})

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        print(f"DEBUG REGISTER: Data received: {data}")  # Debug
        email = data.get('email')
        password = data.get('password')
        full_name = data.get('full_name')
        phone = data.get('phone')
        print(f"DEBUG REGISTER: Email: {email}, Password length: {len(password) if password else 0}, Name: {full_name}")  # Debug
        user_id = db.create_user(email, password, full_name, phone)
        if user_id:
            return jsonify({"message": "Registered", "access_token": create_access_token(identity=str(user_id)), "user": {"id": user_id, "full_name": full_name}}), 201
        return jsonify({"error": "Email exists"}), 400
    except Exception as e: 
        print(f"DEBUG REGISTER: Error: {str(e)}")  # Debug
        return jsonify({"error": str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        print(f"=" * 60)
        print(f"DEBUG LOGIN: Raw data received: {data}")
        
        email = data.get('email')
        password = data.get('password')
        
        print(f"DEBUG LOGIN: Email: '{email}'")
        print(f"DEBUG LOGIN: Password: '{password}'")
        print(f"DEBUG LOGIN: Password type: {type(password)}")
        print(f"DEBUG LOGIN: Password length: {len(password) if password else 0}")
        print(f"DEBUG LOGIN: Password repr: {repr(password)}")
        print(f"DEBUG LOGIN: Password bytes: {password.encode() if password else None}")
        
        # Get user from database
        user = db.get_user_by_email(email)
        print(f"DEBUG LOGIN: User found: {user is not None}")
        
        if not user:
            print(f"DEBUG LOGIN: User not found for email: {email}")
            return jsonify({"error": "Invalid credentials"}), 401
            
        print(f"DEBUG LOGIN: User ID: {user['id']}")
        print(f"DEBUG LOGIN: Stored hash (first 40): {user['password_hash'][:40]}...")
        
        # TEMPORARY: Try plaintext comparison first
        print(f"DEBUG LOGIN: Attempting bcrypt verification...")
        try:
            is_valid = db.verify_password(password, user['password_hash'])
            print(f"DEBUG LOGIN: Bcrypt result: {is_valid}")
        except Exception as e:
            print(f"DEBUG LOGIN: Bcrypt error: {e}")
            is_valid = False
        
        if is_valid:
            print(f"DEBUG LOGIN: Authentication SUCCESS!")
            user_data = {
                'id': user['id'],
                'email': user['email'],
                'full_name': user['full_name'],
                'phone': user['phone']
            }
            return jsonify({
                "message": "Login successful", 
                "access_token": create_access_token(identity=str(user['id'])), 
                "user": user_data
            }), 200
        else:
            print(f"DEBUG LOGIN: Authentication FAILED - password mismatch")
            return jsonify({"error": "Invalid credentials"}), 401
            
    except Exception as e:
        print(f"DEBUG LOGIN: Exception: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        user_id = int(get_jwt_identity())  # Convert string back to int
        user = db.get_user_by_id(user_id)
        if user:
            # Get profile, but don't fail if it doesn't exist
            profile = db.get_user_profile(user_id)
            user['profile'] = profile if profile else None
            return jsonify({"user": user})
        return jsonify({"error": "Not found"}), 404
    except Exception as e:
        print(f"Auth/me error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/auth/profile', methods=['POST'])
@jwt_required()
def save_profile():
    data = request.get_json()
    profile = {
        'education': data.get('education'),
        'skills': data.get('skills', []),
        'interests': data.get('interests', []),
        'location': data.get('location'),
        'previous_experience': data.get('previous_experience', False),
        'bio': data.get('bio'),
        'institution': data.get('institution'),
        'gpa': data.get('gpa'),
        'academic_score': data.get('academic_score'),
        'languages': data.get('languages'),
        'certifications': data.get('certifications'),
        'github': data.get('github'),
        'linkedin': data.get('linkedin'),
        'projects_json': data.get('projects_json'),
        'work_history_json': data.get('work_history_json')
    }
    if db.save_user_profile(get_jwt_identity(), profile):
        return jsonify({"message": "Saved", "profile": profile})
    return jsonify({"error": "Failed"}), 500

# --- Core Recommendation (Existing) ---

@app.route('/api/recommend', methods=['POST'])
def recommend_internships():
    try:
        data = request.get_json()
        user_id = None
        try:
            verify_jwt_in_request(optional=True)
            user_id = get_jwt_identity()
        except: pass

        candidate_profile = {
            'education': data.get('education', ''),
            'skills': data.get('skills', []),
            'interests': data.get('interests', []),
            'location': data.get('location', ''),
            'previous_experience': data.get('previous_experience', False)
        }
        
        if user_id: db.save_user_profile(user_id, candidate_profile)
        
        # 1. Get Static Recommendations
        recommendations = recommendation_engine.recommend(candidate_profile, top_n=5)
        
        # 2. Get Live Jobs (Real-time) based on skills/interests
        try:
            # Enhanced Search Query: Include top skills and first interest to capture "sector passions"
            skills = candidate_profile.get('skills', [])
            interests = candidate_profile.get('interests', [])
            
            query_parts = []
            if skills: query_parts.extend(skills[:2])
            if interests: query_parts.extend(interests[:1])
            
            if not query_parts: query_parts = ["Intern"]
            
            # Construct query: "Skill1 Skill2 Interest1 Intern"
            search_query = " ".join(str(p) for p in query_parts) + " Intern"
            
            location_query = candidate_profile.get('location', 'India')
            
            live_jobs = live_jobs_service.search_jobs(search_query, location_query)
            
            # Format live jobs to match recommendation structure & Add match score dummy
            formatted_live_jobs = []
            for job in live_jobs[:3]: # Limit to top 3 live jobs
                formatted_live_jobs.append({
                    "id": f"live_{job.get('id')}",
                    "title": job.get('title'),
                    "organization": job.get('company'),
                    "sector": "Live Recruitment",
                    "location": job.get('location'),
                    "duration": "Flexible",
                    "stipend": "Disclosed on Apply",
                    "description": "Real-time opportunity sourced from live job networks.",
                    "match_score": 95, # High score for live relevance
                    "topics": [],
                    "required_skills": candidate_profile.get('skills', [])[:3], # Assume relevance
                    "link": job.get('apply_url')
                })
            
            # Combine: Put live jobs at the top or mix
            recommendations = formatted_live_jobs + recommendations
            
        except Exception as e:
            print(f"Error fetching live jobs for recommendations: {e}")
            # Continue with just static if live fails

        return jsonify({"recommendations": recommendations, "profile": candidate_profile})
    except Exception as e: return jsonify({"error": str(e)}), 500

@app.route('/api/sectors', methods=['GET'])
def get_sectors():
    return jsonify({"sectors": recommendation_engine.get_available_sectors()})

# --- NEW FEATURES ---

# 1. Real-time Live Jobs
@app.route('/api/internships/live', methods=['GET'])
def get_live_internships():
    query = request.args.get('query', 'Product Manager')
    location = request.args.get('location', 'India')
    jobs = live_jobs_service.search_jobs(query, location)
    return jsonify({"jobs": jobs})

# 2. ATS Resume Analyzer
@app.route('/api/resume/analyze', methods=['POST'])
def analyze_resume():
    if 'resume' not in request.files:
        return jsonify({"error": "No resume file uploaded"}), 400
    
    file = request.files['resume']
    job_desc = request.form.get('job_description', '')
    
    result = ats_service.analyze_resume(file, job_desc)
    
    if "error" not in result:
        # Save scan to DB if user is logged in
        try:
            verify_jwt_in_request(optional=True)
            user_id = get_jwt_identity()
            if user_id:
                conn = db.get_connection()
                cursor = conn.cursor()
                cursor.execute('INSERT INTO ats_scans (user_id, role_title, match_score, missing_keywords) VALUES (?, ?, ?, ?)',
                               (user_id, "Custom Scan", result['score'], ','.join(result['missing_keywords'])))
                conn.commit()
                conn.close()
        except: pass
        
    return jsonify(result)

# 3. Interview Prep Hub
@app.route('/api/interview/questions', methods=['POST'])
def get_interview_questions():
    data = request.get_json()
    role = data.get('role', 'General')
    topic = data.get('topic', 'General')
    questions = interview_service.generate_questions(role, topic)
    return jsonify({"questions": questions})

@app.route('/api/interview/evaluate', methods=['POST'])
def evaluate_answer():
    data = request.get_json()
    result = interview_service.evaluate_answer(data.get('question'), data.get('answer'))
    return jsonify(result)

# 4. Mock Tests / Quizzes
@app.route('/api/quiz/<subject>', methods=['GET'])
def get_quiz(subject):
    questions = quiz_service.get_quiz(subject)
    return jsonify({"questions": questions})

@app.route('/api/quiz/score', methods=['POST'])
@jwt_required()
def submit_quiz_score():
    user_id = get_jwt_identity()
    data = request.get_json()
    subject = data.get('subject')
    answers = data.get('answers') # {q_id: option_index}
    
    result = quiz_service.calculate_score(answers, subject)
    
    # Save to DB
    conn = db.get_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO quiz_results (user_id, subject, score, total_questions) VALUES (?, ?, ?, ?)',
                   (user_id, subject, result['score'], result['total']))
    conn.commit()
    conn.close()
    
    return jsonify(result)

# 5. Application Tracking
@app.route('/api/applications', methods=['GET', 'POST'])
@jwt_required()
def handle_applications():
    user_id = get_jwt_identity()
    conn = db.get_connection()
    cursor = conn.cursor()
    
    if request.method == 'GET':
        cursor.execute('SELECT * FROM applications WHERE user_id = ? ORDER BY applied_date DESC', (user_id,))
        rows = cursor.fetchall()
        applications = [dict(row) for row in rows]
        conn.close()
        return jsonify({"applications": applications})
        
    elif request.method == 'POST':
        data = request.get_json()
        cursor.execute('''
            INSERT INTO applications (user_id, company_name, role_title, status, job_link)
            VALUES (?, ?, ?, ?, ?)
        ''', (user_id, data.get('company'), data.get('role'), 'Applied', data.get('link')))
        conn.commit()
        conn.close()
        return jsonify({"message": "Application tracked"}), 201

# 6. Student Dashboard Stats
@app.route('/api/dashboard/stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    try:
        user_id = get_jwt_identity()
        conn = db.get_connection()
        cursor = conn.cursor()
        
        # Get Application Count
        cursor.execute('SELECT COUNT(*), status FROM applications WHERE user_id = ? GROUP BY status', (user_id,))
        rows = cursor.fetchall()
        app_stats = {}
        for row in rows:
            app_stats[row[1]] = row[0]
        total_apps = sum(app_stats.values()) if app_stats else 0
        
        # Get Avg Quiz Score
        cursor.execute('SELECT AVG(score), AVG(total_questions) FROM quiz_results WHERE user_id = ?', (user_id,))
        avg_score_row = cursor.fetchone()
        avg_quiz = 0
        if avg_score_row and avg_score_row[0] is not None and avg_score_row[1] is not None:
            avg_quiz = round((avg_score_row[0] / avg_score_row[1]) * 100, 1)
            
        # Get Recent Activity - with error handling
        try:
            cursor.execute('''
                SELECT company_name as title, role_title as subtitle, applied_date as date, "Application" as type 
                FROM applications WHERE user_id = ? 
                UNION ALL 
                SELECT subject as title, CAST(score AS TEXT) as subtitle, scan_date as date, "Quiz" as type 
                FROM quiz_results WHERE user_id = ? 
                ORDER BY date DESC LIMIT 5
            ''', (user_id, user_id))
            activity = [dict(row) for row in cursor.fetchall()]
        except Exception as e:
            print(f"Activity query error: {e}")
            activity = []
        
        conn.close()
        
        # Get Live Market Stats (Quick Search Count)
        try:
            # Quick estimate of live jobs
            live_opps = len(live_jobs_service.search_jobs("Product Manager", "India", limit=50))
        except:
            live_opps = 120 # Fallback estimate if fetch fails

        return jsonify({
            "applications": {"total": total_apps, "breakdown": app_stats},
            "learning": {"avg_quiz_score": avg_quiz},
            "recent_activity": activity,
            "market": {"live_opportunities": live_opps}
        })
    except Exception as e:
        print(f"Dashboard stats error: {e}")
        import traceback
        traceback.print_exc()
        # Return empty stats instead of error
        return jsonify({
            "applications": {"total": 0, "breakdown": {}},
            "learning": {"avg_quiz_score": 0},
            "recent_activity": []
        }), 200

# 7. AI Chatbot
from chat_service import ChatService
chat_service = ChatService()

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    message = data.get('message', '')
    history = data.get('history', [])
    reply = chat_service.get_response(message, history)
    return jsonify({"reply": reply})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
