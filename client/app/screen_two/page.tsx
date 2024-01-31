// ./app/screen_two/page.tsx
'use client';

import React from 'react';
import YouTube, { Options } from 'react-youtube';

// Traditional React component with client-specific features
const ClientTelemetryPage: React.FC = () => {
  const liveStreamURL = 'https://www.youtube.com/watch?v=NfcLKjFB59o'; // Replace with your YouTube video URL

  // Function to get video ID from YouTube URL
  const getVideoId = (url: string): string => {
    const match = url.match(/[?&]v=([^?&]+)/);
    return match ? match[1] : '';
  };

  const videoId = getVideoId(liveStreamURL);

  if (!videoId) {
    console.error('Invalid YouTube URL');
    return null;
  }

  const opts: Options = {
    height: '100%', // Reverted back to the previous height
    width: '100%', // Reverted back to the previous width
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div className="h-screen flex flex-row items-center justify-center">
      {/* Stylish border around the YouTube video player */}
      <div style={{ border: '2px solid #3498db', borderRadius: '10px', overflow: 'hidden', textAlign: 'center' }}>
        {/* Embed the YouTube video player */}
        <YouTube videoId={videoId} opts={opts} />
      </div>

      {/* Additional text with styling */}
      <div className="text-white text-lg ml-4 text-center">
        <p>Rover live stream.</p>
        <p>- Work in progress by Isaiah Ramos</p>
      </div>
    </div>
  );
};

// React Server Component
function TelemetryPage() {
  // TODO: Finish the second page

  return <ClientTelemetryPage />;
}

export default TelemetryPage;
