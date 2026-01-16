import React, { useState } from 'react';
import SketchIcon from './SketchIcon';

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId,
          startTime,
          endTime
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Download failed');
      }

      const data = await response.json();
      
      // Trigger file download
      const downloadUrl = `http://localhost:3001${data.downloadUrl}`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = data.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert(`✅ Success!\n\nYour video clip has been downloaded:\n${data.fileName}\n\nFrom: ${formatTime(startTime)} to ${formatTime(endTime)}`);
    } catch (error) {
      console.error('Download error:', error);
      alert(`❌ Download failed:\n\n${error.message}\n\nPlease make sure:\n- Backend server is running (npm start in /server)\n- FFmpeg is installed\n- The video is available`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
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
          <>
            <span className="animate-spin text-3xl">⟳</span>
            <span>Preparing Clip...</span>
          </>
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
          : `Clip: ${formatTime(startTime)} → ${formatTime(endTime)}`
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
