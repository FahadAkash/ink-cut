import React from 'react';
import SketchIcon from './SketchIcon';

interface VideoPlayerProps {
  videoId: string;
  currentTime: number;
  duration: number;
  onTimeUpdate?: (time: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoId, 
  currentTime, 
  duration 
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full">
      <div className="video-frame aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube Video Player"
        />
      </div>
      
      {/* Decorative frame corners */}
      <div className="relative mt-4 flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-ink">
          <SketchIcon type="play" size={18} />
          <span className="font-mono text-sm">{formatTime(currentTime)}</span>
        </div>
        <div className="flex-1 mx-4 h-0.5 bg-ink opacity-20" />
        <span className="font-mono text-sm text-ink">{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default VideoPlayer;
