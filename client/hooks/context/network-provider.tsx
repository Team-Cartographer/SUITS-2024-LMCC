"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchWithoutParams } from "@/api/fetchServer";

////////////////////////////////////////////////

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

interface GeoJSONFeature {
    type: 'Feature';
    geometry: {
        type: 'Point';
        coordinates: [number, number];
    };
    properties: {
        name: string;
        description: string;
    };
}

// Gets GeoJSON interface type hinting
interface GeoJSON {
    type: 'FeatureCollection';
    features: GeoJSONFeature[];
}

const defaultGEOJSONValue: GeoJSON = {
	type: 'FeatureCollection',
	features: []
}

////////////////////////////////////////////////////////////////

interface NetworkContextType {
	getMissionTimes: () => TimerType;
	getNotifData: () => PanicData;
	getGeoJSONData: () => GeoJSON;
}

const defaultNetworkValue: NetworkContextType = {
	getMissionTimes: () => defaultTimerValue,
	getNotifData: () => defaultPanicValue,
	getGeoJSONData: () => defaultGEOJSONValue,
};


const NetworkContext = createContext(defaultNetworkValue);

export const NetworkProvider = ({ children }: any) => {
	const TICKSPEED = 250

	const [missionTime, setMissionTime] = useState("00:00:00");
	const [specTime, setSpecTime] = useState("00:00:00");
	const [uiaTime, setUiaTime] = useState("00:00:00");
	const [roverTime, setRoverTime] = useState("00:00:00");
	const [dcuTime, setDcuTime] = useState("00:00:00");
	const [notificationData, setNotifData] = useState<PanicData>()
	const [mapGeoJSON, setMapGeoJSON] = useState<GeoJSON>();

	useEffect(() => {
		const interval = setInterval(async () => {
			try {
				const eva_data = await fetchWithoutParams<{ telemetry: { eva_time: number } }>('tss/telemetry'); 
				if (eva_data?.telemetry?.eva_time !== undefined) {
				  	setMissionTime(formatTime(eva_data.telemetry.eva_time)); 
			  	} else {
					throw new Error('EVA Data is undefined')
				}

				const uia_data = await fetchWithoutParams<{ eva: { uia: {time: number }}}>('tss/eva_info' ); 
				if (uia_data?.eva?.uia?.time !== undefined) {
					setUiaTime(formatTime(uia_data.eva.uia.time)); 
				} else {
					throw new Error('UIA Data is undefined')
				}

				const spec_data = await fetchWithoutParams<{ eva: { spec: {time: number }}}>('tss/eva_info' ); 
				if (spec_data?.eva?.spec?.time !== undefined) {
					setSpecTime(formatTime(spec_data.eva.spec.time));
				} else {
					throw new Error('Spec Data is undefined')
				}

				const rover_data = await fetchWithoutParams<{ eva: { rover: {time: number }}}>('tss/eva_info' ); 
				if (rover_data?.eva?.rover?.time !== undefined) {
					setRoverTime(formatTime(rover_data.eva.rover.time));
				} else {
					throw new Error('Rover data is undefined')
				}

				const dcu_data = await fetchWithoutParams<{ eva: { dcu: {time: number }}}>('tss/eva_info' ); 
				if (dcu_data?.eva?.dcu?.time !== undefined) {
					setDcuTime(formatTime(dcu_data.eva.dcu.time));
				} else {
					throw new Error('DCU data is undefined')
				}

				const notificationData = await fetchWithoutParams<PanicData>(`api/v0?get=notif`)
				if (notificationData) { 
					setNotifData(notificationData);
				} 

				const mapData = await fetchWithoutParams<GeoJSON>('api/v0?get=map_info');
				if (mapData) {
					setMapGeoJSON(mapData);
				} else {
					throw new Error('Map Info is undefined')
				}
				
			} catch (error) {
				console.error('error fetching some data:', error); 
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
			infoWarning: notificationData?.infoWarning || "",
			todoItems: notificationData?.todoItems || [],
			isWarning: notificationData?.isWarning || false
		}
	}

	const getGeoJSONData = (): GeoJSON => {
		return mapGeoJSON || defaultGEOJSONValue
	}

	return (
		<NetworkContext.Provider value={{ 
			getMissionTimes,
			getNotifData,
			getGeoJSONData
		}}>
		{children}
		</NetworkContext.Provider>
	);
};


export const useNetwork = () => useContext(NetworkContext);
