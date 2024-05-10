"use client"

/**
 * @author @abhi-arya1
 * @function EVALiveView
 */

const RoverLiveView = () => {
	const playerStyle = {
		borderBottomLeftRadius: "12px",
		borderBottomRightRadius: "12px",
		width: "59.15%",
		overflow: "hidden",
	};

	return (
		<div>
			<video controls autoPlay={true} loop={true} style={playerStyle}>
				<source src=""  type="video/mp4" />
            	Your browser does not support the video tag.
        	</video>
			{/* <ReactPlayer url={`https://mars.nasa.gov/system/resources/detail_files/25904_1-PIA24546-1200.jpg`} playing volume={0.5} style={playerStyle} controls={true} /> */}
		</div>
	);
}


export default RoverLiveView;
