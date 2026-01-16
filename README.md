# 🎨 InkCut - YouTube Video Clip Downloader

<div align="center">

![InkCut Logo](public/placeholder.svg)

**A beautiful, sketch-style web application for downloading specific segments of YouTube videos**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-lightgrey.svg)](https://expressjs.com/)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [API](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 About

InkCut is a modern web application that allows you to download specific segments from YouTube videos with precise frame-level control. Built with a unique hand-drawn, sketch-style aesthetic, it combines beautiful UI design with powerful video processing capabilities.

### Why InkCut?

- **Frame-Precise Selection** - Choose exact start and end points for your clips
- **No Full Downloads** - Save bandwidth by downloading only what you need
- **Beautiful Interface** - Hand-drawn sketch UI that's both functional and delightful
- **YouTube Search** - Built-in search to find videos without leaving the app
- **One-Click Clipboard** - Paste and download with a single click
- **Open Source** - Free to use, modify, and contribute

---

## ✨ Features

### Core Functionality
- 🎯 **Precise Frame Selection** - Drag sliders to select start and end frames with second-level precision
- ✂️ **Video Segment Download** - Download only the portion you need, processed with FFmpeg
- 🎥 **Embedded Player** - Preview videos directly in the app before downloading
- 📋 **Clipboard Quick Download** - Copy a YouTube URL and download with one click
- 🔍 **YouTube Search** - Search YouTube videos directly in the app (with API key)
- 📊 **Pagination** - Browse search results with Previous/Next and numbered pages
- 🚫 **Shorts Filter** - Automatically filters out YouTube Shorts from search results

### User Experience
- 🎨 **Hand-Drawn UI** - Beautiful sketch-style interface with ink illustrations
- 🌙 **Dark Mode Support** - Easy on the eyes with sketch-themed dark design
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ⚡ **Fast Processing** - Efficient video processing with FFmpeg
- 🔄 **Real-time Progress** - Visual feedback during download and processing
- 💾 **Smart Error Handling** - Helpful error messages guide you through issues

### Technical Features
- 🏗️ **Modern Stack** - React, TypeScript, Vite, Express, Node.js
- 🎭 **Component Library** - Built with Shadcn/ui and Radix UI
- 🔌 **RESTful API** - Well-documented backend API
- 🔐 **Secure** - Environment variables for API keys, gitignored sensitive data
- 📦 **Easy Deployment** - Simple setup with npm, runs locally

---

## 🎬 Demo

### Main Interface
The app features three main sections:
1. **Search Tab** - Find YouTube videos with real-time search
2. **URL Tab** - Paste YouTube links directly
3. **Video Player** - Preview and select frames for download

### Quick Download
Copy any YouTube URL → Click "Quick Download from Clipboard" → Video loads instantly!

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have installed:

1. **Node.js** (v18 or higher)
   ```bash
   node --version  # Should be 18.0.0 or higher
   ```
   [Download Node.js](https://nodejs.org/)

2. **FFmpeg** (Required for video processing)
   - **Windows**: 
     ```bash
     winget install ffmpeg
     ```
     Or download from [ffmpeg.org](https://ffmpeg.org/download.html)
   
   - **Mac**: 
     ```bash
     brew install ffmpeg
     ```
   
   - **Linux**: 
     ```bash
     sudo apt update
     sudo apt install ffmpeg
     ```
   
   Verify installation:
   ```bash
   ffmpeg -version
   ```

3. **YouTube Data API Key** (Optional - for search functionality)
   - Get a free API key from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - See [API Setup Guide](#youtube-api-setup) below

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ink-cut.git
   cd ink-cut
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

3. **Configure environment (Optional)**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env and add your YOUTUBE_API_KEY
   ```

4. **Start the application**
   ```bash
   npm run dev:full
   ```

5. **Open your browser**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:3001](http://localhost:3001)

---

## 🎯 Usage

### Method 1: Search for Videos
1. Click the **Search** tab
2. Enter keywords (e.g., "funny cats", "music video")
3. Browse results with pagination (1, 2, 3... buttons)
4. Click any video to load it

### Method 2: Paste URL Directly
1. Click the **URL** tab
2. Paste a YouTube URL
3. Click **Load** button

### Method 3: Quick Clipboard Download
1. Copy any YouTube URL (Ctrl+C / Cmd+C)
2. Go to **URL** tab
3. Click **📋 Quick Download from Clipboard**
4. Video loads automatically!

### Selecting and Downloading Clips
1. After loading a video, use the **sliders** to select start and end frames
2. Preview by dragging the markers
3. Click **Download Section** button
4. Your clip downloads automatically!

### Supported URL Formats
- `https://youtube.com/watch?v=VIDEO_ID`
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://youtube.com/shorts/VIDEO_ID`

---

## 🔧 Configuration

### YouTube API Setup

To enable YouTube search functionality:

1. **Go to Google Cloud Console**
   - Visit [console.cloud.google.com](https://console.cloud.google.com/)

2. **Create a project** (or select existing)
   - Click "Select a project" → "New Project"
   - Name it (e.g., "InkCut App")

3. **Enable YouTube Data API v3**
   - Navigate to "APIs & Services" → "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"

4. **Create API Key**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy your API key

5. **Configure InkCut**
   ```bash
   cd server
   nano .env  # or use your favorite editor
   ```
   
   Add:
   ```env
   YOUTUBE_API_KEY=your_actual_api_key_here
   PORT=3001
   DOWNLOADS_DIR=./downloads
   ```

6. **Restart the backend**
   ```bash
   # Stop with Ctrl+C, then:
   npm run dev:full
   ```

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `YOUTUBE_API_KEY` | YouTube Data API v3 key | - | No* |
| `PORT` | Backend server port | 3001 | No |
| `DOWNLOADS_DIR` | Download directory | `./downloads` | No |

*Required only for YouTube search. URL downloads work without it.

---

## 📁 Project Structure

```
ink-cut/
├── src/                      # Frontend source code
│   ├── components/          # React components
│   │   ├── DownloadButton.tsx
│   │   ├── VideoPlayer.tsx
│   │   ├── VideoSearch.tsx
│   │   ├── UrlInput.tsx
│   │   └── ui/             # Shadcn UI components
│   ├── pages/              # Page components
│   │   └── Index.tsx
│   └── main.tsx            # Entry point
├── server/                  # Backend server
│   ├── index.js            # Express server
│   ├── package.json        # Backend dependencies
│   ├── .env               # Environment config (gitignored)
│   └── README.md          # Backend documentation
├── public/                 # Static assets
├── package.json           # Frontend dependencies
├── README.md             # This file
└── .gitignore           # Git ignore rules
```

---

## 🛠️ API Documentation

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "ok",
  "message": "InkCut backend server is running",
  "youtubeApiConfigured": true
}
```

#### Get Video Info
```http
GET /api/video/info?videoId=VIDEO_ID
```
**Parameters:**
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

#### Search Videos
```http
GET /api/search?q=QUERY&maxResults=12&pageToken=TOKEN
```
**Parameters:**
- `q` (required) - Search query
- `maxResults` (optional) - Results per page (default: 12)
- `pageToken` (optional) - Pagination token

**Response:**
```json
{
  "results": [...],
  "nextPageToken": "...",
  "prevPageToken": "...",
  "totalResults": 1000
}
```

#### Download Video Segment
```http
POST /api/download
Content-Type: application/json

{
  "videoId": "VIDEO_ID",
  "startTime": 10,
  "endTime": 30
}
```
**Response:**
```json
{
  "success": true,
  "fileName": "video_123.mp4",
  "downloadUrl": "/downloads/video_123.mp4",
  "message": "Video segment processed successfully"
}
```

---

## 🐛 Troubleshooting

### FFmpeg Not Found
**Error:** `FFmpeg not found in PATH`

**Solution:**
1. Install FFmpeg (see [Installation](#installation))
2. Make sure it's in your system PATH
3. Restart your terminal
4. Test: `ffmpeg -version`

### Backend Connection Failed
**Error:** `Failed to connect to backend`

**Solution:**
1. Make sure backend is running: `cd server && npm start`
2. Check port 3001 is not in use: `netstat -ano | findstr :3001`
3. Check firewall settings

### YouTube Search Not Working
**Error:** `YouTube API not configured` or `403 Forbidden`

**Solution:**
1. Get API key from Google Cloud Console
2. Add to `server/.env`: `YOUTUBE_API_KEY=your_key`
3. Make sure YouTube Data API v3 is enabled
4. Check API restrictions are not blocking the search endpoint
5. Restart backend server

### API Quota Exceeded
**Error:** `Quota exceeded`

**Solution:**
- Free tier: 10,000 units/day
- Each search: ~100 units
- Use URL tab instead (doesn't use quota)
- Or upgrade to paid tier in Google Cloud

### Download Failed
**Error:** `Failed to download video`

**Solution:**
1. Check if video is available/not age-restricted
2. Try a different video
3. Check FFmpeg is working
4. Check server logs for details

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Reporting Bugs
1. Check existing issues first
2. Create a new issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

### Suggesting Features
1. Open an issue with tag `enhancement`
2. Describe the feature and use case
3. Discuss implementation approach

### Pull Requests
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Setup
```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/ink-cut.git
cd ink-cut

# Install dependencies
npm install
cd server && npm install && cd ..

# Start development
npm run dev:full
```

---

## ⚖️ Legal Notice

**IMPORTANT:** This tool is for educational purposes only.

- Downloading YouTube videos may violate YouTube's Terms of Service
- Only download videos you own or have explicit permission to download
- Respect copyright and content creator rights
- Use responsibly and ethically

The developers of InkCut are not responsible for misuse of this software.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **React** - UI framework
- **Vite** - Build tool
- **Express** - Backend framework
- **FFmpeg** - Video processing
- **Shadcn/ui** - UI components
- **YouTube Data API** - Search functionality
- **@distube/ytdl-core** - YouTube downloader
- All open source contributors!

---

## 📞 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/yourusername/ink-cut/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/ink-cut/discussions)
- 📧 **Email**: your.email@example.com

---

## 🗺️ Roadmap

- [ ] Audio-only download option
- [ ] Multiple quality selection (720p, 1080p, 4K)
- [ ] Batch download support
- [ ] Playlist support
- [ ] Download queue
- [ ] Dark/Light theme toggle
- [ ] Custom shortcuts
- [ ] Download history
- [ ] Cloud storage integration
- [ ] Mobile app (React Native)

---

<div align="center">

Made with ✏️ & ☕ by [Your Name]

⭐ Star this repo if you find it helpful!

[Report Bug](https://github.com/yourusername/ink-cut/issues) · [Request Feature](https://github.com/yourusername/ink-cut/issues)

</div>

