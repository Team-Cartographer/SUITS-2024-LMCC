/**
 * @author @abhi-arya1
 * @function EVALiveView
 * @fileoverview While this document isn't specifically for rover live view, it is essentially the same with different Border Radii:
 */

import ReactPlayer from "react-player";

interface EVALiveViewProps {
  url: string;
  volume?: number;
}

function RoverLiveView({ url, volume = 0.5 }: EVALiveViewProps) {
  const playerStyle = {
    borderBottomLeftRadius: "12px",
    borderBottomRightRadius: "12px",
    borderTopRightRadius: "12px",
    borderTopLeftRadius: "12px",
    overflow: "hidden",
  };

  return (
    <div>
      <ReactPlayer url={url} playing volume={volume} style={playerStyle} />
    </div>
  );
}

export default RoverLiveView;
