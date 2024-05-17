"use client"

/**
 * @author @abhi-arya1
 * @function EVALiveView
 */

const RoverLiveView = () => {

	return (
		<>
			<div className="flex flex-row items-center justify-between text-muted-foreground p-2 text-xs font-bold">
				<span className="pl-1">Rover Video Feed</span>
				<span className="pr-8">Realsense D425i Video Feed</span>
			</div>

			<div className="flex flex-row max-w-[500px] gap-x-2">
				<video
					controls
					poster="https://mars.nasa.gov/system/resources/detail_files/25904_1-PIA24546-1200.jpg"
					className="rounded-2xl w-full"
				>
					<source src="path-to-your-video-file.webm" type="video/webm" />
					Your browser does not support the video tag.
				</video>
				<video controls 
					poster="https://mars.nasa.gov/system/resources/detail_files/25904_1-PIA24546-1200.jpg" 
					className="rounded-2xl w-full"
				>
					<source type="video/webm" />
					Your browser does not support the video tag.
				</video>
			</div>
		</>
	);
}


export default RoverLiveView;
