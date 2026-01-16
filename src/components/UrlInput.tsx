import React from 'react';
import SketchIcon from './SketchIcon';

interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClipboardDownload?: () => void;
  isLoading?: boolean;
}

export const UrlInput: React.FC<UrlInputProps> = ({ value, onChange, onSubmit, onClipboardDownload, isLoading }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      onSubmit();
    }
  };

  const handleClipboardPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.includes('youtube.com') || text.includes('youtu.be')) {
        onChange(text);
        setTimeout(() => {
          if (onClipboardDownload) {
            onClipboardDownload();
          }
        }, 100);
      } else {
        alert('⚠️ No YouTube URL found in clipboard\n\nPlease copy a YouTube link first!');
      }
    } catch (error) {
      console.error('Clipboard error:', error);
      alert('❌ Cannot read clipboard\n\nPlease grant clipboard permissions or paste the URL manually.');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <label className="block mb-3 text-2xl font-sketch text-ink">
        Paste your YouTube link here ↓
      </label>
      <div className="relative flex gap-3">
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ink opacity-60">
            <SketchIcon type="link" size={20} />
          </div>
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://youtube.com/watch?v=..."
            className="ink-input pl-12"
            disabled={isLoading}
          />
        </div>
        <button
          onClick={onSubmit}
          disabled={!value.trim() || isLoading}
          className="sketch-button sketch-button-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="animate-spin">⟳</span>
          ) : (
            <>
              <SketchIcon type="video" size={20} />
              <span>Load</span>
            </>
          )}
        </button>
      </div>
      
      {/* Quick Download from Clipboard Button */}
      <div className="mt-4 text-center">
        <button
          onClick={handleClipboardPaste}
          disabled={isLoading}
          className="sketch-button bg-ink text-paper hover:shadow-sketch-hover hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 mx-auto"
          style={{ transform: 'rotate(-0.5deg)' }}
        >
          <div className="flex items-center gap-2">
            <SketchIcon type="download" size={20} />
            <span className="font-sketch text-base">📋 Quick Download from Clipboard</span>
          </div>
        </button>
        <p className="mt-2 text-xs text-muted-foreground font-hand">
          ✎ Copy a YouTube link, then click this button for instant download
        </p>
      </div>

      <p className="mt-4 text-sm text-muted-foreground font-hand">
        ✎ Supports YouTube, YouTube Shorts, and youtu.be links
      </p>
    </div>
  );
};

export default UrlInput;
