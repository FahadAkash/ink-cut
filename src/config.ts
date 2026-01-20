/**
 * API Configuration
 * 
 * - In Electron (Desktop App): Always use localhost (the app starts its own server)
 * - In Web Browser Production: Use Render.com
 * - In Web Browser Development: Use localhost
 */

const isElectron = !!(window as any).electron;

const API_CONFIG = {
    BASE_URL: isElectron
        ? 'http://localhost:3001'  // Electron always uses local server
        : import.meta.env.PROD
            ? 'https://ink-cut.onrender.com'  // Web production uses Render
            : 'http://localhost:3001',  // Web dev uses local server
};

export default API_CONFIG;
