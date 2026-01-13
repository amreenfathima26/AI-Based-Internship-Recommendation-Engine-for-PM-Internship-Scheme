import os
import json
import random

# Try to import groq, handle if not installed or configured
try:
    from groq import Groq
except ImportError:
    Groq = None

class InterviewService:
    def __init__(self):
        self.api_key = os.environ.get("GROQ_API_KEY")
        self.client = None
        if self.api_key and Groq:
            try:
                self.client = Groq(api_key=self.api_key)
            except Exception as e:
                print(f"Error initializing Groq client: {e}")

    def generate_questions(self, role, topic="general", count=5):
        """Generate interview questions for a specific role."""
        
        # Fallback questions if API is not available
        fallback_questions = [
            f"Tell me about a time you handled a difficult situation as a {role}.",
            f"What are your greatest strengths relevant to {role}?",
            f"Why do you want to work in the {topic} industry?",
            "Describe a project you are proud of.",
            "Where do you see yourself in 5 years?"
        ]

        if not self.client:
            return fallback_questions

        try:
            completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a professional technical interviewer. Generate strictly a JSON array of strings containing interview questions. The questions should be in the requested language if specified, otherwise English."
                    },
                    {
                        "role": "user",
                        "content": f"Generate {count} interview questions for a {role} position focusing on {topic}."
                    }
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.7,
            )
            content = completion.choices[0].message.content
            # Extract JSON list from text if needed
            start = content.find('[')
            end = content.rfind(']') + 1
            if start != -1 and end != -1:
                questions = json.loads(content[start:end])
                return questions
            else:
                return fallback_questions
        except Exception as e:
            print(f"Groq API Error: {e}")
            return fallback_questions

    def evaluate_answer(self, question, answer):
        """Evaluate a user's answer."""
        
        # Fallback evaluation
        if not self.client:
            word_count = len(answer.split())
            score = min(10, max(1, word_count // 5))  # Simple length-based scoring for demo
            feedback = "Good effort! Try to be more specific and use the STAR method."
            if word_count > 50:
                feedback = "Excellent detail! You covered the main points well."
            elif word_count < 10:
                feedback = "Too short. Please elaborate on your experience."
            
            return {
                "score": score,
                "feedback": feedback
            }

        try:
            completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an interview coach. Evaluate the answer and return JSON with 'score' (1-10) and 'feedback' (string)."
                    },
                    {
                        "role": "user",
                        "content": f"Question: {question}\nAnswer: {answer}"
                    }
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.7,
            )
            content = completion.choices[0].message.content
            # Try to parse JSON
            try:
                start = content.find('{')
                end = content.rfind('}') + 1
                result = json.loads(content[start:end])
                return result
            except:
                return {"score": 7, "feedback": content[:100] + "..."}

        except Exception as e:
            print(f"Groq API Error: {e}")
            return {"score": 5, "feedback": "Could not evaluate answer via AI. Please check your connection."}
