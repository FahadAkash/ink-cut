import React from 'react';
import SketchIcon from './SketchIcon';

interface InputTabsProps {
  activeTab: 'url' | 'search';
  onTabChange: (tab: 'url' | 'search') => void;
}

export const InputTabs: React.FC<InputTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex border-b-2 border-ink mb-6">
      <button
        onClick={() => onTabChange('url')}
        className={`
          flex items-center gap-2 px-6 py-3 font-hand text-lg
          border-2 border-b-0 border-ink -mb-0.5
          transition-all duration-200
          ${activeTab === 'url' 
            ? 'bg-paper text-ink border-b-paper z-10' 
            : 'bg-muted text-muted-foreground hover:bg-accent'
          }
        `}
        style={{ 
          transform: activeTab === 'url' ? 'rotate(-1deg)' : 'none',
          marginRight: '-2px'
        }}
      >
        <SketchIcon type="link" size={20} />
        Paste URL
      </button>
      <button
        onClick={() => onTabChange('search')}
        className={`
          flex items-center gap-2 px-6 py-3 font-hand text-lg
          border-2 border-b-0 border-ink -mb-0.5
          transition-all duration-200
          ${activeTab === 'search' 
            ? 'bg-paper text-ink border-b-paper z-10' 
            : 'bg-muted text-muted-foreground hover:bg-accent'
          }
        `}
        style={{ 
          transform: activeTab === 'search' ? 'rotate(1deg)' : 'none'
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
        </svg>
        Search YouTube
      </button>
    </div>
  );
};

export default InputTabs;
