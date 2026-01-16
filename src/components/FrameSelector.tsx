import React, { useCallback } from 'react';
import SketchIcon from './SketchIcon';

interface FrameSelectorProps {
  duration: number;
  startFrame: number;
  endFrame: number;
  onStartChange: (value: number) => void;
  onEndChange: (value: number) => void;
  onSeekPreview?: (time: number) => void;
  videoId?: string;
}

export const FrameSelector: React.FC<FrameSelectorProps> = ({
  duration,
  startFrame,
  endFrame,
  onStartChange,
  onEndChange,
  onSeekPreview,
  videoId,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const selectedDuration = endFrame - startFrame;
  const percentage = duration > 0 ? ((endFrame - startFrame) / duration) * 100 : 0;

  // Generate thumbnail URL for a specific time
  const getThumbnailUrl = (time: number) => {
    if (!videoId) return '';
    // YouTube provides thumbnails at specific intervals
    // We'll show the video thumbnail as a reference
    return `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
  };

  const handleStartChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (value < endFrame - 1) {
      onStartChange(value);
      onSeekPreview?.(value);
    }
  }, [endFrame, onStartChange, onSeekPreview]);

  const handleEndChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (value > startFrame + 1) {
      onEndChange(value);
      onSeekPreview?.(value);
    }
  }, [startFrame, onEndChange, onSeekPreview]);

  const handleStartClick = () => {
    onSeekPreview?.(startFrame);
  };

  const handleEndClick = () => {
    onSeekPreview?.(endFrame);
  };

  return (
    <div className="sketch-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <SketchIcon type="scissors" size={28} />
          <h3 className="text-3xl font-sketch text-ink">Select Your Clip</h3>
        </div>
        <div className="text-sm font-hand text-muted-foreground bg-muted px-3 py-1 border border-ink/30">
          ✎ Drag sliders to preview frames
        </div>
      </div>

      {/* Preview thumbnails */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleStartClick}
          className="flex-1 group relative border-2 border-ink p-2 bg-paper hover:shadow-sketch transition-all"
        >
          <div className="text-xs font-mono text-center mb-1 text-ink">START FRAME</div>
          <div className="aspect-video bg-muted border border-ink overflow-hidden relative">
            {videoId && (
              <img 
                src={getThumbnailUrl(startFrame)} 
                alt="Start frame"
                className="w-full h-full object-cover opacity-60"
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-lg font-bold bg-ink text-paper px-2 py-1">
                {formatTime(startFrame)}
              </span>
            </div>
          </div>
          <div className="text-xs font-hand text-center mt-1 text-muted-foreground group-hover:text-ink">
            Click to preview →
          </div>
        </button>
        
        <div className="flex flex-col items-center justify-center px-4">
          <SketchIcon type="scissors" size={32} className="text-ink/40" />
          <span className="font-sketch text-2xl text-ink mt-1">{formatTime(selectedDuration)}</span>
          <span className="font-hand text-xs text-muted-foreground">duration</span>
        </div>
        
        <button
          onClick={handleEndClick}
          className="flex-1 group relative border-2 border-ink p-2 bg-paper hover:shadow-sketch transition-all"
        >
          <div className="text-xs font-mono text-center mb-1 text-ink">END FRAME</div>
          <div className="aspect-video bg-muted border border-ink overflow-hidden relative">
            {videoId && (
              <img 
                src={getThumbnailUrl(endFrame)} 
                alt="End frame"
                className="w-full h-full object-cover opacity-60"
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-lg font-bold bg-ink text-paper px-2 py-1">
                {formatTime(endFrame)}
              </span>
            </div>
          </div>
          <div className="text-xs font-hand text-center mt-1 text-muted-foreground group-hover:text-ink">
            Click to preview →
          </div>
        </button>
      </div>

      {/* Timeline visualization */}
      <div className="relative mb-8 px-2">
        <div className="h-12 bg-muted border-2 border-ink relative overflow-hidden">
          {/* Selected range indicator */}
          <div
            className="absolute top-0 bottom-0 bg-ink opacity-20 transition-all duration-100"
            style={{
              left: `${(startFrame / duration) * 100}%`,
              width: `${percentage}%`,
            }}
          />
          
          {/* Frame markers */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-px bg-ink opacity-10"
              style={{ left: `${(i + 1) * 10}%` }}
            />
          ))}
          
          {/* Start marker */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-ink transition-all duration-100"
            style={{ left: `${(startFrame / duration) * 100}%` }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono whitespace-nowrap bg-ink text-paper px-1">
              IN
            </div>
          </div>
          
          {/* End marker */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-ink transition-all duration-100"
            style={{ left: `${(endFrame / duration) * 100}%` }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono whitespace-nowrap bg-ink text-paper px-1">
              OUT
            </div>
          </div>
        </div>
        
        {/* Decorative film strip holes */}
        <div className="absolute -left-1 top-0 bottom-0 flex flex-col justify-around">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="w-2 h-2 border border-ink rounded-sm" />
          ))}
        </div>
        <div className="absolute -right-1 top-0 bottom-0 flex flex-col justify-around">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="w-2 h-2 border border-ink rounded-sm" />
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-6">
        {/* Start Frame Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SketchIcon type="frame-start" size={22} />
              <span className="font-hand text-lg">Start Frame (IN point)</span>
            </div>
            <span className="font-mono text-sm bg-ink text-paper px-3 py-1">
              {formatTime(startFrame)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={duration}
            step={0.1}
            value={startFrame}
            onChange={handleStartChange}
            className="sketch-slider"
          />
        </div>

        {/* End Frame Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SketchIcon type="frame-end" size={22} />
              <span className="font-hand text-lg">End Frame (OUT point)</span>
            </div>
            <span className="font-mono text-sm bg-ink text-paper px-3 py-1">
              {formatTime(endFrame)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={duration}
            step={0.1}
            value={endFrame}
            onChange={handleEndChange}
            className="sketch-slider"
          />
        </div>
      </div>

      {/* Selection info */}
      <div className="mt-6 pt-4 border-t-2 border-dashed border-ink/30">
        <div className="flex items-center justify-between text-ink">
          <span className="font-hand text-lg">✂️ Clip duration:</span>
          <span className="font-mono text-xl font-bold">
            {formatTime(selectedDuration)}
          </span>
        </div>
        <div className="mt-2 h-3 bg-muted border-2 border-ink overflow-hidden">
          <div
            className="h-full bg-ink transition-all duration-200"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs font-mono text-muted-foreground mt-1">
          <span>0%</span>
          <span>{percentage.toFixed(1)}% of video</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};

export default FrameSelector;
