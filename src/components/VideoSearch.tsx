import React, { useState } from 'react';
import SketchIcon from './SketchIcon';

interface VideoResult {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
  duration: string;
}

interface VideoSearchProps {
  onSelectVideo: (videoId: string, title: string) => void;
}

// Demo results for UI showcase
const DEMO_RESULTS: VideoResult[] = [
  { id: 'dQw4w9WgXcQ', title: 'Rick Astley - Never Gonna Give You Up', thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg', channel: 'Rick Astley', duration: '3:33' },
  { id: 'jNQXAC9IVRw', title: 'Me at the zoo', thumbnail: 'https://i.ytimg.com/vi/jNQXAC9IVRw/mqdefault.jpg', channel: 'jawed', duration: '0:18' },
  { id: '9bZkp7q19f0', title: 'PSY - GANGNAM STYLE', thumbnail: 'https://i.ytimg.com/vi/9bZkp7q19f0/mqdefault.jpg', channel: 'officialpsy', duration: '4:13' },
  { id: 'kJQP7kiw5Fk', title: 'Luis Fonsi - Despacito ft. Daddy Yankee', thumbnail: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/mqdefault.jpg', channel: 'Luis Fonsi', duration: '4:42' },
  { id: 'JGwWNGJdvx8', title: 'Ed Sheeran - Shape of You', thumbnail: 'https://i.ytimg.com/vi/JGwWNGJdvx8/mqdefault.jpg', channel: 'Ed Sheeran', duration: '4:24' },
  { id: 'RgKAFK5djSk', title: 'Wiz Khalifa - See You Again ft. Charlie Puth', thumbnail: 'https://i.ytimg.com/vi/RgKAFK5djSk/mqdefault.jpg', channel: 'Wiz Khalifa', duration: '3:58' },
];

export const VideoSearch: React.FC<VideoSearchProps> = ({ onSelectVideo }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<VideoResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    
    // Simulate search - in production, this would call YouTube API
    setTimeout(() => {
      // Filter demo results based on query for realistic feel
      const filtered = DEMO_RESULTS.filter(v => 
        v.title.toLowerCase().includes(query.toLowerCase()) ||
        v.channel.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered.length > 0 ? filtered : DEMO_RESULTS.slice(0, 4));
      setIsSearching(false);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="w-full">
      {/* Search Input */}
      <label className="block mb-3 text-2xl font-sketch text-ink">
        Search YouTube videos 🔍
      </label>
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for videos..."
            className="ink-input"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={!query.trim() || isSearching}
          className="sketch-button sketch-button-primary flex items-center gap-2 disabled:opacity-50"
        >
          {isSearching ? (
            <span className="animate-spin">⟳</span>
          ) : (
            <span>Search</span>
          )}
        </button>
      </div>

      {/* Results Grid */}
      {isSearching && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin text-4xl mb-4">⟳</div>
          <p className="font-hand text-lg text-muted-foreground">Searching videos...</p>
        </div>
      )}

      {!isSearching && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {results.map((video) => (
            <button
              key={video.id}
              onClick={() => onSelectVideo(video.id, video.title)}
              className="group text-left sketch-border p-3 bg-paper hover:shadow-sketch-hover hover:-translate-y-1 transition-all duration-200"
            >
              <div className="relative aspect-video mb-3 overflow-hidden border-2 border-ink">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-2 right-2 bg-ink text-paper px-2 py-0.5 text-sm font-mono">
                  {video.duration}
                </div>
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-ink/20">
                  <div className="w-14 h-14 rounded-full bg-paper border-2 border-ink flex items-center justify-center shadow-sketch">
                    <SketchIcon type="play" size={24} />
                  </div>
                </div>
              </div>
              <h4 className="font-hand text-lg text-ink line-clamp-2 group-hover:underline">
                {video.title}
              </h4>
              <p className="font-hand text-sm text-muted-foreground mt-1">
                ✎ {video.channel}
              </p>
            </button>
          ))}
        </div>
      )}

      {!isSearching && hasSearched && results.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-ink/30">
          <p className="font-hand text-xl text-muted-foreground">No videos found</p>
          <p className="font-hand text-sm text-muted-foreground mt-2">Try a different search term</p>
        </div>
      )}

      {!hasSearched && (
        <div className="text-center py-8 opacity-60">
          <p className="font-hand text-lg text-muted-foreground">
            ↑ Type something and hit search to find videos
          </p>
        </div>
      )}

      {/* API Note */}
      <p className="mt-4 text-xs text-muted-foreground font-hand text-center">
        ✎ Demo mode: Shows sample videos. Connect YouTube API for full search.
      </p>
    </div>
  );
};

export default VideoSearch;
