import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import SketchIcon from './SketchIcon';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export interface VideoPlayerHandle {
  seekTo: (seconds: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
}

interface VideoPlayerProps {
  videoId: string;
  onReady?: (duration: number) => void;
  onTimeUpdate?: (time: number) => void;
}

export const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(({ 
  videoId,
  onReady,
  onTimeUpdate,
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Load YouTube IFrame API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (containerRef.current && window.YT?.Player) {
        playerRef.current = new window.YT.Player(containerRef.current, {
          videoId,
          playerVars: {
            enablejsapi: 1,
            modestbranding: 1,
            rel: 0,
          },
          events: {
            onReady: (event: any) => {
              setIsReady(true);
              const dur = event.target.getDuration();
              setDuration(dur);
              onReady?.(dur);
            },
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                // Update time periodically while playing
                const interval = setInterval(() => {
                  if (playerRef.current?.getCurrentTime) {
                    const time = playerRef.current.getCurrentTime();
                    setCurrentTime(time);
                    onTimeUpdate?.(time);
                  }
                }, 250);
                
                // Clear interval when not playing
                const checkState = setInterval(() => {
                  if (playerRef.current?.getPlayerState?.() !== window.YT.PlayerState.PLAYING) {
                    clearInterval(interval);
                    clearInterval(checkState);
                  }
                }, 500);
              }
            },
          },
        });
      }
    };

    if (window.YT?.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    seekTo: (seconds: number) => {
      if (playerRef.current?.seekTo) {
        playerRef.current.seekTo(seconds, true);
        playerRef.current.pauseVideo();
        setCurrentTime(seconds);
      }
    },
    getCurrentTime: () => {
      return playerRef.current?.getCurrentTime?.() || 0;
    },
    getDuration: () => {
      return playerRef.current?.getDuration?.() || 0;
    },
  }));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full">
      <div className="video-frame aspect-video relative">
        <div ref={containerRef} className="w-full h-full" />
        
        {/* Loading overlay */}
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-paper">
            <div className="text-center">
              <div className="animate-spin text-4xl mb-2">⟳</div>
              <p className="font-hand text-ink">Loading video...</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Time display */}
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
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
