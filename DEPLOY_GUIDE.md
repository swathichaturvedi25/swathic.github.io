# AVAHSA - Deployment Guide

## Deploy to Vercel (Recommended for Portfolio)

### Prerequisites
1. Push this repo to GitHub
2. Create a free account on [Vercel](https://vercel.com)
3. Create a free MongoDB Atlas cluster at [mongodb.com](https://www.mongodb.com/atlas)

### Step 1: Set Up MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free cluster
2. Create a database user (username + password)
3. Whitelist all IPs: `0.0.0.0/0` (for Vercel serverless)
4. Copy your connection string: `mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/avahsa`

### Step 2: Deploy on Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel will auto-detect the `vercel.json` config
4. Add these **Environment Variables** in Vercel dashboard:
   - `MONGO_URL` = your MongoDB Atlas connection string
   - `DB_NAME` = `avahsa`
   - `EMERGENT_LLM_KEY` = your Emergent LLM key (for AI Quiz & Insights)
5. Click **Deploy**

### Step 3: Custom Domain (Optional)
1. In Vercel project settings → Domains
2. Add your custom domain
3. Update DNS records as instructed by Vercel

### What Works on Web
- All screens: Home, Practice, Learn, Calendar, Profile
- Hasta Bheda with 52 shlokas
- Tala with VL/ML/DL Dharanas
- AI Quiz & Practice Insights
- Video upload and playback

### Important Notes
- **Video uploads**: Vercel has ephemeral filesystem, so uploaded videos won't persist between deployments. For production, consider using cloud storage (AWS S3, Cloudinary) for video files.
- **MongoDB**: Must use MongoDB Atlas (cloud) instead of local MongoDB
- **Environment variables**: Never commit secrets to GitHub — always set them in Vercel dashboard

## Alternative: Separate Deployments
If you prefer more control:
- **Frontend**: Deploy `frontend/` to Vercel as a static Expo web build
- **Backend**: Deploy `backend/` to [Railway](https://railway.app) or [Render](https://render.com)
- Update `EXPO_PUBLIC_API_URL` in frontend to point to your backend URL
