"""
COMPREHENSIVE FEATURE TESTING SCRIPT
Tests all 6 main features of the AI Internship Recommendation Engine
"""
import requests
import json
import time

BASE_URL = "http://localhost:5000/api"
token = None

print("="*70)
print("AI INTERNSHIP RECOMMENDATION ENGINE - FEATURE VERIFICATION")
print("="*70)

# Step 1: Login
print("\n[1/7] Testing Login...")
try:
    response = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "admin@test.com",
        "password": "admin123"
    })
    if response.ok:
        token = response.json()['access_token']
        print(f"   ✓ Login successful")
        print(f"   Token: {token[:40]}...")
    else:
        print(f"   ✗ Login failed: {response.text}")
        exit(1)
except Exception as e:
    print(f"   ✗ Error: {e}")
    exit(1)

headers = {"Authorization": f"Bearer {token}"}

# Step 2: Dashboard Stats
print("\n[2/7] Testing Dashboard Stats...")
try:
    response = requests.get(f"{BASE_URL}/dashboard/stats", headers=headers)
    if response.ok:
        data = response.json()
        print(f"   ✓ Dashboard stats loaded")
        print(f"     Applications: {data['applications']['total']}")
        print(f"     Avg Quiz Score: {data['learning']['avg_quiz_score']}%")
    else:
        print(f"   ✗ Failed: {response.text[:100]}")
except Exception as e:
    print(f"   ✗ Error: {e}")

# Step 3: Live Jobs
print("\n[3/7] Testing Live Jobs...")
try:
    response = requests.get(f"{BASE_URL}/internships/live?query=Product+Manager&location=India")
    if response.ok:
        data = response.json()
        jobs = data.get('jobs', [])
        print(f"   ✓ Live jobs loaded: {len(jobs)} jobs found")
        if jobs:
            print(f"     First job: {jobs[0].get('title', 'N/A')}")
    else:
        print(f"   ✗ Failed: {response.text[:100]}")
except Exception as e:
    print(f"   ✗ Error: {e}")

# Step 4: Interview Prep - Generate Questions
print("\n[4/7] Testing Interview Prep (Generate Questions)...")
try:
    response = requests.post(f"{BASE_URL}/interview/questions", 
                            headers=headers,
                            json={"role": "Product Manager", "topic": "General"})
    if response.ok:
        data = response.json()
        questions = data.get('questions', [])
        print(f"   ✓ Interview questions generated: {len(questions)} questions")
        if questions:
            print(f"     Q1: {questions[0][:60]}...")
    else:
        print(f"   ✗ Failed: {response.text[:100]}")
except Exception as e:
    print(f"   ✗ Error: {e}")

# Step 5: Quiz Hub
print("\n[5/7] Testing Quiz Hub...")
try:
    response = requests.get(f"{BASE_URL}/quiz/product-management")
    if response.ok:
        data = response.json()
        questions = data.get('questions', [])
        print(f"   ✓ Quiz loaded: {len(questions)} questions")
        if questions:
            print(f"     Q1: {questions[0]['question'][:60]}...")
    else:
        print(f"   ✗ Failed: {response.text[:100]}")
except Exception as e:
    print(f"   ✗ Error: {e}")

# Step 6: Profile
print("\n[6/7] Testing Profile (Get User)...")
try:
    response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    if response.ok:
        data = response.json()
        user = data.get('user', {})
        print(f"   ✓ Profile loaded")
        print(f"     Name: {user.get('full_name')}")
        print(f"     Email: {user.get('email')}")
    else:
        print(f"   ✗ Failed: {response.text[:100]}")
except Exception as e:
    print(f"   ✗ Error: {e}")

# Step 7: Chat/AI Assistant
print("\n[7/7] Testing AI Chat Assistant...")
try:
    response = requests.post(f"{BASE_URL}/chat",
                            headers=headers,
                            json={"message": "Hello, can you help me?"})
    if response.ok:
        data = response.json()
        reply = data.get('response', '')
        print(f"   ✓ Chat working")
        print(f"     AI Reply: {reply[:100]}...")
    else:
        print(f"   ✗ Failed: {response.text[:100]}")
except Exception as e:
    print(f"   ✗ Error: {e}")

print("\n" + "="*70)
print("FEATURE VERIFICATION COMPLETE")
print("="*70)
