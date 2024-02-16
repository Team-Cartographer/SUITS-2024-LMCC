/**
 * @author @abhi-arya1
 * @function EVALiveView
 * @fileoverview While this document isn't specifically for rover live view, it is essentially the same with different Border Radii:
 * https://docs.google.com/document/d/1wiDTSK4uR1we2z8LcobuU8MG8j1gtWkV8PsYyITrCy4/
 */

import React from 'react';
import ReactPlayer from 'react-player';
import YouTube, { Options } from 'react-youtube';

interface UnifiedLiveViewProps {
  url: string; // The URL for the live stream, can be a general URL or a YouTube URL
  volume?: number; // Optional volume parameter for the ReactPlayer component
}

const UnifiedLiveView: React.FC<UnifiedLiveViewProps> = ({ url, volume = 0.5 }) => {
  // Function to determine if the URL is a YouTube URL
  const isYouTubeUrl = (url: string) => {
    return url.match(/youtube\.com|youtu\.be/) !== null;
  };

  // Function to get video ID from YouTube URL
  const getVideoId = (url: string): string => {
    const match = url.match(/[?&]v=([^?&]+)/);
    return match ? match[1] : '';
  };

  // Style object for the player's container
  const playerStyle = {
    border: '2px solid #3498db',
    borderRadius: '12px',
    overflow: 'hidden',
    textAlign: 'center',
  };

  // YouTube player options
  const opts: Options = {
    height: '100%', // Media player height
    width: '100%', // Media player width
    playerVars: {
      autoplay: 1,
    },
  };

  // Render the appropriate player based on the URL type
  if (isYouTubeUrl(url)) {
    const videoId = getVideoId(url);
    if (!videoId) {
      console.error('Invalid YouTube URL');
      return null; // Or display an appropriate error message
    }

    return (
      <div className="h-screen flex flex-row items-center justify-center">
        <div style={playerStyle}>
          <YouTube videoId={videoId} opts={opts} />
        </div>
        <div className="text-white text-lg ml-4 text-center">
          <p>Rover live stream.</p>
          <p>- Work in progress by Isaiah Ramos/Jesus Reyes</p>
        </div>
      </div>
    );
  } else {
    // For non-YouTube URLs, use ReactPlayer
    return (
      <div style={playerStyle}>
        <ReactPlayer url={url} playing volume={volume} style={playerStyle} />
      </div>
    );
  }
};

export default UnifiedLiveView;
