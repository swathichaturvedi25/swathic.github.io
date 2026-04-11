#!/usr/bin/env python3
"""
Backend API Testing for Odissi Dance Practice App
Tests all endpoints as specified in the review request
"""

import requests
import json
import sys
from datetime import datetime, timedelta
from typing import Dict, Any

# Backend URL from frontend environment
BACKEND_URL = "https://choreography-trainer.preview.emergentagent.com/api"

class BackendTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.session = requests.Session()
        self.test_results = []
        self.created_goal_id = None
        
    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details
        })
        
    def test_statistics_endpoint(self):
        """Test GET /api/statistics"""
        try:
            response = self.session.get(f"{self.base_url}/statistics")
            if response.status_code == 200:
                data = response.json()
                required_fields = [
                    "total_sessions", "total_goals", "completed_goals", 
                    "weekly_sessions", "total_practice_minutes", "total_practice_hours"
                ]
                missing_fields = [field for field in required_fields if field not in data]
                if missing_fields:
                    self.log_test("Statistics Endpoint", False, f"Missing fields: {missing_fields}")
                else:
                    self.log_test("Statistics Endpoint", True, f"All required fields present: {data}")
            else:
                self.log_test("Statistics Endpoint", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Statistics Endpoint", False, f"Exception: {str(e)}")
    
    def test_practice_sessions_get(self):
        """Test GET /api/practice-sessions"""
        try:
            response = self.session.get(f"{self.base_url}/practice-sessions")
            if response.status_code == 200:
                data = response.json()
                self.log_test("GET Practice Sessions", True, f"Retrieved {len(data)} sessions")
            else:
                self.log_test("GET Practice Sessions", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("GET Practice Sessions", False, f"Exception: {str(e)}")
    
    def test_practice_sessions_post(self):
        """Test POST /api/practice-sessions"""
        try:
            test_session = {
                "session_type": "timer",
                "duration_minutes": 30,
                "notes": "Test practice session",
                "goals_achieved": []
            }
            response = self.session.post(
                f"{self.base_url}/practice-sessions",
                json=test_session
            )
            if response.status_code == 200:
                data = response.json()
                if "id" in data and data["session_type"] == "timer":
                    self.log_test("POST Practice Sessions", True, f"Created session with ID: {data['id']}")
                else:
                    self.log_test("POST Practice Sessions", False, "Response missing required fields")
            else:
                self.log_test("POST Practice Sessions", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("POST Practice Sessions", False, f"Exception: {str(e)}")
    
    def test_goals_get(self):
        """Test GET /api/goals"""
        try:
            response = self.session.get(f"{self.base_url}/goals")
            if response.status_code == 200:
                data = response.json()
                if data:  # If there are goals, store one ID for completion test
                    self.created_goal_id = data[0]["id"]
                self.log_test("GET Goals", True, f"Retrieved {len(data)} goals")
            else:
                self.log_test("GET Goals", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("GET Goals", False, f"Exception: {str(e)}")
    
    def test_goals_post(self):
        """Test POST /api/goals"""
        try:
            test_goal = {
                "title": "Test Goal",
                "description": "This is a test goal",
                "target_date": "2025-08-15T00:00:00Z"
            }
            response = self.session.post(
                f"{self.base_url}/goals",
                json=test_goal
            )
            if response.status_code == 200:
                data = response.json()
                if "id" in data and data["title"] == "Test Goal":
                    self.created_goal_id = data["id"]  # Store for completion test
                    self.log_test("POST Goals", True, f"Created goal with ID: {data['id']}")
                else:
                    self.log_test("POST Goals", False, "Response missing required fields")
            else:
                self.log_test("POST Goals", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("POST Goals", False, f"Exception: {str(e)}")
    
    def test_goals_complete(self):
        """Test PUT /api/goals/{goal_id}/complete"""
        if not self.created_goal_id:
            self.log_test("PUT Goals Complete", False, "No goal ID available for testing")
            return
            
        try:
            response = self.session.put(f"{self.base_url}/goals/{self.created_goal_id}/complete")
            if response.status_code == 200:
                data = response.json()
                if "message" in data:
                    self.log_test("PUT Goals Complete", True, f"Goal completed: {data['message']}")
                else:
                    self.log_test("PUT Goals Complete", False, "Response missing message field")
            else:
                self.log_test("PUT Goals Complete", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("PUT Goals Complete", False, f"Exception: {str(e)}")
    
    def test_theory_content_get_all(self):
        """Test GET /api/theory-content (all content)"""
        try:
            response = self.session.get(f"{self.base_url}/theory-content")
            if response.status_code == 200:
                data = response.json()
                self.log_test("GET Theory Content (All)", True, f"Retrieved {len(data)} theory items")
            else:
                self.log_test("GET Theory Content (All)", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("GET Theory Content (All)", False, f"Exception: {str(e)}")
    
    def test_theory_content_get_filtered(self):
        """Test GET /api/theory-content?category=terminology"""
        try:
            response = self.session.get(f"{self.base_url}/theory-content?category=terminology")
            if response.status_code == 200:
                data = response.json()
                # Check if all returned items have the correct category
                if data:
                    wrong_category = [item for item in data if item.get("category") != "terminology"]
                    if wrong_category:
                        self.log_test("GET Theory Content (Filtered)", False, f"Found items with wrong category: {len(wrong_category)}")
                    else:
                        self.log_test("GET Theory Content (Filtered)", True, f"Retrieved {len(data)} terminology items")
                else:
                    self.log_test("GET Theory Content (Filtered)", True, "No terminology items found (empty result)")
            else:
                self.log_test("GET Theory Content (Filtered)", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("GET Theory Content (Filtered)", False, f"Exception: {str(e)}")
    
    def test_shlokas_get(self):
        """Test GET /api/shlokas"""
        try:
            response = self.session.get(f"{self.base_url}/shlokas")
            if response.status_code == 200:
                data = response.json()
                self.log_test("GET Shlokas", True, f"Retrieved {len(data)} shlokas")
            else:
                self.log_test("GET Shlokas", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("GET Shlokas", False, f"Exception: {str(e)}")
    
    def test_calendar_events_get(self):
        """Test GET /api/calendar-events"""
        try:
            response = self.session.get(f"{self.base_url}/calendar-events")
            if response.status_code == 200:
                data = response.json()
                self.log_test("GET Calendar Events", True, f"Retrieved {len(data)} events")
            else:
                self.log_test("GET Calendar Events", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("GET Calendar Events", False, f"Exception: {str(e)}")
    
    def test_calendar_events_post(self):
        """Test POST /api/calendar-events"""
        try:
            test_event = {
                "title": "Morning Practice",
                "description": "Daily practice session",
                "event_date": "2025-07-20T09:00:00Z",
                "event_type": "practice",
                "reminder_enabled": True
            }
            response = self.session.post(
                f"{self.base_url}/calendar-events",
                json=test_event
            )
            if response.status_code == 200:
                data = response.json()
                if "id" in data and data["title"] == "Morning Practice":
                    self.log_test("POST Calendar Events", True, f"Created event with ID: {data['id']}")
                else:
                    self.log_test("POST Calendar Events", False, "Response missing required fields")
            else:
                self.log_test("POST Calendar Events", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("POST Calendar Events", False, f"Exception: {str(e)}")
    
    def test_generate_quiz(self):
        """Test POST /api/generate-quiz (CRITICAL AI FEATURE)"""
        try:
            test_request = {
                "topic": "Odissi dance terminology",
                "num_questions": 3
            }
            response = self.session.post(
                f"{self.base_url}/generate-quiz",
                json=test_request
            )
            if response.status_code == 200:
                data = response.json()
                if "questions" in data and isinstance(data["questions"], list):
                    questions = data["questions"]
                    if len(questions) == 3:
                        # Validate question structure
                        valid_questions = all(
                            "question" in q and "options" in q and "correct_answer" in q and "explanation" in q
                            for q in questions
                        )
                        if valid_questions:
                            self.log_test("POST Generate Quiz (AI)", True, f"Generated {len(questions)} valid quiz questions")
                        else:
                            self.log_test("POST Generate Quiz (AI)", False, "Generated questions missing required fields")
                    else:
                        self.log_test("POST Generate Quiz (AI)", False, f"Expected 3 questions, got {len(questions)}")
                else:
                    self.log_test("POST Generate Quiz (AI)", False, "Response missing 'questions' field or not a list")
            else:
                self.log_test("POST Generate Quiz (AI)", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("POST Generate Quiz (AI)", False, f"Exception: {str(e)}")
    
    def test_generate_insights(self):
        """Test POST /api/generate-insights (CRITICAL AI FEATURE)"""
        try:
            test_request = {
                "days_back": 7
            }
            response = self.session.post(
                f"{self.base_url}/generate-insights",
                json=test_request
            )
            if response.status_code == 200:
                data = response.json()
                if "insights" in data and isinstance(data["insights"], str):
                    insights = data["insights"]
                    if len(insights) > 10:  # Basic check for meaningful content
                        self.log_test("POST Generate Insights (AI)", True, f"Generated insights: {insights[:100]}...")
                    else:
                        self.log_test("POST Generate Insights (AI)", False, "Generated insights too short or empty")
                else:
                    self.log_test("POST Generate Insights (AI)", False, "Response missing 'insights' field or not a string")
            else:
                self.log_test("POST Generate Insights (AI)", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("POST Generate Insights (AI)", False, f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all backend API tests"""
        print(f"🚀 Starting Backend API Tests for Odissi Dance Practice App")
        print(f"Backend URL: {self.base_url}")
        print("=" * 80)
        
        # Test in order of priority
        self.test_statistics_endpoint()
        self.test_practice_sessions_get()
        self.test_practice_sessions_post()
        self.test_goals_get()
        self.test_goals_post()
        self.test_goals_complete()
        self.test_theory_content_get_all()
        self.test_theory_content_get_filtered()
        self.test_shlokas_get()
        self.test_calendar_events_get()
        self.test_calendar_events_post()
        
        # Critical AI features
        print("\n🤖 Testing Critical AI Features:")
        self.test_generate_quiz()
        self.test_generate_insights()
        
        # Summary
        print("\n" + "=" * 80)
        print("📊 TEST SUMMARY")
        print("=" * 80)
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if total - passed > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['details']}")
        
        return passed == total

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)