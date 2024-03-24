"use client"

/**
 * @author @abhi-arya1
 * @function EVALiveView
 */

import ReactPlayer from "react-player";
import { fetchWithoutParams } from "@/api/fetchServer";
import { useEffect, useState } from "react";

const RoverLiveView = () => {
	const [roverURL, setRoverURL] = useState(''); 

	const playerStyle = {
		borderBottomLeftRadius: "12px",
		borderBottomRightRadius: "12px",
		overflow: "hidden",
	};

	useEffect(() => {
		const getRoverURL = async () => { 
			await fetchWithoutParams<{rover_url: string}>('api/v0?get=rover_url').then((item) => {
			if (item && item.rover_url) {
				setRoverURL(item.rover_url);
			}
		})}
		
		getRoverURL();
	})


	return (
		<div>
			<ReactPlayer url={roverURL} playing volume={0.5} style={playerStyle} controls={true} />
		</div>
	);
}


export default RoverLiveView;
