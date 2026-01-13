# Testing endpoints directly
import requests

base_url = "http://localhost:5000/api"

# Step 1: Login
print("1. Testing login...")
login_response = requests.post(f"{base_url}/auth/login", json={
    "email": "admin@test.com",
    "password": "admin123"
})
print(f"   Status: {login_response.status_code}")
if login_response.ok:
    data = login_response.json()
    token = data.get('access_token')
    print(f"   Token received: {token[:30]}...")
    
    # Step 2: Test /api/auth/me
    print("\n2. Testing /api/auth/me...")
    me_response = requests.get(f"{base_url}/auth/me", headers={
        "Authorization": f"Bearer {token}"
    })
    print(f"   Status: {me_response.status_code}")
    print(f"   Response: {me_response.text[:200]}")
    
    # Step 3: Test /api/dashboard/stats  
    print("\n3. Testing /api/dashboard/stats...")
    stats_response = requests.get(f"{base_url}/dashboard/stats", headers={
        "Authorization": f"Bearer {token}"
    })
    print(f"   Status: {stats_response.status_code}")
    print(f"   Response: {stats_response.text[:200]}")
else:
    print(f"   Login failed: {login_response.text}")
