# 🚀 Quick Start Guide - InkCut

## Before You Start

Make sure you have FFmpeg installed. Check with:
```bash
ffmpeg -version
```

If not installed:
- **Windows**: `winget install ffmpeg`
- **Mac**: `brew install ffmpeg`
- **Linux**: `sudo apt install ffmpeg`

## Step 1: Backend Setup (Optional YouTube API)

If you want YouTube search to work:

1. Get a YouTube Data API v3 key from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create `.env` file in the `server` folder:
   ```bash
   cd server
   cp .env.example .env
   ```
3. Edit `server/.env` and add your API key:
   ```env
   YOUTUBE_API_KEY=your_actual_api_key_here
   PORT=3001
   DOWNLOADS_DIR=./downloads
   ```

## Step 2: Run the Application

### Option A: Run Everything Together (Easiest)
```bash
npm run dev:full
```

This will start both:
- Frontend on http://localhost:5173
- Backend on http://localhost:3001

### Option B: Run Separately

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## Step 3: Use the App!

1. Open http://localhost:5173 in your browser
2. **Search Tab**: Search for YouTube videos (requires API key)
3. **URL Tab**: Paste any YouTube URL
4. Adjust the start/end sliders to select your clip
5. Click "Download Section" 

Your video clip will be processed and downloaded automatically! 🎉

## Troubleshooting

### "Backend server is not running"
- Make sure you've started the backend: `cd server && npm start`
- Check that port 3001 is not blocked

### "FFmpeg not found"
- Install FFmpeg and make sure it's in your PATH
- Restart your terminal after installation

### "YouTube API not configured"
- The app works without an API key, but search will show demo results
- To enable real search, add YOUTUBE_API_KEY to `server/.env`

### Downloads folder location
Videos are saved to: `server/downloads/`

## Features

✅ Download specific video segments  
✅ YouTube search (with API key)  
✅ Direct URL input (works without API key)  
✅ Beautiful hand-drawn UI  
✅ Frame-precise selection  

---

**Legal Notice**: Only download videos you own or have permission to download.
