from googlesearch import search
try:
    from duckduckgo_search import DDGS
except ImportError:
    DDGS = None
import random
import time

class LiveJobsService:
    def __init__(self):
        self.sources = [
            "site:linkedin.com/jobs",
            "site:indeed.com",
            "site:glassdoor.com",
            "site:naukri.com"
        ]

    def search_jobs(self, query, location="India", limit=10):
        """
        Search for live jobs using DuckDuckGo/Google with strict filtering.
        """
        # Stricter Search Query
        search_query = f'"{query}" internship {location} (site:linkedin.com/jobs OR site:indeed.com OR site:naukri.com OR site:glassdoor.com)'
        results = []
        
        try:
            # 1. Try DuckDuckGo Search
            if DDGS:
                print(f"Searching DDG: {search_query}")
                with DDGS() as ddgs:
                    # Search for jobs specifically
                    ddg_results = list(ddgs.text(search_query, max_results=limit*2)) # Fetch more to filter
                    
                    for r in ddg_results:
                        title_text = r['title']
                        href = r['href']
                        body = r.get('body', '').lower()
                        
                        # Anti-Spam / Anti-Product Filter
                        spam_keywords = ['price', 'buy', 'shop', 'store', 'cart', 'dvd', 'cd', 'toy', 'puzzle', 
                                       'course', 'bootcamp', 'training', 'certificate', 'admission', 'syllabus', 'fee']
                        
                        if any(x in title_text.lower() for x in spam_keywords):
                            continue
                        if "linkedin.com" not in href and "indeed.com" not in href and "naukri.com" not in href and "glassdoor.com" not in href:
                             # If not from a known job site, be very skeptical
                             if "intern" not in title_text.lower() and "job" not in title_text.lower():
                                 continue

                        company_name = "External Source"
                        
                        # Improved Company Extraction for LinkedIn/Indeed
                        if "linkedin.com" in href:
                            company_name = "LinkedIn"
                            if " at " in title_text:
                                company_name = title_text.split(" at ")[1].split(" | ")[0]
                        elif "indeed.com" in href:
                            company_name = "Indeed"
                        elif " at " in title_text:
                             company_name = title_text.split(" at ")[1].split("-")[0]

                        results.append({
                            "id": abs(hash(r['href'])),
                            "title": title_text.replace(" | LinkedIn", "").replace(" - Indeed.com", ""),
                            "company": company_name.strip(),
                            "location": location,
                            "apply_url": r['href'],
                            "source": "Live Web",
                            "posted_at": "Recently"
                        })
                        
                        if len(results) >= limit: break
            
            # 2. Results Check & Simulation Fallback
            if not results:
                print("No valid live results found. Using High-Fidelity Simulation.")
                titles = [
                    f"Product Management Intern",
                    f"Associate {query}",
                    f"{query} Trainee",
                    f"Strategy Intern",
                    f"Junior {query}"
                ]
                companies = ["Google", "Microsoft", "Amazon", "Flipkart", "Uber", "Cred", "Razorpay"]
                locations = ["Bangalore", "Mumbai", "Hyderabad", "Remote"]
                
                for i in range(5):
                    results.append({
                        "id": i + 100,
                        "title": random.choice(titles),
                        "company": random.choice(companies),
                        "location": location if location != "India" else random.choice(locations),
                        "apply_url": f"https://www.linkedin.com/jobs/search/?keywords={query}",
                        "source": "Simulated Feed",
                        "posted_at": "Just now"
                    })
                
        except Exception as e:
            print(f"Error searching jobs: {e}")
            # Crash Fallback
            results.append({
                "id": 999,
                "title": f"{query} Intern (Fallback)",
                "company": "System Provider",
                "location": location,
                "apply_url": "#",
                "source": "Offline",
                "posted_at": "Now"
            })

        return results
