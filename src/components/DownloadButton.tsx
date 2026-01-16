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

  const handleDownload = () => {
    setIsDownloading(true);
    // Simulate download process
    setTimeout(() => {
      setIsDownloading(false);
      alert(`Download initiated!\n\nVideo: ${videoId}\nFrom: ${formatTime(startTime)}\nTo: ${formatTime(endTime)}\n\nNote: This is a demo. Backend integration required for actual downloads.`);
    }, 2000);
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
