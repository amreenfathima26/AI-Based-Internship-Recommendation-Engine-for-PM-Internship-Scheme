import os
import json

# Try to import groq
try:
    from groq import Groq
except ImportError:
    Groq = None

class ChatService:
    def __init__(self):
        self.api_key = os.environ.get("GROQ_API_KEY")
        self.client = None
        if self.api_key and Groq:
            try:
                self.client = Groq(api_key=self.api_key)
            except Exception as e:
                print(f"Error initializing Groq client: {e}")

    def get_response(self, message, history=[]):
        """
        Get a response from the AI Career Assistant.
        history: list of {role: 'user'/'assistant', content: '...'}
        """
        
        # System Prompt
        system_msg = {
            "role": "system",
            "content": "You are an expert Career Counselor. You must reply in the SAME LANGUAGE as the user. If they speak Hindi, reply in Hindi. If Spanish, reply in Spanish. Support ALL languages. Be encouraging, professional, and concise."
        }
        
        # Prepare messages
        messages = [system_msg] + history[-5:] + [{"role": "user", "content": message}]

        if not self.client:
            return "I am currently in 'Offline Mode' because the Groq API Key is missing. I can still help you with basic questions! (Demo Response)"

        try:
            completion = self.client.chat.completions.create(
                messages=messages,
                model="llama-3.3-70b-versatile",
                temperature=0.7,
            )
            return completion.choices[0].message.content
        except Exception as e:
            print(f"Groq API Error: {e}")
            return "I'm having trouble connecting to my brain right now. Please try again later."
