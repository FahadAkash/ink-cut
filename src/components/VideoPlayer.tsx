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
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Direct YouTube embed URL
  const embedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`;

  // Load YouTube IFrame API for controls
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }

    const initPlayer = () => {
      if (iframeRef.current && window.YT?.Player) {
        try {
          playerRef.current = new window.YT.Player(iframeRef.current, {
            events: {
              onReady: (event: any) => {
                console.log('✅ YouTube Player Ready');
                const dur = event.target.getDuration();
                if (dur > 0) {
                  setDuration(dur);
                  setIsReady(true);
                  onReady?.(dur);
                } else {
                  setTimeout(() => {
                    const retryDur = event.target.getDuration() || 180;
                    setDuration(retryDur);
                    setIsReady(true);
                    onReady?.(retryDur);
                  }, 1500);
                }
              },
              onError: (err: any) => {
                console.error('❌ YouTube Error:', err.data);
                setIsReady(true);
                let msg = 'Failed to load video.';
                if (err.data === 150 || err.data === 101) msg = 'This video cannot be played (Restricted).';
                if (err.data === 100) msg = 'Video not found or private.';
                setError(msg);
              },
              onStateChange: (event: any) => {
                if (event.data === window.YT.PlayerState.PLAYING) {
                  const interval = setInterval(() => {
                    if (playerRef.current?.getCurrentTime) {
                      const time = playerRef.current.getCurrentTime();
                      setCurrentTime(time);
                      onTimeUpdate?.(time);
                    }
                  }, 250);
                  
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
        } catch (e) {
          console.error("Player init failed:", e);
          setError("Failed to initialize player.");
          setIsReady(true);
        }
      }
    };

    if (window.YT?.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (playerRef.current?.destroy) {
        try {
          playerRef.current.destroy();
        } catch(e) { /* ignore */ }
      }
    };
  }, [videoId, onReady, onTimeUpdate]);

  useImperativeHandle(ref, () => ({
    seekTo: (seconds: number) => {
      if (playerRef.current?.seekTo) {
        playerRef.current.seekTo(seconds, true);
      }
    },
    getCurrentTime: () => currentTime,
    getDuration: () => duration,
  }));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-sketch border-2 border-ink bg-paper animate-in fade-in zoom-in duration-300">
      <div className="video-frame aspect-video relative">
        <iframe
          ref={iframeRef}
          src={embedUrl}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        
        {/* Loading overlay / Error display */}
        {(!isReady || error) && (
          <div className="absolute inset-0 flex items-center justify-center bg-paper z-20">
            <div className="text-center p-6">
              {error ? (
                <>
                  <div className="text-4xl mb-2">⚠️</div>
                  <p className="font-hand text-ink text-lg mb-4">{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-ink text-paper font-mono hover:opacity-90 transition-opacity"
                  >
                    Refresh App
                  </button>
                </>
              ) : (
                <>
                  <div className="animate-spin text-4xl mb-2">⟳</div>
                  <p className="font-hand text-ink">Loading video player...</p>
                </>
              )}
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

      {/* Playback Speed Controls */}
      <div className="mt-3 flex items-center justify-center gap-2">
        <span className="text-xs font-hand text-muted-foreground">Speed:</span>
        {[0.25, 0.5, 1, 2].map((speed) => (
          <button
            key={speed}
            onClick={() => {
              if (playerRef.current?.setPlaybackRate) {
                playerRef.current.setPlaybackRate(speed);
              }
            }}
            className="px-2 py-1 text-xs font-mono sketch-border bg-paper text-ink hover:shadow-sketch-sm hover:-translate-y-0.5 transition-all"
            style={{ transform: `rotate(${Math.random() * 2 - 1}deg)` }}
          >
            {speed}x
          </button>
        ))}
      </div>
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
