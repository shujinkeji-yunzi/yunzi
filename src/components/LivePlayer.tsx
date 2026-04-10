import React, { useEffect, useRef } from 'react';

export const LivePlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // In a real app, this would connect to a WebRTC or HLS stream
    // For demo, we'll just show a placeholder or try to access camera if it was a "start streaming" app
    // But since it's a "live app", we'll show a nice atmospheric background
  }, []);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
      <img 
        src="https://picsum.photos/seed/live/1280/720" 
        className="absolute inset-0 w-full h-full object-cover opacity-60 blur-sm"
        alt="Stream background"
        referrerPolicy="no-referrer"
      />
      
      <div className="relative z-10 text-white text-center">
        <div className="w-24 h-24 rounded-full border-4 border-pink-500 p-1 mx-auto mb-4 animate-pulse">
          <img 
            src="https://picsum.photos/seed/streamer/200/200" 
            className="w-full h-full rounded-full object-cover"
            alt="Streamer"
            referrerPolicy="no-referrer"
          />
        </div>
        <h2 className="text-2xl font-bold mb-2">Star Streamer ✨</h2>
        <div className="flex items-center justify-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
          <span className="text-sm font-medium uppercase tracking-wider">Live</span>
        </div>
      </div>

      {/* Overlay for "Live" feel */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
        <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
          LIVE
        </div>
        <div className="bg-black/40 backdrop-blur-md text-white text-xs px-2 py-1 rounded">
          00:42:15
        </div>
      </div>
    </div>
  );
};
