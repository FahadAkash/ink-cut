import React, { useState } from 'react';
import SketchIcon from './SketchIcon';
import API_CONFIG from '../config';

declare global {
  interface Window {
    electron?: {
      selectFolder: () => Promise<string>;
      getFilePath: (file: File) => string;
      platform: string;
    };
  }
}

interface VideoConverterProps {
  onConvertStart?: () => void;
}

interface FileStatus {
  file: File;
  status: 'pending' | 'converting' | 'completed' | 'error';
  message?: string;
}

export const VideoConverter: React.FC<VideoConverterProps> = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FileStatus[]>([]);
  const [outputDir, setOutputDir] = useState(localStorage.getItem('inkcut_output_dir') || 'C:\\Users\\Public\\Downloads');
  const [format, setFormat] = useState('mp4');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files)
        .filter(f => f.type.startsWith('video/'))
        .map(f => ({ file: f, status: 'pending' } as FileStatus));
      
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
        .map(f => ({ file: f, status: 'pending' } as FileStatus));
      
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const selectOutputFolder = async () => {
    if (window.electron) {
      // Desktop: Use Electron's native folder picker
      const path = await window.electron.selectFolder();
      if (path) {
        setOutputDir(path);
        localStorage.setItem('inkcut_output_dir', path);
      }
    } else {
      // Web: Use File System Access API
      try {
        // @ts-ignore - showDirectoryPicker may not be in all TS definitions yet
        const dirHandle = await window.showDirectoryPicker();
        // On web, we can't get the full path for security, but we show the folder name
        setOutputDir(dirHandle.name);
        localStorage.setItem('inkcut_output_dir', dirHandle.name);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Folder select error:', err);
          alert('⚠️ Folder selection is not supported in this browser.\n\nNote: On the web, downloads will use your browser\'s default download folder for security reasons.');
        }
      }
    }
  };

  const processQueue = async () => {
    setIsProcessing(true);
    
    if (!window.electron) {
      alert('⚠️ Video conversion is only available in the Desktop App.\nOn the web, we cannot access your local file paths for security reasons.');
      setIsProcessing(false);
      return;
    }

    // Process files with max concurrency of 3
    const CONCURRENCY = 3;
    const queue = files.filter(f => f.status === 'pending');
    
    for (let i = 0; i < queue.length; i += CONCURRENCY) {
      const batch = queue.slice(i, i + CONCURRENCY);
      
      await Promise.all(batch.map(async (item) => {
        // Update status to converting
        setFiles(prev => prev.map(f => f.file === item.file ? { ...f, status: 'converting' } : f));

        try {
          // Use the secure Electron bridge to get the local file path
          const inputPath = window.electron?.getFilePath 
            ? window.electron.getFilePath(item.file)
            : (item.file as any).path;

          if (!inputPath) throw new Error('No file path found');

          const response = await fetch(`${API_CONFIG.BASE_URL}/api/convert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ inputPath, outputDir, format })
          });

          if (!response.ok) throw new Error('Conversion failed');

          const data = await response.json();
          
          setFiles(prev => prev.map(f => f.file === item.file ? { 
            ...f, 
            status: 'completed', 
            message: data.outputPath 
          } : f));

        } catch (error) {
          console.error(error);
          setFiles(prev => prev.map(f => f.file === item.file ? { 
            ...f, 
            status: 'error', 
            message: error.message 
          } : f));
        }
      }));
    }

    setIsProcessing(false);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 h-[calc(100vh-120px)] flex flex-col">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-sketch text-ink mb-2">Batch Video Converter</h2>
        <p className="font-hand text-muted-foreground">Queue multiple files • Parallel Processing</p>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Left Side: Drop Zone & Files */}
        <div className="flex-1 flex flex-col gap-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative border-4 border-dashed rounded-lg p-8 text-center transition-all duration-300
              ${isDragging ? 'border-ink bg-ink/5 scale-102' : 'border-ink/30 hover:border-ink/60 bg-paper'}
            `}
          >
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-2 pointer-events-none">
              <SketchIcon type="video" size={32} />
              <h3 className="text-lg font-sketch text-ink">Drop Videos Here</h3>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2 sketch-scroll">
            {files.map((fileStatus, idx) => (
              <div key={idx} className="sketch-card p-3 flex items-center gap-3 animate-in slide-in-from-left-2">
                <div className="p-2 bg-muted rounded">
                  <SketchIcon type="video" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sketch truncate text-sm">{fileStatus.file.name}</p>
                  <p className="text-xs font-hand text-muted-foreground">
                    {fileStatus.status === 'completed' ? '✅ Done' :
                     fileStatus.status === 'converting' ? '⟳ Converting...' :
                     fileStatus.status === 'error' ? '❌ Failed' :
                     `${(fileStatus.file.size / (1024 * 1024)).toFixed(1)} MB`}
                  </p>
                </div>
                {fileStatus.status === 'pending' && (
                  <button onClick={() => removeFile(idx)} className="text-muted-foreground hover:text-red-500">
                    ✕
                  </button>
                )}
              </div>
            ))}
            {files.length === 0 && (
              <div className="text-center text-muted-foreground font-hand mt-10">
                No files in queue
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Controls */}
        <div className="w-80 flex flex-col gap-6">
          <div className="sketch-card p-5 space-y-4">
            <div>
              <label className="block text-lg font-sketch text-ink mb-3">Target Format:</label>
              <div className="grid grid-cols-3 gap-2">
                {['mp4', 'webm', 'avi', 'mkv', 'mp3', 'gif'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`
                      py-2 text-sm font-hand sketch-border transition-all
                      ${format === f ? 'bg-ink text-paper' : 'bg-paper text-ink hover:shadow-sketch-sm'}
                    `}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-lg font-sketch text-ink mb-2">Output Folder:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={outputDir}
                  readOnly
                  className="ink-input flex-1 text-xs truncate"
                />
                <button
                  onClick={selectOutputFolder}
                  className="px-3 bg-muted hover:bg-ink/10 rounded border border-ink/20"
                  title="Browse Folder"
                >
                  📂
                </button>
              </div>
            </div>

            <button
              onClick={processQueue}
              disabled={isProcessing || !files.some(f => f.status === 'pending')}
              className={`
                w-full py-3 text-xl font-sketch text-paper bg-ink sketch-border
                transition-all shadow-sketch hover:shadow-none hover:translate-x-1 hover:translate-y-1
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {isProcessing ? (
                <div className="flex flex-col items-center">
                  <span className="text-lg">Processing...</span>
                  <span className="text-xs font-hand opacity-80">
                    {files.filter(f => f.status === 'completed').length} of {files.length} Completed
                  </span>
                </div>
              ) : (
                `Convert ${files.filter(f => f.status === 'pending').length} Files`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
