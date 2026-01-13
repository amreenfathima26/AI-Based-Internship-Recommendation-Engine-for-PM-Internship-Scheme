import json
import os
from typing import List, Dict, Any

class RecommendationEngine:
    """Lightweight rule-based recommendation engine for internships"""
    
    def __init__(self):
        self.internships_file = os.path.join(os.path.dirname(__file__), 'data', 'internships.json')
        self.internships = self._load_internships()
    
    def _load_internships(self) -> List[Dict[str, Any]]:
        """Load internships data from JSON file"""
        try:
            with open(self.internships_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Warning: {self.internships_file} not found. Using empty list.")
            return []
    
    def _calculate_similarity_score(self, candidate: Dict[str, Any], internship: Dict[str, Any]) -> float:
        """
        Calculate similarity score between candidate profile and internship
        Uses weighted scoring based on multiple factors
        """
        score = 0.0
        total_weight = 0.0
        
        # 1. Education Level Match (Weight: 0.25)
        education_weight = 0.25
        candidate_edu = candidate.get('education', '').lower()
        internship_edu = internship.get('required_education', '').lower()
        
        if candidate_edu == internship_edu or internship_edu == 'any':
            score += education_weight * 1.0
        elif 'graduate' in candidate_edu and 'graduate' in internship_edu:
            score += education_weight * 0.8
        elif 'undergraduate' in candidate_edu and 'undergraduate' in internship_edu:
            score += education_weight * 0.8
        total_weight += education_weight
        
        # 2. Skills Match (Weight: 0.30)
        skills_weight = 0.30
        candidate_skills = [s.lower() for s in candidate.get('skills', [])]
        internship_skills = [s.lower() for s in internship.get('required_skills', [])]
        
        if len(internship_skills) == 0:
            skills_match = 0.5  # Neutral score if no skills specified
        else:
            matched_skills = len(set(candidate_skills) & set(internship_skills))
            skills_match = matched_skills / len(internship_skills)
        
        score += skills_weight * skills_match
        total_weight += skills_weight
        
        # 3. Sector/Interest Match (Weight: 0.25)
        interest_weight = 0.25
        candidate_interests = [i.lower() for i in candidate.get('interests', [])]
        internship_sector = internship.get('sector', '').lower()
        
        if len(candidate_interests) == 0:
            interest_match = 0.3  # Lower score if no interests specified
        else:
            # Check if any interest matches the sector
            interest_match = 0.0
            for interest in candidate_interests:
                if interest in internship_sector or internship_sector in interest:
                    interest_match = 1.0
                    break
                # Partial match scoring
                if any(word in internship_sector for word in interest.split()):
                    interest_match = max(interest_match, 0.6)
        
        score += interest_weight * interest_match
        total_weight += interest_weight
        
        # 4. Location Match (Weight: 0.15)
        location_weight = 0.15
        candidate_location = candidate.get('location', '').lower()
        internship_location = internship.get('location', '').lower()
        remote_available = internship.get('remote_available', False)
        
        if remote_available:
            location_match = 0.8  # High score if remote is available
        elif candidate_location == internship_location:
            location_match = 1.0
        elif any(word in internship_location for word in candidate_location.split() if len(word) > 2):
            location_match = 0.7
        else:
            location_match = 0.4  # Lower but not zero for different locations
        
        score += location_weight * location_match
        total_weight += location_weight
        
        # 5. Experience Match (Weight: 0.05)
        experience_weight = 0.05
        candidate_experience = candidate.get('previous_experience', False)
        internship_experience_required = internship.get('experience_required', False)
        
        if not internship_experience_required:
            experience_match = 1.0  # Perfect for beginners
        elif candidate_experience == internship_experience_required:
            experience_match = 1.0
        else:
            experience_match = 0.6  # Some penalty but not zero
        
        score += experience_weight * experience_match
        total_weight += experience_weight
        
        # Normalize score
        if total_weight > 0:
            normalized_score = score / total_weight
        else:
            normalized_score = 0.0
        
        return normalized_score
    
    def recommend(self, candidate_profile: Dict[str, Any], top_n: int = 5) -> List[Dict[str, Any]]:
        """
        Get top N internship recommendations for a candidate
        
        Args:
            candidate_profile: Dictionary with candidate information
            top_n: Number of top recommendations to return
        
        Returns:
            List of internship recommendations with scores
        """
        scored_internships = []
        
        for internship in self.internships:
            score = self._calculate_similarity_score(candidate_profile, internship)
            scored_internship = internship.copy()
            scored_internship['match_score'] = round(score * 100, 1)  # Convert to percentage
            scored_internships.append(scored_internship)
        
        # Sort by score (descending) and return top N
        scored_internships.sort(key=lambda x: x['match_score'], reverse=True)
        
        return scored_internships[:top_n]
    
    def get_all_internships(self) -> List[Dict[str, Any]]:
        """Get all available internships"""
        return self.internships
    
    def get_available_sectors(self) -> List[str]:
        """Get unique list of available sectors"""
        sectors = set()
        for internship in self.internships:
            sectors.add(internship.get('sector', 'Other'))
        return sorted(list(sectors))

