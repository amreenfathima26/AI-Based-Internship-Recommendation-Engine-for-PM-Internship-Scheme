import requests
import json

url = 'http://localhost:5000/api/recommend'
headers = {'Content-Type': 'application/json'}
data = {
  "education": "undergraduate",
  "skills": ["social media", "content writing"],
  "interests": ["Technology and Digital"],
  "location": "New Delhi",
  "previous_experience": False
}

try:
    response = requests.post(url, headers=headers, json=data)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        results = response.json()
        print(f"Results count: {len(results.get('recommendations', []))}")
        for r in results.get('recommendations', []):
            print(f"- {r['title']} ({r['organization']}): {r['match_score']}%")
    else:
        print(f"Error: {response.text}")
except Exception as e:
    print(f"Request failed: {e}")
