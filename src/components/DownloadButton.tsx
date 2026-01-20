import React, { useState } from 'react';
import SketchIcon from './SketchIcon';
import API_CONFIG from '../config';

interface DownloadButtonProps {
  startTime: number;
  endTime: number;
  videoId: string;
  disabled?: boolean;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  startTime,
  endTime,
  videoId,
  disabled,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [quality, setQuality] = useState('highest');
  const [format, setFormat] = useState('mp4');
  const [audioOnly, setAudioOnly] = useState(false);
  const [status, setStatus] = useState<string>('');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const [savePath, setSavePath] = useState<string>('');

  const handleFolderSelect = async () => {
    try {
      if ((window as any).electron) {
        // Desktop App: Use Electron's native dialog
        const path = await (window as any).electron.selectFolder();
        if (path) {
          setSavePath(path);
        }
      } else {
        // Web App: Use File System Access API
        try {
           // @ts-ignore - showDirectoryPicker is not yet in all TS definitions
          const dirHandle = await window.showDirectoryPicker();
          setSavePath(dirHandle.name); // We can only get the directory name in web for security
          // Note: Full path access is not possible in browser for security reasons, 
          // but we can assume downloads go to the browser's default download folder
          // or use the File System Access API to write directly (advanced).
          // For this MVP, we'll just show the name to indicate selection.
        } catch (err) {
          if ((err as Error).name !== 'AbortError') {
             console.error('Folder select error:', err);
             alert('Folder selection is not supported in this browser or was cancelled.');
          }
        }
      }
    } catch (error) {
      console.error('Failed to select folder:', error);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setStatus('Step 1/3: Connecting to server...');
    
    try {
      setStatus('Step 2/3: Downloading video...');
      
      // ... existing download logic ...
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId,
          startTime,
          endTime,
          quality,
          format,
          audioOnly,
          savePath: (window as any).electron ? savePath : undefined // Only send path if in Electron
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Download failed');
      }

      setStatus('Step 3/3: Finalizing clip...');
      const data = await response.json();
      
      // Trigger file download (Web & Electron)
      // Even in Electron, we can trigger a download if we want to save to a specific place not handled by backend,
      // but here the backend saves it. 
      // If we are on Web, we MUST trigger the browser download.
      // If we are on Electron AND provided a savePath to backend, backend might move it there.
      
      // For now, consistent behavior: Trigger download
       const downloadUrl = data.downloadUrl.startsWith('http') 
        ? data.downloadUrl 
        : `${API_CONFIG.BASE_URL}${data.downloadUrl}`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = data.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setStatus('✅ Processing complete!');
      setTimeout(() => setStatus(''), 5000);
      alert(`✅ Success!\n\nYour video clip has been downloaded:\n${data.fileName}\n\nFrom: ${formatTime(startTime)} to ${formatTime(endTime)}`);
    } catch (error: any) {
      console.error('Download error:', error);
      setStatus('❌ Failed');
      alert(`❌ Download failed:\n\n${error.message || error}\n\nPlease make sure:\n- Backend server is running\n- FFmpeg is installed\n- The video is available`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Quality and Format Options */}
      <div className="mb-4 space-y-3">
        <div className="sketch-card p-4">
          <label className="block mb-2 text-sm font-sketch text-ink">Quality:</label>
          <div className="flex gap-2 flex-wrap">
            {['highest', '1080p', '720p', '480p', '360p'].map((q) => (
              <button
                key={q}
                onClick={() => {
                  setQuality(q);
                  setAudioOnly(false);
                }}
                className={`px-3 py-1 text-sm font-hand sketch-border transition-all ${
                  quality === q && !audioOnly
                    ? 'bg-ink text-paper'
                    : 'bg-paper text-ink hover:shadow-sketch-sm'
                }`}
                style={{ transform: `rotate(${Math.random() * 2 - 1}deg)` }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="sketch-card p-4">
          <label className="block mb-2 text-sm font-sketch text-ink">Format:</label>
          <div className="flex gap-2">
            {['mp4', 'webm'].map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                disabled={audioOnly}
                className={`px-4 py-1 text-sm font-hand sketch-border transition-all disabled:opacity-30 ${
                  format === f && !audioOnly
                    ? 'bg-ink text-paper'
                    : 'bg-paper text-ink hover:shadow-sketch-sm'
                }`}
                style={{ transform: `rotate(${Math.random() * 2 - 1}deg)` }}
              >
                {f.toUpperCase()}
              </button>
            ))}
            <button
              onClick={() => setAudioOnly(true)}
              className={`px-4 py-1 text-sm font-hand sketch-border transition-all ${
                audioOnly
                  ? 'bg-ink text-paper'
                  : 'bg-paper text-ink hover:shadow-sketch-sm'
              }`}
              style={{ transform: `rotate(${Math.random() * 2 - 1}deg)` }}
            >
              🎵 Audio Only (MP3)
            </button>
          </div>
        </div>

        <div className="sketch-card p-4">
          <label className="block mb-2 text-sm font-sketch text-ink">Save Location:</label>
          <div className="flex gap-2 items-center">
             <button
              onClick={handleFolderSelect}
              className="px-4 py-1 text-sm font-hand sketch-border bg-paper text-ink hover:shadow-sketch-sm transition-all"
              style={{ transform: `rotate(${Math.random() * 2 - 1}deg)` }}
            >
              📁 Select Folder
            </button>
            <span className="text-xs font-hand text-muted-foreground truncate max-w-[200px]">
              {savePath || 'Default Downloads Folder'}
            </span>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={disabled || isDownloading}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          w-full py-5 px-8 
          text-2xl font-sketch
          flex items-center justify-center gap-4
          transition-all duration-200
          border-3 border-ink
          ${disabled 
            ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50' 
            : 'bg-ink text-paper hover:shadow-sketch-hover hover:-translate-y-1'
          }
          ${isHovered && !disabled ? 'rotate-1' : '-rotate-0.5'}
        `}
        style={{
          boxShadow: disabled ? 'none' : isHovered ? '6px 6px 0px hsl(var(--ink))' : '4px 4px 0px hsl(var(--ink))',
          transform: `rotate(${isHovered && !disabled ? 1 : -0.5}deg) translateY(${isHovered && !disabled ? -4 : 0}px)`,
        }}
      >
        {isDownloading ? (
          <div className="flex flex-col items-center">
            <span className="animate-spin text-3xl mb-1">⟳</span>
            <span className="text-sm font-hand">{status || 'Processing...'}</span>
          </div>
        ) : (
          <>
            <SketchIcon type="download" size={32} />
            <span>Download Section</span>
          </>
        )}
      </button>
      
      {/* Info text below button */}
      <p className="mt-4 text-center font-hand text-muted-foreground">
        {disabled 
          ? '← Load a video & select frames first'
          : audioOnly
            ? `Audio: ${formatTime(startTime)} → ${formatTime(endTime)} (MP3)`
            : `${quality} ${format.toUpperCase()}: ${formatTime(startTime)} → ${formatTime(endTime)}`
        }
      </p>

      {/* Decorative sketch arrows */}
      {!disabled && (
        <div className="flex justify-center mt-2 opacity-40">
          <svg width="60" height="30" viewBox="0 0 60 30" className="text-ink">
            <path
              d="M10 5 Q30 25, 50 5"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeDasharray="4 2"
            />
            <path
              d="M45 2 L50 5 L45 10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default DownloadButton;
