"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchWithoutParams } from "@/api/fetchServer";
import { 
	GeoJSON, 
	PanicData,
	TimerType,
	SpecData,
	SpecItem,
	EVASpecItems,
} from "../types";

////////////////////////////////////////////////

const formatTime = (seconds: number) => {  //build formatted timer 
	const hours = Math.floor(seconds / 3600); // build hours timer 
	const minutes = Math.floor((seconds % 3600) / 60); //build minutes timer
	const secs = seconds % 60; // build seconds timer 
  
	return [hours, minutes, secs].map(v => v < 10 ? "0" + v : v).join(":");
};

const defaultPanicValue: PanicData = {
    infoWarning: "", 
    todoItems: [], 
    isWarning: false,
}

const defaultTimerValue: TimerType = {
	mission: "00:00:00",
	uia: "00:00:00",
	spec: "00:00:00",
	dcu: "00:00:00",
	rover: "00:00:00"
	
}

const defaultGEOJSONValue: GeoJSON = {
	type: 'FeatureCollection',
	features: []
}

const defaultSpecValue: EVASpecItems = {
	eva1: null,
	eva2: null 
}

////////////////////////////////////////////////////////////////

interface NetworkContextType {
	getMissionTimes: () => TimerType;
	getNotifData: () => PanicData;
	getGeoJSONData: () => GeoJSON;
	getSpecData: () => EVASpecItems
}

const defaultNetworkValue: NetworkContextType = {
	getMissionTimes: () => defaultTimerValue,
	getNotifData: () => defaultPanicValue,
	getGeoJSONData: () => defaultGEOJSONValue,
	getSpecData: () => defaultSpecValue

};


const NetworkContext = createContext(defaultNetworkValue);

export const NetworkProvider = ({ children }: any) => {
	const TICKSPEED = 300

	const [missionTime, setMissionTime] = useState("00:00:00");
	const [specTime, setSpecTime] = useState("00:00:00");
	const [uiaTime, setUiaTime] = useState("00:00:00");
	const [roverTime, setRoverTime] = useState("00:00:00");
	const [dcuTime, setDcuTime] = useState("00:00:00");
	const [notificationData, setNotifData] = useState<PanicData>()
	const [mapGeoJSON, setMapGeoJSON] = useState<GeoJSON>();
	const [eva1SpecItem, setEVA1SpecItem] = useState<SpecItem>();
	const [eva2SpecItem, setEVA2SpecItem] = useState<SpecItem>();

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

				const specData = await fetchWithoutParams<SpecData>("mission/spec");
				if (specData) {
					setEVA1SpecItem({
						data: specData.spec["eva1"].data,
						id: specData.spec["eva1"].id,
						name: specData.spec["eva1"].name
					})
					setEVA2SpecItem({
						data: specData.spec["eva2"].data,
						id: specData.spec["eva2"].id,
						name: specData.spec["eva2"].name
					})
				} else { 
					throw new Error('Spec Data is Undefined!')
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

	const getSpecData = (): EVASpecItems => {
		return {
			eva1: eva1SpecItem || null,
			eva2: eva2SpecItem || null,
		}
	}

	return (
		<NetworkContext.Provider value={{ 
			getMissionTimes,
			getNotifData,
			getGeoJSONData,
			getSpecData,
		}}>
		{children}
		</NetworkContext.Provider>
	);
};


export const useNetwork = () => useContext(NetworkContext);
