# Odissi Dance Practice App

A comprehensive mobile application for Odissi classical dance practitioners to manage their daily practice, learn theory, and track progress.

## Features

### 🏠 Home Dashboard
- **Practice Statistics**: View total sessions, practice hours, completed goals, and weekly activity
- **Active Goals**: Quick view of your current practice goals
- **AI Practice Insights**: Get personalized recommendations based on your practice history using GPT-5.2

### 🎯 Practice Module
- **Video Recording**: Record your practice sessions for review
- **Teacher Videos**: Watch instructional videos at different speeds (0.5x to 2x) to learn step-by-step
- **Practice Timer**: Track your practice duration with built-in timer/metronome
- **Music Player**: Practice with traditional Odissi music tracks
- **Session Logging**: Keep detailed logs of your practice sessions

### 📚 Learn Module
- **Theory Content**: 
  - Dance terminology (Tribhangi, Chauk, Mudra, etc.)
  - Music theory (Ragas, Tala system)
  - History of Odissi
  - Cultural significance
  - Technique guides
- **Shlokas & Viniyogas**: Practice traditional Sanskrit shlokas with transliteration and meanings
- **Surprise Tests**: AI-generated quizzes to test your knowledge

### 📅 Calendar
- Schedule practice sessions, classes, performances
- Set reminders for important events
- View events by date

### 👤 Profile
- **Goals Management**: Create, track, and complete practice goals
- **Quiz History**: View your test results and scores
- **Progress Tracking**: See your improvement over time

## Technology Stack

### Frontend
- **Expo** (React Native) - Cross-platform mobile framework
- **React Navigation** - Tab and stack navigation
- **Expo AV** - Video/audio playback and recording
- **Expo Camera** - Video recording capabilities
- **React Native Calendars** - Calendar interface
- **Zustand** - State management
- **TypeScript** - Type safety

### Backend
- **FastAPI** - High-performance Python API framework
- **MongoDB** - NoSQL database for flexible data storage
- **Motor** - Async MongoDB driver
- **emergentintegrations** - LLM integration library

### AI Features
- **OpenAI GPT-5.2** (via Emergent Universal LLM Key)
  - Quiz generation based on Odissi topics
  - Personalized practice insights and recommendations

## Database Collections

1. **practice_sessions** - Recording of practice activities
2. **goals** - User-defined practice goals
3. **theory_content** - Odissi dance theory by category
4. **teacher_videos** - Instructional video content (base64)
5. **music_tracks** - Practice music (base64)
6. **shlokas** - Sanskrit shlokas with translations
7. **quiz_results** - Test scores and history
8. **calendar_events** - Scheduled events and reminders

## API Endpoints

### Practice
- `GET /api/practice-sessions` - Get all practice sessions
- `POST /api/practice-sessions` - Log new practice session
- `GET /api/practice-sessions/{id}` - Get specific session

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create new goal
- `PUT /api/goals/{id}/complete` - Mark goal as complete
- `DELETE /api/goals/{id}` - Delete goal

### Theory & Learning
- `GET /api/theory-content` - Get theory content (filterable by category)
- `POST /api/theory-content` - Add new theory content
- `GET /api/shlokas` - Get all shlokas
- `POST /api/shlokas` - Add new shloka

### Calendar
- `GET /api/calendar-events` - Get calendar events (filterable by date range)
- `POST /api/calendar-events` - Create new event
- `DELETE /api/calendar-events/{id}` - Delete event

### AI Features
- `POST /api/generate-quiz` - Generate AI quiz questions
- `POST /api/generate-insights` - Get AI practice insights
- `GET /api/statistics` - Get practice statistics

## Setup & Installation

### Backend
```bash
cd /app/backend
pip install -r requirements.txt
python seed_data.py  # Seed initial data
uvicorn server:app --host 0.0.0.0 --port 8001
```

### Frontend
```bash
cd /app/frontend
yarn install
expo start
```

## Device Permissions

The app requires the following permissions:

### iOS
- Camera - Record practice sessions
- Microphone - Capture audio for practice videos
- Photo Library - Save and access practice recordings
- Notifications - Get practice reminders

### Android
- CAMERA - Record practice sessions
- RECORD_AUDIO - Capture audio for videos
- READ/WRITE_EXTERNAL_STORAGE - Save recordings
- POST_NOTIFICATIONS - Show reminders

## Pre-seeded Content

The app comes with:
- **11 Theory Content Items** covering terminology, music, history, culture, and technique
- **3 Sample Shlokas** with Sanskrit text, transliteration, meanings, and viniyoga
- **3 Sample Goals** for practice
- **3 Practice Sessions** for testing

## Future Enhancements (Phase 2)

- Video recording implementation with playback controls
- Teacher video upload and management
- Music track upload functionality
- Advanced quiz interface with scoring
- Progress analytics charts
- Social features (share progress, find practice partners)
- Offline mode support
- Push notifications for scheduled events
- Video form analysis using AI

## About Odissi Dance

Odissi is one of the eight classical dance forms of India, originating from the temples of Odisha. It is characterized by the tribhangi (three-bend) posture and is known for its graceful movements, expressive storytelling, and devotional themes centered around Lord Jagannath and Lord Krishna.

## Credits

Built with ❤️ for Odissi dance practitioners worldwide.
