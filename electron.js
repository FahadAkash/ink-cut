import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { spawn } = require('child_process');
const isDev = !app.isPackaged;

let mainWindow;
let backendProcess;

// Handle folder selection
ipcMain.handle('dialog:selectFolder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return result.filePaths[0];
});

// Start the Express backend server
function startBackend() {
  // In production, the server is located in the resources folder
  const serverPath = isDev
    ? path.join(__dirname, 'server', 'index.js')
    : path.join(process.resourcesPath, 'server', 'index.js');

  console.log('Starting backend at:', serverPath);

  // Use the Electron executable to run the node script in production
  // This ensures it works even if the user doesn't have Node.js installed
  const executable = isDev ? 'node' : process.execPath;
  const args = isDev ? [serverPath] : [serverPath];
  
  const env = { 
    ...process.env, 
    PORT: '3001',
    NODE_PATH: isDev ? undefined : path.join(process.resourcesPath, 'server', 'node_modules')
  };

  if (!isDev) {
    env.ELECTRON_RUN_AS_NODE = '1';
  }

  console.log('Spawning backend with:', executable, args[0]);

  backendProcess = spawn(executable, args, {
    env,
    stdio: 'inherit'
  });

  backendProcess.on('error', (err) => {
    console.error('Failed to start backend process:', err);
  });

  backendProcess.on('exit', (code) => {
    console.log(`Backend process exited with code ${code}`);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'src', 'preload.js')
    },
    icon: path.join(__dirname, 'public', 'favicon.ico'),
    title: 'InkCut - YouTube Video Clip Downloader',
    backgroundColor: '#FDFCF8',
    show: false,
    autoHideMenuBar: false // Show menu bar for debugging
  });

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Load the app
  if (isDev) {
    // Development: Load from Vite dev server
    mainWindow.loadURL('http://localhost:8080');
    mainWindow.webContents.openDevTools();
  } else {
    // Production: Load from the local backend server (which serves the built files)
    // This solves YouTube CORS/Origin issues by serving everything from http://localhost:3001
    const loadApp = () => {
      mainWindow.loadURL('http://localhost:3001').catch(e => {
        console.log('Waiting for backend server...');
        setTimeout(loadApp, 500);
      });
    };
    loadApp();
    
    // DEBUG: Open DevTools in production to troubleshoot white screen
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // Fix: Spoof Referer to allow YouTube embeds on file:// protocol
  const { session } = require('electron');
  session.defaultSession.webRequest.onBeforeSendHeaders(
    { urls: ['*://*.youtube.com/*', '*://*.ytimg.com/*'] },
    (details, callback) => {
      details.requestHeaders['Referer'] = 'https://www.youtube.com/';
      callback({ cancel: false, requestHeaders: details.requestHeaders });
    }
  );

  // Start backend server
  startBackend();
  
  // Wait a bit for backend to start, then create window
  setTimeout(() => {
    createWindow();
  }, 2000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});
