import React, { useState, useCallback, useRef } from 'react';
import UrlInput from '@/components/UrlInput';
import VideoPlayer, { VideoPlayerHandle } from '@/components/VideoPlayer';
import FrameSelector from '@/components/FrameSelector';
import DownloadButton from '@/components/DownloadButton';
import StepIndicator from '@/components/StepIndicator';
import SketchDecorations from '@/components/SketchDecorations';
import SketchIcon from '@/components/SketchIcon';
import InputTabs from '@/components/InputTabs';
import VideoSearch from '@/components/VideoSearch';

const Index: React.FC = () => {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(180);
  const [startFrame, setStartFrame] = useState(0);
  const [endFrame, setEndFrame] = useState(60);
  const [activeTab, setActiveTab] = useState<'url' | 'search'>('search');
  
  const videoPlayerRef = useRef<VideoPlayerHandle>(null);

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/shorts\/([^&\n?#]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleSelectVideo = useCallback((id: string, title: string) => {
    setIsLoading(true);
    setVideoId(id);
    setVideoTitle(title);
    setStartFrame(0);
    setEndFrame(60);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const handleVideoReady = useCallback((videoDuration: number) => {
    setDuration(videoDuration);
    setEndFrame(Math.min(60, videoDuration));
  }, []);

  const handleSeekPreview = useCallback((time: number) => {
    videoPlayerRef.current?.seekTo(time);
  }, []);

  const handleLoadVideo = useCallback(() => {
    const id = extractVideoId(url);
    if (id) {
      setIsLoading(true);
      // Simulate loading
      setTimeout(() => {
        setVideoId(id);
        setVideoTitle('YouTube Video');
        setStartFrame(0);
        setEndFrame(60);
        setIsLoading(false);
      }, 1500);
    } else {
      alert('Please enter a valid YouTube URL');
    }
  }, [url]);

  const steps = [
    { number: 1, label: 'Paste Link', isActive: !videoId, isComplete: !!videoId },
    { number: 2, label: 'Preview Video', isActive: !!videoId && startFrame === 0 && endFrame === 60, isComplete: !!videoId && (startFrame !== 0 || endFrame !== 60) },
    { number: 3, label: 'Select Frames', isActive: !!videoId && (startFrame !== 0 || endFrame !== 60), isComplete: false },
    { number: 4, label: 'Download', isActive: false, isComplete: false },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <SketchDecorations />
      
      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <SketchIcon type="scissors" size={48} className="text-ink animate-wobble" />
            <h1 className="text-5xl md:text-7xl font-sketch text-ink tracking-tight">
              <span className="sketch-underline">ClipCraft</span>
            </h1>
          </div>
          <p className="text-xl md:text-2xl font-hand text-muted-foreground max-w-lg mx-auto">
            ✂️ Snip the perfect moment from any YouTube video
          </p>
          
          {/* Decorative ink splat */}
          <div className="mt-4 flex justify-center">
            <svg width="100" height="20" viewBox="0 0 100 20" className="text-ink opacity-20">
              <path d="M0 10 Q25 0, 50 10 T100 10" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </header>

        {/* Step Indicator */}
        <div className="mb-10">
          <StepIndicator steps={steps} />
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Input Section with Tabs */}
          <section className="sketch-card" style={{ transform: 'rotate(-0.3deg)' }}>
            <InputTabs activeTab={activeTab} onTabChange={setActiveTab} />
            
            {activeTab === 'url' ? (
              <UrlInput
                value={url}
                onChange={setUrl}
                onSubmit={handleLoadVideo}
                onClipboardDownload={handleLoadVideo}
                isLoading={isLoading}
              />
            ) : (
              <VideoSearch onSelectVideo={handleSelectVideo} />
            )}
          </section>

          {/* Video Player */}
          {videoId && (
            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Selected video title */}
              {videoTitle && (
                <div className="text-center">
                  <h2 className="text-2xl font-sketch text-ink">
                    ✂️ Now editing: <span className="sketch-underline">{videoTitle}</span>
                  </h2>
                </div>
              )}
              
              <VideoPlayer
                ref={videoPlayerRef}
                videoId={videoId}
                onReady={handleVideoReady}
              />

              {/* Frame Selector */}
              <FrameSelector
                duration={duration}
                startFrame={startFrame}
                endFrame={endFrame}
                onStartChange={setStartFrame}
                onEndChange={setEndFrame}
                onSeekPreview={handleSeekPreview}
                videoId={videoId}
              />

              {/* Download Button */}
              <div className="py-6">
                <DownloadButton
                  startTime={startFrame}
                  endTime={endFrame}
                  videoId={videoId}
                  disabled={!videoId}
                />
              </div>
            </section>
          )}

          {/* Empty State */}
          {!videoId && (
            <div className="text-center py-16 opacity-50">
              <div className="inline-block p-8 border-2 border-dashed border-ink/30 rounded-lg">
                <SketchIcon type="video" size={64} className="mx-auto mb-4 text-ink/40" />
                <p className="font-hand text-xl text-muted-foreground">
                  Your video preview will appear here
                </p>
                <p className="font-hand text-sm text-muted-foreground mt-2">
                  ↑ Paste a YouTube link above to get started
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="ink-line w-48 mx-auto mb-6" />
          <p className="font-hand text-muted-foreground">
            Made with ✏️ & ☕ — Sketch your perfect clip
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
