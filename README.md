# 🎨 InkCut - YouTube Video Clip Downloader

A beautiful, sketch-style web application for downloading specific segments of YouTube videos. Features a hand-drawn UI aesthetic with intuitive frame-by-frame selection.

![ClipCraft Banner](public/placeholder.svg)

## ✨ Features

- 🎯 **Precise Frame Selection** - Select exact start and end frames
- 🔍 **YouTube Search** - Search and browse YouTube videos directly
- ✂️ **Segment Download** - Download only the portion you need
- 🎨 **Beautiful UI** - Hand-drawn, sketch-style interface
- ⚡ **Fast Processing** - FFmpeg-powered video extraction

## 🛠️ Prerequisites

Before you begin, ensure you have:

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **FFmpeg** - Required for video processing
   - **Windows**: `winget install ffmpeg` or download from [ffmpeg.org](https://ffmpeg.org/download.html)
   - **Mac**: `brew install ffmpeg`
   - **Linux**: `sudo apt install ffmpeg`
3. **YouTube Data API Key** (optional, for search) - [Get one here](https://console.cloud.google.com/apis/credentials)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Configure Backend (Optional)

For YouTube search functionality, configure the API key:

```bash
cd server
cp .env.example .env
# Edit .env and add your YOUTUBE_API_KEY
```

### 3. Run the Application

**Option A: Run both frontend and backend together (Recommended)**
```bash
npm run dev:full
```

**Option B: Run separately**
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
npm run dev
```

The app will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## 📖 Usage

1. **Search or Paste URL**
   - Use the Search tab to find videos
   - Or paste a YouTube URL directly

2. **Select Frames**
   - Use the sliders to mark start and end points
   - Preview by dragging the markers

3. **Download**
   - Click "Download Section"
   - Your clip will be processed and downloaded

## 🔧 Configuration

### YouTube API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable **YouTube Data API v3**
4. Create an API key
5. Add to `server/.env`:
   ```env
   YOUTUBE_API_KEY=your_key_here
   ```

### Port Configuration

Edit `server/.env` to change ports:
```env
PORT=3001
```

## 📁 Project Structure

```
ink-cut/
├── src/                    # Frontend source
│   ├── components/        # React components
│   ├── pages/            # Page components
│   └── main.tsx          # Entry point
├── server/                # Backend server
│   ├── index.js          # Express server
│   ├── package.json      # Server dependencies
│   └── .env             # Configuration
└── public/               # Static assets
```

## 🧪 Technologies

**Frontend:**
- Vite - Build tool
- React - UI framework
- TypeScript - Type safety
- Tailwind CSS - Styling
- Shadcn/ui - UI components

**Backend:**
- Express - Web server
- @distube/ytdl-core - YouTube downloader
- FFmpeg - Video processing
- YouTube Data API v3 - Search

## ⚖️ Legal Notice

This tool is for **educational purposes only**. Downloading YouTube videos may violate YouTube's Terms of Service. Only download content you own or have explicit permission to download.

## 🐛 Troubleshooting

### FFmpeg not found
```bash
# Verify FFmpeg is installed
ffmpeg -version
```

### Backend connection failed
- Ensure backend is running: `cd server && npm start`
- Check port 3001 is not in use
- Verify no firewall blocking

### Search not working
- Check if `YOUTUBE_API_KEY` is set in `server/.env`
- Verify API key is valid
- Note: Free tier has quota limits (10,000 units/day)

## 📝 License

MIT

---

Made with ✏️ & ☕ by [Your Name]

