import express from 'express';
import cors from 'cors';
import ytdl from '@distube/ytdl-core';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';

// Configure FFmpeg to use the static binary
ffmpeg.setFfmpegPath(ffmpegStatic);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const DOWNLOADS_DIR = path.join(__dirname, process.env.DOWNLOADS_DIR || 'downloads');

// Create downloads directory if it doesn't exist
if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

// Serve frontend in production (packaged)
const DIST_DIR = path.join(__dirname, '../dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
}

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use('/downloads', express.static(DOWNLOADS_DIR));

// YouTube API setup
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

// Helper: Format duration from ISO 8601
function parseDuration(duration) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = (match[1] || '0H').slice(0, -1);
  const minutes = (match[2] || '0M').slice(0, -1);
  const seconds = (match[3] || '0S').slice(0, -1);
  return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
}

// API Endpoints

// Get video info
app.get('/api/video/info', async (req, res) => {
  try {
    const { videoId } = req.query;
    
    if (!videoId) {
      return res.status(400).json({ error: 'Video ID is required' });
    }

    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const options = getTdOptions();
    const info = await ytdl.getInfo(url, options);
    
    res.json({
      title: info.videoDetails.title,
      duration: parseInt(info.videoDetails.lengthSeconds),
      thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
      author: info.videoDetails.author.name
    });
  } catch (error) {
    console.error('Error fetching video info:', error);
    res.status(500).json({ error: 'Failed to fetch video information', details: error.message });
  }
});

// Search YouTube videos
app.get('/api/search', async (req, res) => {
  try {
    const { q, maxResults = 12, pageToken } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    if (!process.env.YOUTUBE_API_KEY) {
      return res.status(503).json({ 
        error: 'YouTube API key not configured',
        message: 'Please add YOUTUBE_API_KEY to your .env file'
      });
    }

    const searchResponse = await youtube.search.list({
      part: ['snippet'],
      q,
      maxResults: parseInt(maxResults),
      pageToken: pageToken || undefined,
      type: ['video'],
      videoDuration: 'medium' // Filter out shorts (they're usually under 60 seconds)
    });

    const videoIds = searchResponse.data.items.map(item => item.id.videoId).join(',');
    
    // Get video details including duration
    const videoResponse = await youtube.videos.list({
      part: ['contentDetails'],
      id: videoIds
    });

    // Filter out shorts (videos under 60 seconds)
    const results = [];
    searchResponse.data.items.forEach((item, index) => {
      const duration = videoResponse.data.items[index]?.contentDetails?.duration;
      const seconds = duration ? parseDuration(duration) : 0;
      
      // Skip shorts (less than 60 seconds)
      if (seconds >= 60) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        
        results.push({
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
          channel: item.snippet.channelTitle,
          duration: `${minutes}:${secs.toString().padStart(2, '0')}`
        });
      }
    });

    res.json({ 
      results,
      nextPageToken: searchResponse.data.nextPageToken,
      prevPageToken: searchResponse.data.prevPageToken,
      totalResults: searchResponse.data.pageInfo?.totalResults || 0
    });
  } catch (error) {
    console.error('Error searching videos:', error);
    res.status(500).json({ error: 'Failed to search videos', details: error.message });
  }
});

// Helper to get ytdl options with cookies if available
const getTdOptions = () => {
  const options = {
    requestOptions: {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    }
  };

  try {
    const cookiePath = path.join(__dirname, 'cookies.json');
    if (fs.existsSync(cookiePath)) {
      const cookies = JSON.parse(fs.readFileSync(cookiePath, 'utf8'));
      options.agent = ytdl.createAgent(cookies);
      console.log('🍪 YouTube cookies loaded successfully');
    }
  } catch (err) {
    console.warn('⚠️ Failed to load cookies:', err.message);
  }
  return options;
};

