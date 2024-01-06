"use client";

/**
 * @author @abhi-arya1
 * @function EVALiveView
 * @fileoverview https://docs.google.com/document/d/1wiDTSK4uR1we2z8LcobuU8MG8j1gtWkV8PsYyITrCy4/
 */


import ReactPlayer from "react-player";

interface EVALiveViewProps {
  evaNumber: number;
  url: string;
  volume?: number;
}

function EVALiveView({ evaNumber, url, volume = 0.5 }: EVALiveViewProps) {
  const playerStyle = {
    borderBottomLeftRadius: "20px",
    borderBottomRightRadius: "20px",
    overflow: "hidden",
  };

  return (
    <div>
      <ReactPlayer
        width="95%"
        height="200%"
        url={url}
        controls
        playing
        volume={volume}
        style={playerStyle}
      />
    </div>
  );
}

export default EVALiveView;
