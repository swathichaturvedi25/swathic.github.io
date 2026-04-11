from fastapi import FastAPI, APIRouter, HTTPException, File, UploadFile, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
from emergentintegrations.llm.chat import LlmChat, UserMessage
import base64
import shutil


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create uploads directory
UPLOAD_DIR = ROOT_DIR / "uploads" / "videos"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# LLM Configuration
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')


# ============ Models ============

class PracticeSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_type: str  # "video_recording", "timer", "music", "video_watching"
    duration_minutes: int
    notes: Optional[str] = None
    video_base64: Optional[str] = None  # For recorded practice videos
    date: datetime = Field(default_factory=datetime.utcnow)
    goals_achieved: List[str] = []

class PracticeSessionCreate(BaseModel):
    session_type: str
    duration_minutes: int
    notes: Optional[str] = None
    video_base64: Optional[str] = None
    goals_achieved: List[str] = []

class Goal(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    target_date: datetime
    completed: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class GoalCreate(BaseModel):
    title: str
    description: str
    target_date: datetime

class TheoryContent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    category: str  # "terminology", "music_theory", "choreography", "technique", "history", "cultural"
    title: str
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TheoryContentCreate(BaseModel):
    category: str
    title: str
    content: str

class TeacherVideo(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: Optional[str] = None
    video_url: str  # Changed from video_base64 to video_url
    file_size_mb: Optional[float] = None
    difficulty_level: str  # "beginner", "intermediate", "advanced"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TeacherVideoCreate(BaseModel):
    title: str
    description: Optional[str] = None
    video_base64: str
    difficulty_level: str

class MusicTrack(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    artist: Optional[str] = None
    audio_base64: str
    duration_seconds: int
    created_at: datetime = Field(default_factory=datetime.utcnow)

class MusicTrackCreate(BaseModel):
    title: str
    artist: Optional[str] = None
    audio_base64: str
    duration_seconds: int

class Shloka(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    sanskrit_text: str
    transliteration: str
    meaning: str
    viniyoga: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ShlokaCreate(BaseModel):
    title: str
    sanskrit_text: str
    transliteration: str
    meaning: str
    viniyoga: Optional[str] = None

class QuizResult(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    quiz_type: str  # "surprise_test", "theory_quiz"
    questions: List[dict]
    answers: List[dict]
    score: int
    total_questions: int
    date: datetime = Field(default_factory=datetime.utcnow)

class QuizResultCreate(BaseModel):
    quiz_type: str
    questions: List[dict]
    answers: List[dict]
    score: int
    total_questions: int

class CalendarEvent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: Optional[str] = None
    event_date: datetime
    event_type: str  # "practice", "class", "performance", "reminder"
    reminder_enabled: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CalendarEventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    event_date: datetime
    event_type: str
    reminder_enabled: bool = False

class GenerateQuizRequest(BaseModel):
    topic: str
    num_questions: int = 5

class GenerateInsightsRequest(BaseModel):
    days_back: int = 7


# ============ Routes ============

@api_router.get("/")
async def root():
    return {"message": "Odissi Dance Practice API"}

# Practice Sessions
@api_router.post("/practice-sessions", response_model=PracticeSession)
async def create_practice_session(session: PracticeSessionCreate):
    session_obj = PracticeSession(**session.dict())
    await db.practice_sessions.insert_one(session_obj.dict())
    return session_obj

@api_router.get("/practice-sessions", response_model=List[PracticeSession])
async def get_practice_sessions(limit: int = 50):
    sessions = await db.practice_sessions.find().sort("date", -1).limit(limit).to_list(limit)
    return [PracticeSession(**session) for session in sessions]

@api_router.get("/practice-sessions/{session_id}", response_model=PracticeSession)
async def get_practice_session(session_id: str):
    session = await db.practice_sessions.find_one({"id": session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return PracticeSession(**session)

# Goals
@api_router.post("/goals", response_model=Goal)
async def create_goal(goal: GoalCreate):
    goal_obj = Goal(**goal.dict())
    await db.goals.insert_one(goal_obj.dict())
    return goal_obj

@api_router.get("/goals", response_model=List[Goal])
async def get_goals():
    goals = await db.goals.find().sort("created_at", -1).to_list(100)
    return [Goal(**goal) for goal in goals]

@api_router.put("/goals/{goal_id}/complete")
async def complete_goal(goal_id: str):
    result = await db.goals.update_one(
        {"id": goal_id},
        {"$set": {"completed": True}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Goal not found")
    return {"message": "Goal completed"}

@api_router.delete("/goals/{goal_id}")
async def delete_goal(goal_id: str):
    result = await db.goals.delete_one({"id": goal_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Goal not found")
    return {"message": "Goal deleted"}

# Theory Content
@api_router.post("/theory-content", response_model=TheoryContent)
async def create_theory_content(content: TheoryContentCreate):
    content_obj = TheoryContent(**content.dict())
    await db.theory_content.insert_one(content_obj.dict())
    return content_obj

@api_router.get("/theory-content", response_model=List[TheoryContent])
async def get_theory_content(category: Optional[str] = None):
    query = {"category": category} if category else {}
    contents = await db.theory_content.find(query).to_list(100)
    return [TheoryContent(**content) for content in contents]

@api_router.get("/theory-content/{content_id}", response_model=TheoryContent)
async def get_theory_content_by_id(content_id: str):
    content = await db.theory_content.find_one({"id": content_id})
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    return TheoryContent(**content)

# Teacher Videos
@api_router.post("/teacher-videos", response_model=TeacherVideo)
async def create_teacher_video(video: TeacherVideoCreate):
    """Save teacher video to file system instead of database"""
    try:
        # Generate unique filename
        video_id = str(uuid.uuid4())
        filename = f"{video_id}.mp4"
        filepath = UPLOAD_DIR / filename
        
        # Decode base64 and save to file
        if video.video_base64.startswith('data:'):
            # Remove data URL prefix
            base64_data = video.video_base64.split(',')[1]
        else:
            base64_data = video.video_base64
        
        video_bytes = base64.b64decode(base64_data)
        
        # Save to file
        with open(filepath, 'wb') as f:
            f.write(video_bytes)
        
        # Calculate file size
        file_size_mb = len(video_bytes) / (1024 * 1024)
        
        # Create video object with file URL instead of base64
        video_obj = TeacherVideo(
            id=video_id,
            title=video.title,
            description=video.description,
            video_url=f"/api/uploads/videos/{filename}",  # Changed to /api/uploads
            file_size_mb=round(file_size_mb, 2),
            difficulty_level=video.difficulty_level,
        )
        
        await db.teacher_videos.insert_one(video_obj.dict())
        return video_obj
    except Exception as e:
        logger.error(f"Error saving video: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to save video: {str(e)}")

@api_router.get("/teacher-videos", response_model=List[TeacherVideo])
async def get_teacher_videos():
    videos = await db.teacher_videos.find().sort("created_at", -1).to_list(100)
    return [TeacherVideo(**video) for video in videos]

@api_router.delete("/teacher-videos/{video_id}")
async def delete_teacher_video(video_id: str):
    """Delete video from both database and file system"""
    video = await db.teacher_videos.find_one({"id": video_id})
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    # Delete file from file system
    try:
        filename = video['video_url'].split('/')[-1]
        filepath = UPLOAD_DIR / filename
        if filepath.exists():
            filepath.unlink()
    except Exception as e:
        logger.error(f"Error deleting video file: {str(e)}")
    
    # Delete from database
    result = await db.teacher_videos.delete_one({"id": video_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Video not found in database")
    
    return {"message": "Video deleted successfully"}

# Serve video files under /api/uploads
@api_router.api_route("/uploads/videos/{filename}", methods=["GET", "HEAD"])
async def get_video_file(filename: str, request: Request):
    """Serve video files with proper Range request support for iOS"""
    from fastapi.responses import StreamingResponse, Response
    import aiofiles
    
    filepath = UPLOAD_DIR / filename
    if not filepath.exists():
        raise HTTPException(status_code=404, detail="Video file not found")
    
    file_size = filepath.stat().st_size
    
    # Parse Range header
    range_header = request.headers.get('range')
    
    if range_header:
        # Handle range request for iOS video streaming
        range_match = range_header.replace('bytes=', '').split('-')
        start = int(range_match[0]) if range_match[0] else 0
        end = int(range_match[1]) if len(range_match) > 1 and range_match[1] else file_size - 1
        
        chunk_size = end - start + 1
        
        async def file_chunk():
            async with aiofiles.open(filepath, mode='rb') as f:
                await f.seek(start)
                remaining = chunk_size
                while remaining > 0:
                    read_size = min(8192, remaining)
                    chunk = await f.read(read_size)
                    if not chunk:
                        break
                    remaining -= len(chunk)
                    yield chunk
        
        headers = {
            "Content-Type": "video/mp4",
            "Accept-Ranges": "bytes",
            "Content-Range": f"bytes {start}-{end}/{file_size}",
            "Content-Length": str(chunk_size),
            "Cache-Control": "public, max-age=31536000",
            "Access-Control-Allow-Origin": "*",
        }
        
        return StreamingResponse(
            file_chunk(),
            status_code=206,
            media_type="video/mp4",
            headers=headers
        )
    else:
        # Full file request
        async def file_iterator():
            async with aiofiles.open(filepath, mode='rb') as f:
                while chunk := await f.read(8192):
                    yield chunk
        
        headers = {
            "Content-Type": "video/mp4",
            "Accept-Ranges": "bytes",
            "Content-Length": str(file_size),
            "Cache-Control": "public, max-age=31536000",
            "Access-Control-Allow-Origin": "*",
        }
        
        return StreamingResponse(
            file_iterator(),
            media_type="video/mp4",
            headers=headers
        )

# Music Tracks
@api_router.post("/music-tracks", response_model=MusicTrack)
async def create_music_track(track: MusicTrackCreate):
    track_obj = MusicTrack(**track.dict())
    await db.music_tracks.insert_one(track_obj.dict())
    return track_obj

@api_router.get("/music-tracks", response_model=List[MusicTrack])
async def get_music_tracks():
    tracks = await db.music_tracks.find().sort("created_at", -1).to_list(100)
    return [MusicTrack(**track) for track in tracks]

# Shlokas
@api_router.post("/shlokas", response_model=Shloka)
async def create_shloka(shloka: ShlokaCreate):
    shloka_obj = Shloka(**shloka.dict())
    await db.shlokas.insert_one(shloka_obj.dict())
    return shloka_obj

@api_router.get("/shlokas", response_model=List[Shloka])
async def get_shlokas():
    shlokas = await db.shlokas.find().sort("created_at", -1).to_list(100)
    return [Shloka(**shloka) for shloka in shlokas]

# Quiz Results
@api_router.post("/quiz-results", response_model=QuizResult)
async def create_quiz_result(result: QuizResultCreate):
    result_obj = QuizResult(**result.dict())
    await db.quiz_results.insert_one(result_obj.dict())
    return result_obj

@api_router.get("/quiz-results", response_model=List[QuizResult])
async def get_quiz_results():
    results = await db.quiz_results.find().sort("date", -1).to_list(50)
    return [QuizResult(**result) for result in results]

# Calendar Events
@api_router.post("/calendar-events", response_model=CalendarEvent)
async def create_calendar_event(event: CalendarEventCreate):
    event_obj = CalendarEvent(**event.dict())
    await db.calendar_events.insert_one(event_obj.dict())
    return event_obj

@api_router.get("/calendar-events", response_model=List[CalendarEvent])
async def get_calendar_events(start_date: Optional[str] = None, end_date: Optional[str] = None):
    query = {}
    if start_date and end_date:
        query["event_date"] = {
            "$gte": datetime.fromisoformat(start_date),
            "$lte": datetime.fromisoformat(end_date)
        }
    events = await db.calendar_events.find(query).sort("event_date", 1).to_list(100)
    return [CalendarEvent(**event) for event in events]

@api_router.delete("/calendar-events/{event_id}")
async def delete_calendar_event(event_id: str):
    result = await db.calendar_events.delete_one({"id": event_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted"}

# AI-Powered Features
@api_router.post("/generate-quiz")
async def generate_quiz(request: GenerateQuizRequest):
    """Generate a quiz using AI based on Odissi dance theory"""
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"quiz_{uuid.uuid4()}",
            system_message="You are an expert in Odissi classical dance. Generate quiz questions about Odissi dance theory, terminology, history, and techniques."
        ).with_model("openai", "gpt-5.2")
        
        prompt = f"""Generate {request.num_questions} multiple choice questions about {request.topic} in Odissi dance.

For each question, provide:
1. The question text
2. Four options (A, B, C, D)
3. The correct answer (letter)
4. A brief explanation

Format your response as a JSON array of objects with keys: question, options (array of 4 strings), correct_answer (letter A-D), explanation

Example:
[
  {{
    "question": "What is the meaning of 'Tribhangi' in Odissi?",
    "options": ["Three bends", "Four positions", "Hand gesture", "Foot movement"],
    "correct_answer": "A",
    "explanation": "Tribhangi refers to the three-bend posture characteristic of Odissi dance."
  }}
]"""
        
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        # Parse the response
        import json
        questions = json.loads(response)
        
        return {"questions": questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating quiz: {str(e)}")

@api_router.post("/generate-insights")
async def generate_insights(request: GenerateInsightsRequest):
    """Generate AI insights based on practice history"""
    try:
        # Get recent practice sessions
        cutoff_date = datetime.utcnow() - timedelta(days=request.days_back)
        sessions = await db.practice_sessions.find(
            {"date": {"$gte": cutoff_date}}
        ).to_list(100)
        
        if not sessions:
            return {"insights": "No practice data available for the selected period. Start logging your practice sessions to get personalized insights!"}
        
        # Prepare session summary
        total_sessions = len(sessions)
        total_minutes = sum(s.get('duration_minutes', 0) for s in sessions)
        session_types = {}
        for s in sessions:
            st = s.get('session_type', 'unknown')
            session_types[st] = session_types.get(st, 0) + 1
        
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"insights_{uuid.uuid4()}",
            system_message="You are an expert Odissi dance teacher providing personalized practice insights and recommendations."
        ).with_model("openai", "gpt-5.2")
        
        prompt = f"""Based on the following Odissi dance practice data from the last {request.days_back} days, provide personalized insights and recommendations:

Total practice sessions: {total_sessions}
Total practice time: {total_minutes} minutes
Session breakdown: {session_types}

Provide:
1. Overall progress assessment
2. Strengths and areas for improvement
3. Specific recommendations for practice
4. Suggested focus areas for the next week

Keep the response concise, encouraging, and actionable."""
        
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        return {"insights": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating insights: {str(e)}")

# Statistics
@api_router.get("/statistics")
async def get_statistics():
    """Get practice statistics"""
    total_sessions = await db.practice_sessions.count_documents({})
    total_goals = await db.goals.count_documents({})
    completed_goals = await db.goals.count_documents({"completed": True})
    
    # Get sessions in last 7 days
    week_ago = datetime.utcnow() - timedelta(days=7)
    weekly_sessions = await db.practice_sessions.count_documents(
        {"date": {"$gte": week_ago}}
    )
    
    # Calculate total practice time
    sessions = await db.practice_sessions.find().to_list(1000)
    total_minutes = sum(s.get('duration_minutes', 0) for s in sessions)
    
    return {
        "total_sessions": total_sessions,
        "total_goals": total_goals,
        "completed_goals": completed_goals,
        "weekly_sessions": weekly_sessions,
        "total_practice_minutes": total_minutes,
        "total_practice_hours": round(total_minutes / 60, 1)
    }


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
