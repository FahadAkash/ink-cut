import React from 'react';
import SketchIcon from './SketchIcon';

interface FrameSelectorProps {
  duration: number;
  startFrame: number;
  endFrame: number;
  onStartChange: (value: number) => void;
  onEndChange: (value: number) => void;
}

export const FrameSelector: React.FC<FrameSelectorProps> = ({
  duration,
  startFrame,
  endFrame,
  onStartChange,
  onEndChange,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const selectedDuration = endFrame - startFrame;
  const percentage = duration > 0 ? ((endFrame - startFrame) / duration) * 100 : 0;

  return (
    <div className="sketch-card">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <SketchIcon type="scissors" size={28} />
        <h3 className="text-3xl font-sketch text-ink">Select Your Clip</h3>
      </div>

      {/* Timeline visualization */}
      <div className="relative mb-8 px-2">
        <div className="h-12 bg-muted border-2 border-ink relative overflow-hidden">
          {/* Selected range indicator */}
          <div
            className="absolute top-0 bottom-0 bg-ink opacity-20"
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
            className="absolute top-0 bottom-0 w-1 bg-ink"
            style={{ left: `${(startFrame / duration) * 100}%` }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono whitespace-nowrap">
              START
            </div>
          </div>
          
          {/* End marker */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-ink"
            style={{ left: `${(endFrame / duration) * 100}%` }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono whitespace-nowrap">
              END
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
              <span className="font-hand text-lg">Start Frame</span>
            </div>
            <span className="font-mono text-sm bg-muted px-3 py-1 border border-ink">
              {formatTime(startFrame)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={duration}
            step={0.1}
            value={startFrame}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (value < endFrame - 1) {
                onStartChange(value);
              }
            }}
            className="sketch-slider"
          />
        </div>

        {/* End Frame Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SketchIcon type="frame-end" size={22} />
              <span className="font-hand text-lg">End Frame</span>
            </div>
            <span className="font-mono text-sm bg-muted px-3 py-1 border border-ink">
              {formatTime(endFrame)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={duration}
            step={0.1}
            value={endFrame}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (value > startFrame + 1) {
                onEndChange(value);
              }
            }}
            className="sketch-slider"
          />
        </div>
      </div>

      {/* Selection info */}
      <div className="mt-6 pt-4 border-t-2 border-dashed border-ink/30">
        <div className="flex items-center justify-between text-ink">
          <span className="font-hand text-lg">Selected duration:</span>
          <span className="font-mono text-xl font-bold">
            {formatTime(selectedDuration)}
          </span>
        </div>
        <div className="mt-1 h-2 bg-muted border border-ink overflow-hidden">
          <div
            className="h-full bg-ink transition-all duration-200"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default FrameSelector;
