# Authentication System Documentation

## Overview

The PM Internship Recommendation Engine now includes a complete user authentication system with registration, login, and profile management.

## Features

✅ User Registration
✅ User Login
✅ JWT-based Authentication
✅ Password Hashing (Bcrypt)
✅ Profile Saving & Loading
✅ Persistent Sessions
✅ Protected API Endpoints

## How It Works

### Backend

1. **Database**: SQLite database (`users.db`) stores:
   - User accounts (email, password hash, name, phone)
   - User profiles (education, skills, interests, location, experience)

2. **Authentication Flow**:
   - User registers → Password is hashed → User created in database → JWT token returned
   - User logs in → Password verified → JWT token returned
   - Subsequent requests include JWT token in Authorization header

3. **JWT Tokens**:
   - Valid for 24 hours
   - Stored in localStorage on frontend
   - Automatically sent with API requests when authenticated

### Frontend

1. **Authentication States**:
   - Not authenticated: Shows login/register forms
   - Authenticated: Shows recommendation form with saved profile

2. **Token Management**:
   - Token stored in localStorage
   - Automatically included in API requests
   - Removed on logout

3. **Profile Management**:
   - When user gets recommendations, profile is automatically saved
   - On login, saved profile is loaded and form is pre-filled

## User Flow

1. **New User**:
   - Register → Fill form → Get recommendations (profile saved automatically) → Logout

2. **Returning User**:
   - Login → Form pre-filled with saved profile → Update if needed → Get recommendations

## Security Features

- ✅ Passwords hashed with bcrypt (salt rounds included)
- ✅ JWT tokens for stateless authentication
- ✅ Email uniqueness enforced
- ✅ Password validation (minimum 6 characters)
- ✅ SQL injection protection (parameterized queries)
- ✅ Input validation on all endpoints

## API Endpoints

### Public Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Protected Endpoints (require JWT token)
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/profile` - Save user profile
- `POST /api/recommend` - Get recommendations (optional auth, saves profile if authenticated)

## Database Schema

### users table
- id (INTEGER PRIMARY KEY)
- email (TEXT UNIQUE)
- password_hash (TEXT)
- full_name (TEXT)
- phone (TEXT)
- created_at (TIMESTAMP)

### user_profiles table
- id (INTEGER PRIMARY KEY)
- user_id (INTEGER, FOREIGN KEY)
- education (TEXT)
- skills (TEXT - comma separated)
- interests (TEXT - comma separated)
- location (TEXT)
- previous_experience (INTEGER)
- updated_at (TIMESTAMP)

## Configuration

**Important**: Change the JWT secret key in production!

In `backend/app.py`:
```python
app.config['JWT_SECRET_KEY'] = 'your-secret-key-change-in-production'
```

Use a strong, random secret key in production environment.

## Troubleshooting

### Database Issues
- Database file (`users.db`) is created automatically on first run
- If you need to reset, delete `backend/users.db` and restart the server

### Token Issues
- Token expires after 24 hours - user needs to login again
- Invalid tokens are automatically handled, user redirected to login

### Profile Not Loading
- Check browser console for errors
- Verify token is in localStorage: `localStorage.getItem('token')`
- Check backend logs for authentication errors

