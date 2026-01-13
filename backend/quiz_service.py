import random

class QuizService:
    def __init__(self):
        self.quizzes = {
            "python": [
                {
                    "id": 1,
                    "question": "What is the output of print(type([]))?",
                    "options": ["<class 'list'>", "<class 'tuple'>", "<class 'dict'>", "<class 'set'>"],
                    "correct": 0
                },
                {
                    "id": 2,
                    "question": "Which keyword is used to define a function in Python?",
                    "options": ["func", "def", "lambda", "function"],
                    "correct": 1
                },
                {
                    "id": 3,
                    "question": "What is the data type of the result of: 3 / 2?",
                    "options": ["int", "float", "complex", "decimal"],
                    "correct": 1
                },
                {
                    "id": 4,
                    "question": "Which of these is NOT a core data type?",
                    "options": ["List", "Dictionary", "Tuple", "Class"],
                    "correct": 3
                },
                {
                    "id": 5,
                    "question": "How do you form a single line comment in Python?",
                    "options": ["//", "/*", "#", "<!--"],
                    "correct": 2
                }
            ],
            "pm": [
                {
                    "id": 1,
                    "question": "What does MVP stand for?",
                    "options": ["Most Valuable Player", "Minimum Viable Product", "Maximum Viable Product", "Minimum Valuable Process"],
                    "correct": 1
                },
                {
                    "id": 2,
                    "question": "Which metric is best for retaining users?",
                    "options": ["CAC", "Churn Rate", "LTV", "NPS"],
                    "correct": 1
                },
                {
                    "id": 3,
                    "question": "What is a User Story?",
                    "options": ["A bug report", "A feature description from user perspective", "A marketing pitch", "A database schema"],
                    "correct": 1
                },
                {
                    "id": 4,
                    "question": "Which framework is common in Agile?",
                    "options": ["Waterfall", "Scrum", "V-Model", "Spiral"],
                    "correct": 1
                },
                {
                    "id": 5,
                    "question": "What is A/B Testing?",
                    "options": ["Testing alpha vs beta versions", "Comparing two versions to see which performs better", "Checking for bugs", "User Interviewing"],
                    "correct": 1
                }
            ],
            "data_analytics": [
                {
                    "id": 1,
                    "question": "Which tool is commonly used for data visualization?",
                    "options": ["Tableau", "Photoshop", "Docker", "Nginx"],
                    "correct": 0
                },
                {
                    "id": 2,
                    "question": "What does SQL stand for?",
                    "options": ["Structured Question Logic", "Standard Query Language", "Structured Query Language", "Simple Query Logic"],
                    "correct": 2
                },
                {
                    "id": 3,
                    "question": "Which of these is a measure of central tendency?",
                    "options": ["Variance", "Standard Deviation", "Mean", "Range"],
                    "correct": 2
                },
                {
                    "id": 4,
                    "question": "In pandas, which function reads a CSV file?",
                    "options": ["read_file()", "read_csv()", "load_csv()", "import_csv()"],
                    "correct": 1
                },
                {
                    "id": 5,
                    "question": "What is data cleaning?",
                    "options": ["Deleting all data", "Fixing or removing incorrect/null data", "Formatting the hard drive", "Encrypting data"],
                    "correct": 1
                }
            ],
            "ux_design": [
                {
                    "id": 1,
                    "question": "What does UX stand for?",
                    "options": ["User Extension", "User Experience", "Unified Xylophone", "Usage Xenophobia"],
                    "correct": 1
                },
                {
                    "id": 2,
                    "question": "Which of these is a low-fidelity prototype?",
                    "options": ["Wireframe", "High-res Mockup", "Live Website", "Final Product"],
                    "correct": 0
                },
                {
                    "id": 3,
                    "question": "What is a Persona in UX?",
                    "options": ["The designer's personality", "A fictional character representing a user type", "The CEO of the company", "A secure login method"],
                    "correct": 1
                },
                {
                    "id": 4,
                    "question": "What is the 'White Space' in design?",
                    "options": ["The background color", "Empty space around elements", "A bug in rendering", "The space key on keyboard"],
                    "correct": 1
                },
                {
                    "id": 5,
                    "question": "Which law states that users spend most of their time on other sites?",
                    "options": ["Moore's Law", "Jakob's Law", "Fitts's Law", "Hick's Law"],
                    "correct": 1
                }
            ],
            "machine_learning": [
                {
                    "id": 1,
                    "question": "What is Supervised Learning?",
                    "options": ["Learning without labeled data", "Learning with labeled training data", "Learning from environment feedback", "Hardcoding rules"],
                    "correct": 1
                },
                {
                    "id": 2,
                    "question": "Which algorithm is used for classification?",
                    "options": ["Linear Regression", "K-Means", "Logistic Regression", "Apriori"],
                    "correct": 2
                },
                {
                    "id": 3,
                    "question": "What is Overfitting?",
                    "options": ["Model performs well on training but poor on new data", "Model performs poor on everything", "Model is too simple", "Data is missing"],
                    "correct": 0
                },
                {
                    "id": 4,
                    "question": "What is a Neural Network inspired by?",
                    "options": ["Computer circuits", "Biological brain neurons", "Solar systems", "Ant colonies"],
                    "correct": 1
                },
                {
                    "id": 5,
                    "question": "What does NLP stand for?",
                    "options": ["Natural Language Processing", "New Learning Protocol", "Neural Link Processor", "No Linear Programming"],
                    "correct": 0
                }
            ],
            "digital_marketing": [
                {
                    "id": 1,
                    "question": "What does SEO stand for?",
                    "options": ["Search Engine Optimization", "Social Engagement Output", "Site Efficiency Organization", "Simple Email Operation"],
                    "correct": 0
                },
                {
                    "id": 2,
                    "question": "Which metric measures the percentage of visitors who leave after one page?",
                    "options": ["CTR", "Bounce Rate", "Conversion Rate", "Impression Share"],
                    "correct": 1
                },
                {
                    "id": 3,
                    "question": "What is PPC?",
                    "options": ["Pay Per Click", "Post Per Channel", "Page Per Content", "Public Private Cloud"],
                    "correct": 0
                },
                {
                    "id": 4,
                    "question": "Which platform is best for B2B marketing?",
                    "options": ["TikTok", "Snapchat", "LinkedIn", "Pinterest"],
                    "correct": 2
                },
                {
                    "id": 5,
                    "question": "What is Content Marketing?",
                    "options": ["Only posting ads", "Creating valuable content to attract audience", "Cold calling", "Spamming emails"],
                    "correct": 1
                }
            ],
            "agile_leadership": [
                {
                    "id": 1,
                    "question": "Who facilitates the Scrum process?",
                    "options": ["Product Owner", "Scrum Master", "CEO", "Lead Developer"],
                    "correct": 1
                },
                {
                    "id": 2,
                    "question": "What is a Sprint?",
                    "options": ["A short race", "A time-boxed period to complete work", "A debugging session", "A marketing launch"],
                    "correct": 1
                },
                {
                    "id": 3,
                    "question": "What goes into the Sprint Backlog?",
                    "options": ["All features ever needed", "Items selected for the current sprint", "Bugs only", "Completed items"],
                    "correct": 1
                },
                {
                    "id": 4,
                    "question": "Which is a value of the Agile Manifesto?",
                    "options": ["Processes over people", "Documentation over software", "Responding to change over following a plan", "Contract negotiation over collaboration"],
                    "correct": 2
                },
                {
                    "id": 5,
                    "question": "What is a Daily Standup?",
                    "options": ["A 1-hour meeting", "A short sync meeting (~15 mins)", "A written report", "A yearly review"],
                    "correct": 1
                }
            ]
        }

    def get_quiz(self, subject):
        """Get a quiz for a specific subject."""
        questions = self.quizzes.get(subject.lower(), [])
        # In a real app, we might randomize or pick a subset
        return questions

    def calculate_score(self, answers, subject):
        """
        Calculate score for a specific subject.
        answers: dict of {question_id: selected_index}
        subject: str
        """
        score = 0
        total = 0
        
        # Get questions for this subject only
        questions = self.quizzes.get(subject, [])
        if not questions:
            # Try lowercase
            questions = self.quizzes.get(subject.lower(), [])
            
        # Create lookup map for this subject's questions
        question_map = {str(q['id']): q for q in questions}
        
        for q_id, selected_idx in answers.items():
            if str(q_id) in question_map:
                total += 1
                if question_map[str(q_id)]['correct'] == int(selected_idx):
                    score += 1
        
        return {
            "score": score,
            "total": total,
            "percentage": (score / total * 100) if total > 0 else 0
        }
