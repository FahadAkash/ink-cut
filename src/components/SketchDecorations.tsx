import React from 'react';

export const SketchDecorations: React.FC = () => {
  return (
    <>
      {/* Top left corner decoration */}
      <svg
        className="absolute top-4 left-4 w-20 h-20 text-ink opacity-10 pointer-events-none"
        viewBox="0 0 80 80"
      >
        <path
          d="M5 40 Q5 5, 40 5"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M10 50 Q10 10, 50 10"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx="40" cy="5" r="3" fill="currentColor" />
      </svg>

      {/* Top right corner decoration */}
      <svg
        className="absolute top-4 right-4 w-20 h-20 text-ink opacity-10 pointer-events-none"
        viewBox="0 0 80 80"
      >
        <path
          d="M75 40 Q75 5, 40 5"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M70 50 Q70 10, 30 10"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx="40" cy="5" r="3" fill="currentColor" />
      </svg>

      {/* Bottom decorative line */}
      <svg
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-64 h-8 text-ink opacity-10 pointer-events-none"
        viewBox="0 0 256 32"
      >
        <path
          d="M0 16 Q64 0, 128 16 T256 16"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="128" cy="16" r="4" fill="currentColor" />
      </svg>

      {/* Scattered sketch marks */}
      <div className="absolute top-1/4 left-8 w-8 h-8 border-l-2 border-t-2 border-ink/10 pointer-events-none" />
      <div className="absolute top-1/3 right-12 w-6 h-6 border-2 border-ink/10 rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-16 w-4 h-4 bg-ink/5 rotate-45 pointer-events-none" />
      <div className="absolute bottom-1/3 right-20 w-3 h-8 border-r-2 border-ink/10 pointer-events-none" />
    </>
  );
};

export default SketchDecorations;
