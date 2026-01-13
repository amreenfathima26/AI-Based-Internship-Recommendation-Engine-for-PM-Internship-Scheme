# PM Internship Scheme - AI Based Recommendation Engine

A lightweight, AI-powered recommendation engine that helps candidates find the most relevant internships based on their profile, skills, interests, and location preferences. Designed with simplicity and mobile-first approach for users with varying digital literacy levels.



Admin	admin@test.com	admin123


## 🎯 Features

- **User Authentication**: Secure login and registration system with JWT tokens
- **Profile Management**: Save and load user profiles automatically
- **Personalized Recommendations**: Get 3-5 top internship matches based on your profile
- **Simple Interface**: User-friendly, mobile-compatible design with visual cues
- **Lightweight AI**: Rule-based recommendation algorithm with weighted scoring
- **Multiple Factors**: Considers education, skills, interests, location, and experience
- **Clear Results**: Card-based display with match scores and detailed information
- **Mobile Responsive**: Works seamlessly on smartphones and tablets

## 🏗️ Architecture

### Backend
- **Framework**: Flask (Python)
- **Authentication**: JWT-based authentication with Flask-JWT-Extended
- **Database**: SQLite for user management and profile storage
- **Algorithm**: Rule-based recommendation engine with weighted scoring
- **API**: RESTful API endpoints
- **Data**: JSON-based internship database

### Frontend
- **Framework**: React
- **Design**: Mobile-first, responsive UI
- **Styling**: CSS with modern gradients and animations
- **API Integration**: Fetch API for backend communication

## 📋 Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn

## 🚀 Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the backend server:
```bash
python app.py
```

The backend API will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 🔑 Quick Start Credentials

### Option 1: Use Registration (RECOMMENDED)

Since login is having issues, use the registration form instead:

1. Go to http://localhost:3000
2. Click **"Request Credentials"** (at the bottom of the login form)
3. Fill in the registration form:
   - Full Name: Your Name
   - Email: `youremail@test.com`
   - Password: `yourpassword`
   - Confirm: `yourpassword`
4. Click "Finalize Onboarding"
5. You should be logged in automatically

### Option 2: Pre-created Test Accounts

These accounts exist in the database and authentication works when tested directly:

**Account 1**
- Email: `test@corp.com`
- Password: `test123`

**Account 2**
- Email: `demo@intern.com`
- Password: `demo123`

### Troubleshooting Login

If login still shows "Invalid credentials":
1. Open browser DevTools (F12) -> Console tab -> Check for red errors.
2. The backend authentication works correctly - the issue is likely in how the request is being transmitted from the browser.

## 📡 API Endpoints

### Authentication Endpoints

### POST `/api/auth/register`
Register a new user
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "phone": "1234567890" // optional
}
```
- **Response**: `{"message": "User registered successfully", "access_token": "...", "user": {...}}`

### POST `/api/auth/login`
Login user
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Response**: `{"message": "Login successful", "access_token": "...", "user": {...}}`

### GET `/api/auth/me`
Get current authenticated user (requires JWT token)
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{"user": {...}}`

### POST `/api/auth/profile`
Save user profile (requires JWT token)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: Same as `/api/recommend`
- **Response**: `{"message": "Profile saved successfully", "profile": {...}}`

### Recommendation Endpoints

### GET `/api/health`
Health check endpoint
- **Response**: `{"status": "healthy", "message": "Recommendation API is running"}`

### GET `/api/internships`
Get all available internships
- **Response**: `{"internships": [...]}`

### POST `/api/recommend`
Get personalized recommendations (works with or without authentication)
- **Headers**: `Authorization: Bearer <token>` (optional)
- **Request Body**:
```json
{
  "education": "undergraduate" | "graduate",
  "skills": ["skill1", "skill2", ...],
  "interests": ["interest1", "interest2", ...],
  "location": "Location Name",
  "previous_experience": true | false
}
```
- **Response**: `{"recommendations": [...], "profile": {...}}`
- **Note**: If authenticated, profile is automatically saved

### GET `/api/sectors`
Get available sectors/interests
- **Response**: `{"sectors": [...]}`

## 🔧 Recommendation Algorithm

The recommendation engine uses a weighted scoring system based on:

1. **Education Match** (25%): Matches candidate's education level with requirements
2. **Skills Match** (30%): Compares candidate skills with required skills
3. **Interest/Sector Match** (25%): Matches candidate interests with internship sectors
4. **Location Match** (15%): Considers location preference and remote availability
5. **Experience Match** (5%): Matches experience requirements

Final scores are normalized and top 5 recommendations are returned.

## 📁 Project Structure

```
.
├── backend/
│   ├── app.py                 # Flask application
│   ├── recommendation_engine.py  # Recommendation algorithm
│   ├── requirements.txt       # Python dependencies
│   └── data/
│       └── internships.json   # Internship database
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js            # Main React component
│   │   ├── App.css
│   │   ├── index.js
│   │   ├── index.css
│   │   └── components/
│   │       ├── RecommendationForm.js
│   │       ├── RecommendationForm.css
│   │       ├── RecommendationResults.js
│   │       └── RecommendationResults.css
│   └── package.json
└── README.md
```

## 🎨 UI Features

- **Visual Cues**: Emojis and icons for easy understanding
- **Color-coded Match Scores**: 
  - Green (80%+): Excellent Match
  - Orange (60-79%): Good Match
  - Light Orange (<60%): Fair Match
- **Card-based Layout**: Clean, scannable internship cards
- **Mobile Optimized**: Touch-friendly buttons and responsive design
- **Minimal Text**: Clear, concise information display

## 🔒 Security & Best Practices

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for password security
- **SQLite Database**: Lightweight database for user management
- **CORS enabled**: For frontend-backend communication
- **Input validation**: On backend for all endpoints
- **Error handling**: Comprehensive error handling for API requests
- **Protected routes**: Authentication required for profile management
- **Responsive design**: For all screen sizes
- **Note**: Change JWT_SECRET_KEY in production environment

## 🌐 Deployment Considerations

### Backend
- Can be deployed on Heroku, AWS, or any Python hosting service
- Set `FLASK_ENV=production` for production
- Use a proper WSGI server like Gunicorn for production

### Frontend
- Build for production: `npm run build`
- Deploy to Netlify, Vercel, or any static hosting service
- Update API URL in production environment

## 🔄 Future Enhancements

- Integration with existing PM Internship Scheme portal
- Regional language support (Hindi, regional languages)
- User authentication and profile saving
- Advanced ML-based recommendations
- Analytics and recommendation tracking
- Feedback mechanism for recommendation quality

## 📝 License

This project is developed for the PM Internship Scheme.

## 👥 Contributing

This is a prototype for the PM Internship Scheme recommendation system.

## 📞 Support

For issues or questions, please refer to the project documentation or contact the development team.

---

**Note**: This is a functional prototype designed for demonstration and integration purposes. The recommendation algorithm can be enhanced with more sophisticated ML models based on actual usage data and requirements.

