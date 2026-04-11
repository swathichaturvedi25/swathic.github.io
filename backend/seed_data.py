from pymongo import MongoClient
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = MongoClient(mongo_url)
db = client[os.environ['DB_NAME']]

print("Seeding Odissi Dance Practice App database...")

# Clear existing data
print("Clearing existing data...")
db.theory_content.delete_many({})
db.shlokas.delete_many({})
db.goals.delete_many({})
db.practice_sessions.delete_many({})

print("Adding Theory Content...")

# Theory Content - Terminology
terminology_data = [
    {
        "id": "term_1",
        "category": "terminology",
        "title": "Tribhangi",
        "content": "Tribhangi is the signature three-bend posture of Odissi dance. The body takes three bends - at the neck, torso, and knee, creating an elegant S-shaped curve. This posture is derived from the sculptures of ancient Indian temples and represents the divine feminine energy. It is fundamental to Odissi and distinguishes it from other classical dance forms.",
        "created_at": datetime.utcnow()
    },
    {
        "id": "term_2",
        "category": "terminology",
        "title": "Chauk",
        "content": "Chauk or Chouka is a square-shaped sitting position fundamental to Odissi. The knees are bent outward, feet turned out, and the body sits in a squared posture. This position requires tremendous strength and flexibility. It is inspired by the temple sculptures and is used extensively in Odissi choreography, especially during the Pallavi section.",
        "created_at": datetime.utcnow()
    },
    {
        "id": "term_3",
        "category": "terminology",
        "title": "Mudra",
        "content": "Mudras are hand gestures used in Odissi to convey emotions, objects, and concepts. There are two main types: Asamyuta (single-hand) and Samyuta (double-hand) mudras. Each mudra has specific meanings and can represent multiple concepts depending on context. Mastering mudras is essential for storytelling in Odissi dance.",
        "created_at": datetime.utcnow()
    },
]

# Theory Content - Music Theory
music_theory_data = [
    {
        "id": "music_1",
        "category": "music_theory",
        "title": "Odissi Ragas",
        "content": "Odissi dance is performed to classical Odissi music, which uses ragas from the Hindustani and Carnatic traditions. Common ragas include Kalyana, Shree, Bhairavi, and Malkauns. Each raga evokes specific emotions (rasas) and is chosen based on the mood and theme of the dance piece. Understanding ragas helps dancers connect deeply with the music.",
        "created_at": datetime.utcnow()
    },
    {
        "id": "music_2",
        "category": "music_theory",
        "title": "Tala System",
        "content": "Tala is the rhythmic cycle in Odissi music. Common talas include Ektali (4 beats), Khemta (6 beats), Jati (5 beats), Rupak (7 beats), and Jhampa (5+2 pattern). Dancers must maintain perfect synchronization with the tala, executing movements on specific beats. The sam (first beat) is particularly important for coordinating complex choreography.",
        "created_at": datetime.utcnow()
    },
]

# Theory Content - History
history_data = [
    {
        "id": "hist_1",
        "category": "history",
        "title": "Origins of Odissi",
        "content": "Odissi is one of India's oldest classical dance forms, originating in the temples of Odisha over 2000 years ago. It was traditionally performed by Maharis (temple dancers) as a form of devotional worship. The dance form depicts stories from Hindu mythology, particularly tales of Lord Jagannath and Lord Krishna. Archaeological evidence of Odissi can be found in the sculptures of temples like Konark Sun Temple and Lingaraj Temple.",
        "created_at": datetime.utcnow()
    },
    {
        "id": "hist_2",
        "category": "history",
        "title": "Modern Revival",
        "content": "After declining during the colonial period, Odissi was revived in the 1950s-60s through the efforts of gurus like Kelucharan Mohapatra, Pankaj Charan Das, and Deba Prasad Das. They reconstructed the dance form based on temple sculptures, ancient texts like Natya Shastra, and surviving traditions. Today, Odissi is recognized as one of the eight classical dance forms of India and is performed worldwide.",
        "created_at": datetime.utcnow()
    },
]

# Theory Content - Cultural
cultural_data = [
    {
        "id": "cult_1",
        "category": "cultural",
        "title": "Costume and Ornaments",
        "content": "The traditional Odissi costume is designed to enhance the tribhangi posture and emphasize body movements. It includes a specially stitched sari with pleats in front, silver jewelry including the tahiya (head ornament), choker, armlets, and anklets. The costume mirrors the attire of temple sculptures, connecting the dancer to the dance's devotional heritage.",
        "created_at": datetime.utcnow()
    },
    {
        "id": "cult_2",
        "category": "cultural",
        "title": "Jagannath Culture",
        "content": "Odissi dance is deeply connected to the worship of Lord Jagannath, the presiding deity of Odisha. Many Odissi compositions are based on Jayadeva's Gita Govinda, which describes the divine love between Radha and Krishna (Jagannath). The dance form was traditionally performed in the Jagannath Temple in Puri and continues to celebrate this cultural heritage.",
        "created_at": datetime.utcnow()
    },
]

