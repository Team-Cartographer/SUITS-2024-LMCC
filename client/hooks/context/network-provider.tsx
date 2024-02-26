"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import lmcc_config from "@/lmcc_config.json"
import { fetchWithParams, fetchWithoutParams, fetchImageWithParams, fetchImageWithoutParams } from "@/api/fetchServer";
import { FlashOnOutlined } from "@mui/icons-material";

const TICKSPEED = lmcc_config.tickspeed


const formatTime = (seconds: number) => {  //build formatted timer 
	const hours = Math.floor(seconds / 3600); // build hours timer 
	const minutes = Math.floor((seconds % 3600) / 60); //build minutes timer
	const secs = seconds % 60; // build seconds timer 
  
	return [hours, minutes, secs].map(v => v < 10 ? "0" + v : v).join(":");
};

interface PanicData {
    infoWarning: string, 
    todoItems: [string, string][], 
    isWarning: boolean,
}

const defaultPanicValue: PanicData = {
    infoWarning: "", 
    todoItems: [], 
    isWarning: false,
}

interface TimerType { 
	mission: string 
	uia: string
	spec: string
	dcu: string, 
	rover: string
}

const defaultTimerValue: TimerType = {
	mission: "00:00:00",
	uia: "00:00:00",
	spec: "00:00:00",
	dcu: "00:00:00",
	rover: "00:00:00"
	
}

interface NetworkContextType {
	getMissionTimes: () => TimerType;
	getNotifData: () => PanicData;
}

const defaultValue: NetworkContextType = {
	getMissionTimes: () => defaultTimerValue,
	getNotifData: () => defaultPanicValue,
};


const NetworkContext = createContext(defaultValue);

export const NetworkProvider = ({ children }: any) => {
	const [missionTime, setMissionTime] = useState("00:00:00");
	const [specTime, setSpecTime] = useState("00:00:00");
	const [uiaTime, setUiaTime] = useState("00:00:00");
	const [roverTime, setRoverTime] = useState("00:00:00");
	const [dcuTime, setDcuTime] = useState("00:00:00");
	const [notificationData, setNotifData] = useState<PanicData>()

	useEffect(() => {
		const interval = setInterval(async () => {
			try {
				const eva_data = await fetchWithoutParams<{ telemetry: { eva_time: number } }>('tss/telemetry'); 
				if (eva_data?.telemetry?.eva_time !== undefined) {
				  	setMissionTime(formatTime(eva_data.telemetry.eva_time)); 
			  	}
				const uia_data = await fetchWithoutParams<{ eva: { uia: {time: number }}}>('tss/eva_info' ); 
				if (uia_data?.eva?.uia?.time !== undefined) {
					setUiaTime(formatTime(uia_data.eva.uia.time)); 
				}
				const spec_data = await fetchWithoutParams<{ eva: { spec: {time: number }}}>('tss/eva_info' ); 
				if (spec_data?.eva?.spec?.time !== undefined) {
					setSpecTime(formatTime(spec_data.eva.spec.time));
				}
				const rover_data = await fetchWithoutParams<{ eva: { rover: {time: number }}}>('tss/eva_info' ); 
				if (rover_data?.eva?.rover?.time !== undefined) {
					setRoverTime(formatTime(rover_data.eva.rover.time));
				}
				const dcu_data = await fetchWithoutParams<{ eva: { dcu: {time: number }}}>('tss/eva_info' ); 
				if (dcu_data?.eva?.dcu?.time !== undefined) {
					setDcuTime(formatTime(dcu_data.eva.dcu.time));
				}

				const notificationData = await fetchWithoutParams<PanicData>(`api/v0?get=notif`)
				if (notificationData) { 
					setNotifData(notificationData);
				} 
				
			} catch (error) {
				console.error('Error fetching eva_time:', error); 
			}
		}, TICKSPEED);
  
		return () => clearInterval(interval);
	  }, []);

	
	const getMissionTimes = (): TimerType => {
		return {
			mission: missionTime, 
			uia: uiaTime,
			spec: specTime,
			dcu: dcuTime,
			rover: roverTime
		}
	};

	const getNotifData = (): PanicData => {
		return {
			infoWarning: notificationData?.infoWarning || "Error",
			todoItems: notificationData?.todoItems || [["Error", "Error"]],
			isWarning: notificationData?.isWarning || false
		}
	}

	return (
		<NetworkContext.Provider value={{ 
			getMissionTimes,
			getNotifData
		}}>
		{children}
		</NetworkContext.Provider>
	);
};


export const useNetwork = () => useContext(NetworkContext);
