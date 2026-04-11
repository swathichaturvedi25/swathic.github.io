const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL + '/api';

export const api = {
  // Practice Sessions
  createPracticeSession: async (data: any) => {
    const response = await fetch(`${API_URL}/practice-sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  getPracticeSessions: async () => {
    const response = await fetch(`${API_URL}/practice-sessions`);
    return response.json();
  },
  
  // Goals
  createGoal: async (data: any) => {
    const response = await fetch(`${API_URL}/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  getGoals: async () => {
    const response = await fetch(`${API_URL}/goals`);
    return response.json();
  },
  
  completeGoal: async (id: string) => {
    const response = await fetch(`${API_URL}/goals/${id}/complete`, {
      method: 'PUT',
    });
    return response.json();
  },
  
  deleteGoal: async (id: string) => {
    const response = await fetch(`${API_URL}/goals/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
  
  // Theory Content
  getTheoryContent: async (category?: string) => {
    const url = category 
      ? `${API_URL}/theory-content?category=${category}`
      : `${API_URL}/theory-content`;
    const response = await fetch(url);
    return response.json();
  },
  
  createTheoryContent: async (data: any) => {
    const response = await fetch(`${API_URL}/theory-content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  // Teacher Videos
  getTeacherVideos: async () => {
    const response = await fetch(`${API_URL}/teacher-videos`);
    return response.json();
  },
  
  createTeacherVideo: async (data: any) => {
    const response = await fetch(`${API_URL}/teacher-videos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  // Music Tracks
  getMusicTracks: async () => {
    const response = await fetch(`${API_URL}/music-tracks`);
    return response.json();
  },
  
  createMusicTrack: async (data: any) => {
    const response = await fetch(`${API_URL}/music-tracks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  // Shlokas
  getShlokas: async () => {
    const response = await fetch(`${API_URL}/shlokas`);
    return response.json();
  },
  
  createShloka: async (data: any) => {
    const response = await fetch(`${API_URL}/shlokas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  // Quiz
  generateQuiz: async (topic: string, numQuestions: number = 5) => {
    const response = await fetch(`${API_URL}/generate-quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, num_questions: numQuestions }),
    });
    return response.json();
  },
  
  saveQuizResult: async (data: any) => {
    const response = await fetch(`${API_URL}/quiz-results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  getQuizResults: async () => {
    const response = await fetch(`${API_URL}/quiz-results`);
    return response.json();
  },
  
  // Calendar Events
  getCalendarEvents: async (startDate?: string, endDate?: string) => {
    let url = `${API_URL}/calendar-events`;
    if (startDate && endDate) {
      url += `?start_date=${startDate}&end_date=${endDate}`;
    }
    const response = await fetch(url);
    return response.json();
  },
  
  createCalendarEvent: async (data: any) => {
    const response = await fetch(`${API_URL}/calendar-events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  deleteCalendarEvent: async (id: string) => {
    const response = await fetch(`${API_URL}/calendar-events/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
  
  // AI Insights
  generateInsights: async (daysBack: number = 7) => {
    const response = await fetch(`${API_URL}/generate-insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ days_back: daysBack }),
    });
    return response.json();
  },
  
  // Statistics
  getStatistics: async () => {
    const response = await fetch(`${API_URL}/statistics`);
    return response.json();
  },
};