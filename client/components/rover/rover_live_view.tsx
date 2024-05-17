"use client"

import { RoverTelemetry } from "./rover_telemetry";

/**
 * @author @abhi-arya1
 * @function EVALiveView
 */

const RoverLiveView = () => {

	return (
		<div>
			<RoverTelemetry />
			<video controls 
				poster="https://mars.nasa.gov/system/resources/detail_files/25904_1-PIA24546-1200.jpg" 
				className="rounded-b-lg"
				style={{width: '100%', height: 'auto'}}
			>
                <source type="video/webm" />
				Your browser does not support the video tag.
            </video>
			{/* <ReactPlayer url={`https://mars.nasa.gov/system/resources/detail_files/25904_1-PIA24546-1200.jpg`} playing volume={0.5} style={playerStyle} controls={true} /> */}
		</div>
	);
}


export default RoverLiveView;
