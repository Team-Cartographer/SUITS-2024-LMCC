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
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div className="h-screen flex flex-row gap-x-4 items-center justify-center">
      {/* Embed the YouTube video player */}
      <YouTube videoId={videoId} opts={opts} />
    </div>
  );
};

// React Server Component
function TelemetryPage() {
  // TODO: Finish the second page

  return <ClientTelemetryPage />;
}

export default TelemetryPage;