# Theory Content - Technique
technique_data = [
    {
        "id": "tech_1",
        "category": "technique",
        "title": "Basic Bhangas (Body Bends)",
        "content": "Odissi uses three primary bhangas or body positions: Samabhanga (straight, balanced position), Abhanga (body weight on one leg with a slight deflection), and Tribhanga (triple bend at neck, torso, and knee). Mastering these positions is fundamental to Odissi technique. Practice involves holding each position while maintaining proper alignment and grace.",
        "created_at": datetime.utcnow()
    },
    {
        "id": "tech_2",
        "category": "technique",
        "title": "Pada Bhedas (Foot Positions)",
        "content": "Foot positions in Odissi include Sama Pada (feet together), Swastika (one foot crossed over the other), Mandala (square position), and Chauk (basic sitting position). Each pada has specific applications in choreography. Strong, flexible feet are essential, as movements range from delicate toe work to powerful stamping (tatkar).",
        "created_at": datetime.utcnow()
    },
]

# Combine all theory content
all_theory = terminology_data + music_theory_data + history_data + cultural_data + technique_data
db.theory_content.insert_many(all_theory)
print(f"Added {len(all_theory)} theory content items")

print("Adding Shlokas...")

# Shlokas
shlokas_data = [
    {
        "id": "shloka_1",
        "title": "Nataraja Stuti",
        "sanskrit_text": "ओं नमः शिवाय नटराजाय",
        "transliteration": "Om Namah Shivaya Natarajaya",
        "meaning": "Salutations to Lord Shiva, the King of Dance. This shloka invokes Nataraja, the cosmic dancer, who represents the rhythm of the universe. In Odissi, this shloka is often recited before beginning practice or performance to seek blessings for the dance.",
        "viniyoga": "Recited at the beginning of dance practice or performance as an invocation to Lord Shiva, the adi (first) dancer.",
        "created_at": datetime.utcnow()
    },
    {
        "id": "shloka_2",
        "title": "Pushpanjali Shloka",
        "sanskrit_text": "अञ्जलिं पुष्पाञ्जलिं विश्वेश्वराय समर्पयामि",
        "transliteration": "Anjalim pushpanjalim vishveshvaraya samarpayami",
        "meaning": "I offer this salutation with flowers to the Lord of the Universe. Pushpanjali is the opening piece in Odissi performance where the dancer offers flowers to the divine, the guru, and the audience.",
        "viniyoga": "Used during Pushpanjali, the opening dance piece. The dancer makes offering gestures while reciting or having this shloka recited.",
        "created_at": datetime.utcnow()
    },
    {
        "id": "shloka_3",
        "title": "Guru Vandana",
        "sanskrit_text": "गुरुर्ब्रह्मा गुरुर्विष्णुः गुरुर्देवो महेश्वरः",
        "transliteration": "Gurur Brahma Gurur Vishnu Gurur Devo Maheshvarah",
        "meaning": "The Guru is Brahma (creator), the Guru is Vishnu (preserver), the Guru is the god Maheshvara (destroyer). This shloka honors the guru as embodying all divine powers, emphasizing the sacred guru-shishya relationship in classical dance.",
        "viniyoga": "Recited to honor and seek blessings from the guru before beginning practice or learning new choreography.",
        "created_at": datetime.utcnow()
    },
]

db.shlokas.insert_many(shlokas_data)
print(f"Added {len(shlokas_data)} shlokas")

print("Adding Sample Goals...")

# Sample Goals
goals_data = [
    {
        "id": "goal_1",
        "title": "Master Tribhangi Posture",
        "description": "Perfect the three-bend tribhangi position with proper alignment and grace",
        "target_date": datetime.utcnow() + timedelta(days=30),
        "completed": False,
        "created_at": datetime.utcnow()
    },
    {
        "id": "goal_2",
        "title": "Learn 5 Basic Mudras",
        "description": "Memorize and practice Pataka, Tripataka, Ardhachandra, Kartarimukha, and Mayura mudras",
        "target_date": datetime.utcnow() + timedelta(days=20),
        "completed": False,
        "created_at": datetime.utcnow()
    },
    {
        "id": "goal_3",
        "title": "Practice Daily for 30 Minutes",
        "description": "Establish a consistent daily practice routine of at least 30 minutes",
        "target_date": datetime.utcnow() + timedelta(days=45),
        "completed": False,
        "created_at": datetime.utcnow()
    },
]

db.goals.insert_many(goals_data)
print(f"Added {len(goals_data)} sample goals")

print("Adding Sample Practice Sessions...")

# Sample Practice Sessions
practice_sessions_data = [
    {
        "id": "session_1",
        "session_type": "timer",
        "duration_minutes": 45,
        "notes": "Worked on chauk position and basic footwork",
        "date": datetime.utcnow() - timedelta(days=2),
        "goals_achieved": []
    },
    {
        "id": "session_2",
        "session_type": "video_watching",
        "duration_minutes": 30,
        "notes": "Studied tribhangi technique from teacher video",
        "date": datetime.utcnow() - timedelta(days=1),
        "goals_achieved": []
    },
    {
        "id": "session_3",
        "session_type": "music",
        "duration_minutes": 25,
        "notes": "Practiced with traditional Odissi music, focusing on rhythm",
        "date": datetime.utcnow(),
        "goals_achieved": []
    },
]

db.practice_sessions.insert_many(practice_sessions_data)
print(f"Added {len(practice_sessions_data)} practice sessions")

print("\n=== Database Seeding Complete ===")
print(f"Theory Content: {db.theory_content.count_documents({})} items")
print(f"Shlokas: {db.shlokas.count_documents({})} items")
print(f"Goals: {db.goals.count_documents({})} items")
print(f"Practice Sessions: {db.practice_sessions.count_documents({})} items")
print("\nYour Odissi Dance Practice App is ready to use!")

client.close()