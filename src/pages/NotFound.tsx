import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import SketchIcon from "@/components/SketchIcon";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden font-hand">
      <div className="text-center sketch-card relative z-10 p-12">
        <div className="flex justify-center mb-6">
          <SketchIcon type="scissors" size={80} className="text-ink animate-bounce" />
        </div>
        <h1 className="mb-4 text-6xl font-sketch text-ink">404</h1>
        <p className="mb-8 text-2xl text-muted-foreground italic">Oops! This segment doesn't exist.</p>
        <Link 
          to="/" 
          className="text-xl text-ink underline decoration-2 underline-offset-4 hover:opacity-70 transition-opacity"
        >
          ← Return to Cutting Room
        </Link>
      </div>
      
      {/* Decorative scribbles */}
      <div className="absolute top-10 right-10 opacity-20 transform rotate-12">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <path d="M10,50 Q25,25 40,50 T70,50" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
};

export default NotFound;
