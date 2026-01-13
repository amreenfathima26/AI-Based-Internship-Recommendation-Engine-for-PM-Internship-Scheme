import re
import os
from pypdf import PdfReader
from collections import Counter
import json

class ATSService:
    def __init__(self):
        pass

    def extract_text_from_pdf(self, file_path):
        """Extract text from a PDF file."""
        try:
            reader = PdfReader(file_path)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text
        except Exception as e:
            print(f"Error reading PDF: {e}")
            return ""

    def calculate_score(self, resume_text, job_description):
        """
        Calculate an ATS score based on keyword matching.
        Returns: Score (0-100), Missing Keywords, Found Keywords
        """
        resume_text = resume_text.lower()
        job_description = job_description.lower()
        
        # 1. Extract Keywords from Job Description (Simple Frequency Analysis)
        # remove common stop words
        stop_words = set(['and', 'the', 'to', 'of', 'in', 'for', 'with', 'a', 'an', 'is', 'are', 'on', 'at', 'be', 'will', 'that', 'this', 'by', 'as'])
        words = re.findall(r'\b[a-z]{2,}\b', job_description)
        filtered_words = [w for w in words if w not in stop_words]
        
        # Get most common significant words (potential keywords)
        # In a real system, we'd use a predefined skills database
        common_keywords = [word for word, count in Counter(filtered_words).most_common(20)]
        
        # 2. Check for Keywords in Resume
        found_keywords = []
        missing_keywords = []
        
        match_count = 0
        for keyword in common_keywords:
            if keyword in resume_text:
                found_keywords.append(keyword)
                match_count += 1
            else:
                missing_keywords.append(keyword)
        
        # 3. Calculate Score
        if not common_keywords:
            return 50, [], [] # Default if description is too short
            
        score = (match_count / len(common_keywords)) * 100
        
        # Boost score for essential sections
        if "education" in resume_text:
            score += 5
        if "skills" in resume_text:
            score += 5
        if "project" in resume_text or "experience" in resume_text:
            score += 5
            
        return min(round(score, 1), 100), missing_keywords, found_keywords

    def analyze_resume(self, file_storage, job_description):
        """
        Analyze resume using Groq AI.
        """
        # Save temp file
        filename = "temp_resume.pdf"
        file_storage.save(filename)
        
        # Extract Text
        text = self.extract_text_from_pdf(filename)
        
        # Clean up
        if os.path.exists(filename):
            os.remove(filename)
            
        if not text:
            return {"error": "Could not extract text from PDF"}

        # Try AI Analysis first
        try:
            from groq import Groq
            client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
            
            prompt = f"""
            Act as an expert ATS (Applicant Tracking System). 
            Analyze the following RESUME text against the JOB DESCRIPTION.
            
            JOB DESCRIPTION:
            {job_description[:1000]}...
            
            RESUME:
            {text[:2000]}...
            
            Return a JSON object with this exact structure:
            {{
                "score": <number 0-100>,
                "missing_keywords": [<list of strings>],
                "matched_keywords": [<list of strings>],
                "verdict": "<Excellent/Good/Needs Improvement/Poor>",
                "summary": "<1 sentence summary>"
            }}
            Only return the JSON.
            """
            
            completion = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama-3.3-70b-versatile",
                temperature=0.1,
                response_format={"type": "json_object"}
            )
            
            result = json.loads(completion.choices[0].message.content)
            return result
            
        except Exception as e:
            print(f"AI Analysis failed, falling back to keyword match: {e}")
            # Fallback to logic
            score, missing, found = self.calculate_score(text, job_description)
            return {
                "score": score,
                "missing_keywords": missing,
                "matched_keywords": found,
                "verdict": "Good" if score > 60 else "Needs Improvement",
                "summary": "Basic keyword analysis performed."
            }
