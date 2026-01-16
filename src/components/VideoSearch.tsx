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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageTokens, setPageTokens] = useState<{[key: number]: string}>({});
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [prevPageToken, setPrevPageToken] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(5); // Show up to 5 pages

  const handleSearch = async (pageToken?: string, page: number = 1) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      let url = `http://localhost:3001/api/search?q=${encodeURIComponent(query)}&maxResults=12`;
      if (pageToken) {
        url += `&pageToken=${pageToken}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const error = await response.json();
        if (response.status === 503) {
          // API key not configured - show demo results with message
          setResults(DEMO_RESULTS.slice(0, 12));
          setCurrentPage(1);
          setNextPageToken(null);
          setPrevPageToken(null);
          setTimeout(() => {
            alert('⚠️ YouTube API not configured\n\nShowing demo results. To enable real search:\n1. Get a YouTube Data API key from Google Cloud Console\n2. Add it to server/.env file\n3. Restart the backend server');
          }, 500);
        } else {
          throw new Error(error.error || 'Search failed');
        }
      } else {
        const data = await response.json();
        setResults(data.results || []);
        setNextPageToken(data.nextPageToken || null);
        setPrevPageToken(data.prevPageToken || null);
        setCurrentPage(page);
        
        // Store page tokens for direct page navigation
        if (data.nextPageToken) {
          setPageTokens(prev => ({...prev, [page + 1]: data.nextPageToken}));
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to demo results on error
      setResults(DEMO_RESULTS.slice(0, 12));
      setCurrentPage(1);
      setNextPageToken(null);
      setPrevPageToken(null);
      alert(`⚠️ Search failed: ${error.message}\n\nShowing demo results instead.\n\nMake sure the backend server is running:\ncd server && npm start`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setCurrentPage(1);
      setPageTokens({});
      handleSearch(undefined, 1);
    }
  };

  const handlePreviousPage = () => {
    if (prevPageToken && currentPage > 1) {
      handleSearch(prevPageToken, currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (nextPageToken) {
      handleSearch(nextPageToken, currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    if (page === currentPage) return;
    
    if (page < currentPage) {
      // Going backwards
      handlePreviousPage();
    } else if (page === currentPage + 1) {
      // Going to next page
      handleNextPage();
    } else {
      // For other pages, use stored token or search from beginning
      const token = pageTokens[page];
      if (token) {
        handleSearch(token, page);
      }
    }
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
          onClick={() => {
            setCurrentPage(1);
            setPageTokens({});
            handleSearch(undefined, 1);
          }}
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

      {/* Pagination Controls */}
      {!isSearching && results.length > 0 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {/* Previous Button */}
          <button
            onClick={handlePreviousPage}
            disabled={!prevPageToken || currentPage === 1}
            className="sketch-button px-4 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          {/* Page Numbers */}
          <div className="flex gap-2">
            {[...Array(Math.min(totalPages, 5))].map((_, idx) => {
              const pageNum = idx + 1;
              const isActive = pageNum === currentPage;
              const isAccessible = pageNum <= currentPage || pageTokens[pageNum];
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageClick(pageNum)}
                  disabled={!isAccessible && pageNum !== currentPage + 1}
                  className={`
                    w-10 h-10 sketch-border font-sketch text-lg
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-ink text-paper border-ink shadow-sketch' 
                      : 'bg-paper text-ink hover:shadow-sketch-sm hover:-translate-y-0.5'
                    }
                    disabled:opacity-30 disabled:cursor-not-allowed
                  `}
                  style={{
                    transform: isActive ? 'rotate(-1deg)' : 'rotate(0.5deg)'
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNextPage}
            disabled={!nextPageToken}
            className="sketch-button px-4 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next →
          </button>
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
        ✎ Connected to backend API. Configure YOUTUBE_API_KEY in server/.env for full search.
      </p>
    </div>
  );
};

export default VideoSearch;