// Download video segment
app.post('/api/download', async (req, res) => {
  try {
    const { videoId, startTime, endTime, quality = 'highest', format = 'mp4', audioOnly = false } = req.body;
    
    if (!videoId || startTime === undefined || endTime === undefined) {
      return res.status(400).json({ error: 'videoId, startTime, and endTime are required' });
    }

    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const options = getTdOptions();
    
    const info = await ytdl.getInfo(url, options);
    const title = info.videoDetails.title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_').substring(0, 50);
    
    const timestamp = Date.now();
    const tempFilePath = path.join(DOWNLOADS_DIR, `temp_${timestamp}.mp4`);
    const extension = audioOnly ? 'mp3' : format;
    const outputFilePath = path.join(DOWNLOADS_DIR, `${title}_${timestamp}.${extension}`);
    const outputFileName = path.basename(outputFilePath);

    // Select format based on quality preference
    let selectedFormat;
    if (audioOnly) {
      // Get audio only
      selectedFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });
    } else {
      // Quality mapping
      const qualityMap = {
        'highest': 'highestvideo',
        '1080p': 'highestvideo',
        '720p': '136', // 720p video
        '480p': '135', // 480p video
        '360p': '134'  // 360p video
      };

      const qualityFilter = qualityMap[quality] || 'highestvideo';
      selectedFormat = ytdl.chooseFormat(info.formats, { quality: qualityFilter, filter: 'audioandvideo' });
      
      // Fallback if specific quality not available
      if (!selectedFormat) {
        selectedFormat = ytdl.chooseFormat(info.formats, { quality: 'highestvideo', filter: 'audioandvideo' });
      }
    }
    
    if (!selectedFormat) {
      return res.status(400).json({ error: 'No suitable video format found' });
    }

    // Download the full video/audio first
    const downloadStream = ytdl(url, { ...options, format: selectedFormat });
    const writeStream = fs.createWriteStream(tempFilePath);
    
    downloadStream.pipe(writeStream);

    writeStream.on('finish', () => {
      // Use FFmpeg to extract segment and convert format
      const ffmpegCommand = ffmpeg(tempFilePath);
      
      if (audioOnly) {
        // Extract audio as MP3
        ffmpegCommand
          .setStartTime(startTime)
          .setDuration(endTime - startTime)
          .toFormat('mp3')
          .audioBitrate(192)
          .output(outputFilePath);
      } else {
        // Extract video segment
        ffmpegCommand
          .setStartTime(startTime)
          .setDuration(endTime - startTime)
          .toFormat(format)
          .output(outputFilePath);
      }

      ffmpegCommand
        .on('end', () => {
          // Clean up temp file
          fs.unlinkSync(tempFilePath);
          
          res.json({
            success: true,
            fileName: outputFileName,
            downloadUrl: `/downloads/${outputFileName}`,
            message: audioOnly 
              ? 'Audio extracted successfully' 
              : 'Video segment processed successfully',
            fileType: extension
          });
        })
        .on('error', (err) => {
          console.error('FFmpeg error:', err);
          // Clean up temp file
          if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
          }
          res.status(500).json({ error: 'Failed to process media', details: err.message });
        })
        .run();
    });

    writeStream.on('error', (err) => {
      console.error('Write stream error:', err);
      res.status(500).json({ error: 'Failed to download video', details: err.message });
    });

  } catch (error) {
    console.error('Error downloading video:', error);
    res.status(500).json({ error: 'Failed to download video', details: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'InkCut backend server is running',
    youtubeApiConfigured: !!process.env.YOUTUBE_API_KEY
  });
});

// Start server
// Fallback for SPA routing - Register this AFTER all API routes
app.get('*', (req, res) => {
  const DIST_DIR = path.join(__dirname, '../dist');
  const indexHtml = path.join(DIST_DIR, 'index.html');
  
  console.log(`Checking for frontend at: ${indexHtml}`);
  
  if (fs.existsSync(indexHtml)) {
    res.sendFile(indexHtml);
  } else {
    console.error(`Frontend file not found at: ${indexHtml}`);
    res.status(404).json({ 
      error: 'Frontend not found',
      path: indexHtml,
      exists: false,
      cwd: process.cwd(),
      dirname: __dirname
    });
  }
});

// Serve a dedicated player page for embedding in Electron
app.get('/api/player/:videoId', (req, res) => {
  const { videoId } = req.params;
  
  // Send a complete, self-contained HTML page with no external dependencies
  res.setHeader('Content-Type', 'text/html');
  res.send(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <style>
      body, html { 
        margin: 0; 
        padding: 0; 
        width: 100%; 
        height: 100%; 
        overflow: hidden; 
        background: #000; 
      }
      #player { 
        width: 100%; 
        height: 100%; 
      }
    </style>
  </head>
  <body>
    <div id="player"></div>
    <script>
      // Load YouTube IFrame API
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          height: '100%',
          width: '100%',
          videoId: '${videoId}',
          playerVars: {
            'playsinline': 1,
            'rel': 0,
            'modestbranding': 1,
            'origin': window.location.origin
          },
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
          }
        });
      }

      function onPlayerReady(event) {
        window.parent.postMessage({ type: 'READY', duration: event.target.getDuration() }, '*');
      }

      function onPlayerStateChange(event) {
         if (event.data == YT.PlayerState.PLAYING) {
            setInterval(function() {
               if (player && player.getCurrentTime) {
                 window.parent.postMessage({ type: 'TIME_UPDATE', currentTime: player.getCurrentTime() }, '*');
               }
            }, 250);
         }
      }
       
       function onPlayerError(event) {
          window.parent.postMessage({ type: 'ERROR', data: event.data }, '*');
       }

      // Listen for messages from parent
      window.addEventListener('message', function(event) {
        if (!player || !player.seekTo) return;
        
        if (event.data.type === 'SEEK') {
          player.seekTo(event.data.time);
        }
        if (event.data.type === 'PAUSE') {
          player.pauseVideo();
        }
         if (event.data.type === 'PLAY') {
          player.playVideo();
        }
      });
    </script>
  </body>
</html>`);
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 InkCut backend server running on http://localhost:${PORT}`);
  console.log(`📁 Downloads directory: ${DOWNLOADS_DIR}`);
  console.log(`📁 Static files path: ${path.join(__dirname, '../dist')}`);
  console.log(`🔑 YouTube API: ${process.env.YOUTUBE_API_KEY ? 'Configured ✓' : 'Not configured ✗'}`);
  console.log('\nAvailable endpoints:');
  console.log(`  GET  /health - Health check`);
  console.log(`  GET  /api/video/info?videoId=xxx - Get video metadata`);
  console.log(`  GET  /api/search?q=query - Search YouTube videos`);
  console.log(`  POST /api/download - Download video segment`);
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`⚠️ Port ${PORT} is in use - Likely another instance is running`);
  } else {
    console.error('Server error:', e);
  }
});
