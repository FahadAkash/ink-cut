# InkCut Backend Server

Backend API server for the InkCut YouTube video downloader.

## Features

- 🎥 YouTube video metadata fetching
- 🔍 YouTube video search (via YouTube Data API v3)
- ✂️ Video segment downloading with frame selection
- 📦 FFmpeg-powered video processing

## Prerequisites

1. **Node.js** (v18 or higher)
2. **FFmpeg** - Must be installed and available in PATH
   - Windows: Download from [ffmpeg.org](https://ffmpeg.org/download.html) or use `winget install ffmpeg`
   - Mac: `brew install ffmpeg`
   - Linux: `sudo apt install ffmpeg`

## Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

### 3. Get YouTube API Key (Optional but recommended for search)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **YouTube Data API v3**
4. Create credentials (API Key)
5. Add the API key to your `.env` file:

```env
YOUTUBE_API_KEY=your_actual_api_key_here
```

### 4. Start the Server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## API Endpoints

### GET `/health`
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "message": "InkCut backend server is running",
  "youtubeApiConfigured": true
}
```

### GET `/api/video/info`
Get video metadata

**Query Parameters:**
- `videoId` (required) - YouTube video ID

**Response:**
```json
{
  "title": "Video Title",
  "duration": 180,
  "thumbnail": "https://...",
  "author": "Channel Name"
}
```

### GET `/api/search`
Search YouTube videos

**Query Parameters:**
- `q` (required) - Search query
- `maxResults` (optional) - Number of results (default: 10)

**Response:**
```json
{
  "results": [
    {
      "id": "videoId",
      "title": "Video Title",
      "thumbnail": "https://...",
      "channel": "Channel Name",
      "duration": "3:45"
    }
  ]
}
```

### POST `/api/download`
Download video segment

**Request Body:**
```json
{
  "videoId": "dQw4w9WgXcQ",
  "startTime": 10,
  "endTime": 30
}
```

**Response:**
```json
{
  "success": true,
  "fileName": "video_name_123456.mp4",
  "downloadUrl": "/downloads/video_name_123456.mp4",
  "message": "Video segment processed successfully"
}
```

## Troubleshooting

### FFmpeg not found
Make sure FFmpeg is installed and available in your system PATH. Test with:
```bash
ffmpeg -version
```

### YouTube API quota exceeded
The free YouTube Data API quota is 10,000 units per day. Each search costs ~100 units.

### Video download fails
- Check if the video is available and not age-restricted
- Some videos may be blocked by YouTube's anti-bot measures
- Try a different video to test

## Legal Notice

This tool is for educational purposes only. Downloading YouTube videos may violate YouTube's Terms of Service. Only download videos you own or have permission to download.
