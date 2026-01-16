# Building InkCut Desktop App

## Prerequisites
- Node.js 18+
- FFmpeg (must be in system PATH)
- Windows: Run as Administrator for first build

## Development

### Run in Development Mode
```bash
# Install all dependencies
npm install

# Run Electron app in development
npm run dev:electron
```

This will start:
- Frontend (Vite dev server on port 8080)
- Backend (Express on port 3001)
- Electron window

## Building Executable

### Build for Windows
```bash
npm run build:win
```

Output: `release/InkCut-1.0.0-Setup.exe`

### Build for All Platforms
```bash
npm run build:electron
```

## Installation

1. Double-click `InkCut-1.0.0-Setup.exe`
2. Choose installation directory
3. Desktop shortcut will be created
4. Run "InkCut" from Start Menu or Desktop

## What's Included

The executable includes:
- ✅ Frontend React app (bundled)
- ✅ Backend Express server (embedded)
- ✅ All dependencies
- ✅ FFmpeg (you still need to install separately)

## Configuration

### YouTube API Key
After installation, create/edit:
```
C:\Users\<YourName>\AppData\Roaming\InkCut\server\.env
```

Add:
```env
YOUTUBE_API_KEY=your_key_here
```

## Troubleshooting

**Build fails:**
- Make sure you ran `npm install` first
- Check Node.js version: `node --version` (18+)
- Run as Administrator

**FFmpeg not found:**
- Install FFmpeg globally
- Add to system PATH
- Restart InkCut after installation

**Backend not starting:**
- Check if port 3001 is available
- Close other InkCut instances
- Check antivirus settings

## File Sizes
- Installer: ~150-200 MB (includes all dependencies)
- Installed: ~400 MB

## Uninstall
- Windows: Control Panel → Programs → Uninstall InkCut
- Or use uninstaller in installation folder
