/**
 * @author @abhi-arya1
 * @function EVALiveView
 * @fileoverview While this document isn't specifically for rover live view, it is essentially the same with different Border Radii:
 * https://docs.google.com/document/d/1wiDTSK4uR1we2z8LcobuU8MG8j1gtWkV8PsYyITrCy4/
 */

// ./components/rover/rover_live_view.tsx
import React from 'react';
import ReactPlayer from 'react-player';

interface MediaPlayerProps {
  url: string;
  volume?: number;
}

const playerStyle: React.CSSProperties = {
  border: '2px solid #3498db',
  borderRadius: '10px',
  overflow: 'hidden',
  textAlign: 'center',
};

const MediaPlayer: React.FC<MediaPlayerProps> = ({ url, volume = 0.5 }) => {
  return (
    <div style={playerStyle}>
      <ReactPlayer url={url} playing volume={volume} />
    </div>
  );
};

export default MediaPlayer;
