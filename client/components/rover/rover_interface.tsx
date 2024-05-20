"use client"

/**
 * @author @abhi-arya1
 * @function EVALiveView
 */

import lmcc_config from "@/lmcc_config.json"

const RoverLiveView = () => {
	const ip = lmcc_config.rover_ip;

	return (
		<>
			<div className="flex flex-row items-center justify-between text-muted-foreground p-2 text-xs font-bold">
				<span className="pl-1">Rover Video Feed</span>
				<span className="pr-8">Realsense D425i Video Feed</span>
			</div>

			<div className="flex flex-row max-w-[500px] gap-x-2">
				<img src="/native_feed.jpg" alt="" className="rounded-lg" />
				<img src="/thermal_feed.jpg" alt="" className="rounded-lg" />
				{/* <img src={`http://${ip}:5000/native_feed`} alt="" className="rounded-lg" />
				<img src={`http://${ip}:5000/thermal_feed`} alt="" className="rounded-lg" /> */}
			</div>
		</>
	);
}


export default RoverLiveView;
