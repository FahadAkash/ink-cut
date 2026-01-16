import React from 'react';

interface SketchIconProps {
  type: 'play' | 'scissors' | 'download' | 'link' | 'frame-start' | 'frame-end' | 'video';
  className?: string;
  size?: number;
}

export const SketchIcon: React.FC<SketchIconProps> = ({ type, className = '', size = 24 }) => {
  const strokeWidth = 2;
  
  const icons: Record<string, React.ReactNode> = {
    play: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path
          d="M6 4 L6 20 L20 12 Z"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{ strokeDasharray: '60', strokeDashoffset: '0' }}
        />
        <path
          d="M5 5 Q6 4, 6 5"
          stroke="currentColor"
          strokeWidth={1}
          opacity={0.5}
        />
      </svg>
    ),
    scissors: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth={strokeWidth} fill="none" />
        <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth={strokeWidth} fill="none" />
        <path
          d="M8.5 8.5 L20 18 M8.5 15.5 L20 6"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <path d="M19 5.5 Q21 6, 20 7" stroke="currentColor" strokeWidth={1} opacity={0.5} />
      </svg>
    ),
    download: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path
          d="M12 3 L12 15 M12 15 L7 10 M12 15 L17 10"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 17 L4 20 Q4 21, 5 21 L19 21 Q20 21, 20 20 L20 17"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <path d="M3 20 Q4 22, 5 21" stroke="currentColor" strokeWidth={1} opacity={0.5} />
      </svg>
    ),
    link: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path
          d="M10 14 Q6 14, 6 10 Q6 6, 10 6 L14 6"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M14 10 Q18 10, 18 14 Q18 18, 14 18 L10 18"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />
        <path d="M5 9 Q5 5, 6 6" stroke="currentColor" strokeWidth={1} opacity={0.5} />
      </svg>
    ),
    'frame-start': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="3" y="3" width="18" height="18" rx="1" stroke="currentColor" strokeWidth={strokeWidth} fill="none" />
        <path d="M8 7 L8 17" stroke="currentColor" strokeWidth={strokeWidth + 1} strokeLinecap="round" />
        <path d="M12 12 L17 8 L17 16 Z" stroke="currentColor" strokeWidth={strokeWidth} fill="currentColor" />
        <path d="M2 4 Q3 2, 4 3" stroke="currentColor" strokeWidth={1} opacity={0.5} />
      </svg>
    ),
    'frame-end': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="3" y="3" width="18" height="18" rx="1" stroke="currentColor" strokeWidth={strokeWidth} fill="none" />
        <path d="M16 7 L16 17" stroke="currentColor" strokeWidth={strokeWidth + 1} strokeLinecap="round" />
        <path d="M12 12 L7 8 L7 16 Z" stroke="currentColor" strokeWidth={strokeWidth} fill="currentColor" />
        <path d="M20 4 Q22 3, 21 5" stroke="currentColor" strokeWidth={1} opacity={0.5} />
      </svg>
    ),
    video: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="2" y="4" width="15" height="16" rx="2" stroke="currentColor" strokeWidth={strokeWidth} fill="none" />
        <path d="M17 9 L22 6 L22 18 L17 15" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="9" cy="12" r="3" stroke="currentColor" strokeWidth={1.5} fill="none" opacity={0.5} />
        <path d="M1 5 Q2 3, 3 4" stroke="currentColor" strokeWidth={1} opacity={0.5} />
      </svg>
    ),
  };

  return <>{icons[type]}</>;
};

export default SketchIcon;
