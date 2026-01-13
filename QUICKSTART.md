# Quick Start Guide

Follow these simple steps to get the PM Internship Recommendation Engine up and running.

## Step 1: Backend Setup (Terminal 1)

```bash
# Navigate to backend
cd backend

# Create virtual environment (Windows)
python -m venv venv
venv\Scripts\activate

# Or (Linux/Mac)
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend server
python app.py
```

✅ Backend should be running on `http://localhost:5000`

## Step 2: Frontend Setup (Terminal 2)

Open a new terminal window:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start React app
npm start
```

✅ Frontend should open automatically at `http://localhost:3000`

## Step 3: Test the Application

1. Fill in your profile details:
   - Select education level
   - Choose your skills (at least one)
   - Select sector interests (optional)
   - Choose preferred location
   - Check if you have previous experience

2. Click "Get Recommendations"

3. View your personalized internship matches!

## Troubleshooting

### Backend Issues
- **Port 5000 already in use**: Change port in `backend/app.py` line 55
- **Module not found**: Make sure virtual environment is activated and dependencies are installed

### Frontend Issues
- **Port 3000 already in use**: React will automatically suggest using port 3001
- **npm install fails**: Try `npm install --legacy-peer-deps`
- **API connection error**: Ensure backend is running on port 5000

### CORS Issues
- Backend has CORS enabled for all origins (development only)
- For production, configure CORS to allow only your frontend domain

## Next Steps

- Customize internship data in `backend/data/internships.json`
- Adjust recommendation weights in `backend/recommendation_engine.py`
- Customize UI styling in `frontend/src/components/*.css`
- Add more features as needed

Happy coding! 🚀

