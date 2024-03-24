"use client";

/**
 * @author @abhi-arya1, @adyxn
 * @function Timers
 */

import { useNetwork } from "@/hooks/context/network-context";
import Clock from 'react-live-clock'

const MissionClock = () => {   
	return (
	<div className="flex flex-row">
		<div className="text-4xl font-semibold mb-4 absolute pt-0">
			<span suppressHydrationWarning><Clock format={'HH:mm:ss'} ticking={true} timezone={'US/Pacific'}/></span>
		</div>
	</div>
	);
};

const Timers = () => {
	const networkProvider = useNetwork();
	const missionTimes = networkProvider.getMissionTimes();

	return (                                             
		<div className="flex flex-col pt-2 pl-2 gap-y-3 pr-3">

			<div className="flex flex-row pl-2 gap-x-6">
				<div className="flex flex-col">
					<p className="font-bold text-md">Current Time</p>
						<MissionClock />
				</div>

				<div className="flex flex-col pl-16">
					<p className="font-bold text-md">Mission Elapsed Time</p>
					<div className="flex flex-row">
						<div className="text-4xl font-semibold mb-4 absolute pt-0">
							{missionTimes.mission}
						</div>
					</div>
				</div>
			</div>

			<div className="flex flex-row gap-x-5 space-x-5 mt-10 pr-6"> 
				<div>
					<p className="font-bold text-md pr-3">UIA Time</p>
				<div className="flex flex-row">
					<div className="text-2xl font-semibold mb-4 absolute pt-0">
						{missionTimes.uia}
					</div>
				</div>
				</div>
			<div>
			<p className="font-bold text-md">Spec Time</p>
				<div className="flex flex-row">
				<div className="text-2xl font-semibold mb-4 absolute pt-0">
					{missionTimes.spec}
				</div>
				</div>
			</div>
			<div>
			<p className="font-bold text-md">Rover Time</p>
				<div className="flex flex-row">
				<div className="text-2xl font-semibold mb-4 absolute pt-0">
					{missionTimes.rover}
				</div>
				</div>
			</div>
			<div>
			<p className="font-bold text-md">DCU Time</p>
				<div className="flex flex-row">
				<div className="text-2xl font-semibold mb-4 absolute pt-0">
					{missionTimes.dcu}
				</div>
				</div>
			</div>
			</div>
			</div>
	);
	};



export default Timers;
