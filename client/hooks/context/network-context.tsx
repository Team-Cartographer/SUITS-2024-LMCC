"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchWithoutParams } from "@/api/fetchServer";
import { 
	GeoJSON, 
	TodoItems,
	WarningData,
	TimerType,
	SpecData,
	SpecItem,
	EVASpecItems,
	Biometrics,
	RoverData,
} from "../types";
import { 
    defaultTodoValue,
	defaultWarningValue,
    defaultRoverValue,
    defaultGEOJSONValue,
    defaultSpecValue, 
    defaultTimerValue, 
    defaultBiometricValue
} from "../defaults"

////////////////////////////////////////////////

const formatTime = (seconds: number) => {  //build formatted timer 
	const hours = Math.floor(seconds / 3600); // build hours timer 
	const minutes = Math.floor((seconds % 3600) / 60); //build minutes timer
	const secs = seconds % 60; // build seconds timer 
  
	return [hours, minutes, secs].map(v => v < 10 ? "0" + v : v).join(":");
};

////////////////////////////////////////////////////////////////

interface NetworkContextType {
	getMissionTimes: () => TimerType;
	getTodoData: () => TodoItems;
	getWarningData: () => WarningData;
	getGeoJSONData: () => GeoJSON;
	getSpecData: () => EVASpecItems;
	getTelemetryData: (evaNumber: number) => Biometrics;
	getRoverData: () => RoverData;
}

const defaultNetworkValue: NetworkContextType = {
	getMissionTimes: () => defaultTimerValue,
	getTodoData: () => defaultTodoValue,
	getWarningData: () => defaultWarningValue,
	getGeoJSONData: () => defaultGEOJSONValue,
	getSpecData: () => defaultSpecValue,
	getTelemetryData: (evaNumber: number) => defaultBiometricValue,
	getRoverData: () => defaultRoverValue,
};


const NetworkContext = createContext(defaultNetworkValue);

export const NetworkProvider = ({ children }: any) => {
	const TICKSPEED = 600

	const [missionTime, setMissionTime] = useState("00:00:00");
	const [specTime, setSpecTime] = useState("00:00:00");
	const [uiaTime, setUiaTime] = useState("00:00:00");
	const [roverTime, setRoverTime] = useState("00:00:00");
	const [dcuTime, setDcuTime] = useState("00:00:00");
	const [warningData, setWarningData] = useState<WarningData>(defaultWarningValue);
	const [todoItems, setTodoItems] = useState<TodoItems>(defaultTodoValue);
	const [mapGeoJSON, setMapGeoJSON] = useState<GeoJSON>();
	const [eva1SpecItem, setEVA1SpecItem] = useState<SpecItem>();
	const [eva2SpecItem, setEVA2SpecItem] = useState<SpecItem>();
	const [biometricDataEva1, setBiometricDataEva1] = useState<Biometrics>(defaultBiometricValue);
	const [biometricDataEva2, setBiometricDataEva2] = useState<Biometrics>(defaultBiometricValue);
	const [roverData, setRoverData] = useState<RoverData>(defaultRoverValue); 

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

				const warningData = await fetchWithoutParams<WarningData>(`api/v0?get=warning`)
				if (warningData) { 
					setWarningData(warningData);
				} 

				const todoData = await fetchWithoutParams<TodoItems>(`api/v0?get=todo`)
				if (todoData) { 
					setTodoItems(todoData);
				}

				const mapData = await fetchWithoutParams<GeoJSON>('api/v0?get=map_info');
				if (mapData) {
					setMapGeoJSON(mapData);
				} else {
					throw new Error('Map Info is undefined')
				}

				const biometricData = await fetchWithoutParams<Biometrics>('tss/telemetry');
				if (biometricData) {
					setBiometricDataEva1(
						{
							telemetry: {
								eva: {
									batt_time_left: biometricData.telemetry.eva1.batt_time_left,
									co2_production: biometricData.telemetry.eva1.co2_production,
									coolant_gas_pressure: biometricData.telemetry.eva1.coolant_gas_pressure,
									coolant_liquid_pressure: biometricData.telemetry.eva1.coolant_liquid_pressure,
									coolant_ml: biometricData.telemetry.eva1.coolant_ml,
									fan_pri_rpm: biometricData.telemetry.eva1.fan_pri_rpm,
									fan_sec_rpm: biometricData.telemetry.eva1.fan_sec_rpm,
									heart_rate: biometricData.telemetry.eva1.heart_rate,
									helmet_pressure_co2: biometricData.telemetry.eva1.helmet_pressure_co2,
									oxy_consumption: biometricData.telemetry.eva1.oxy_consumption,
									oxy_pri_pressure: biometricData.telemetry.eva1.oxy_pri_pressure,
									oxy_pri_storage: biometricData.telemetry.eva1.oxy_pri_storage,
									oxy_sec_pressure: biometricData.telemetry.eva1.oxy_sec_pressure,
									oxy_sec_storage: biometricData.telemetry.eva1.oxy_sec_storage,
									oxy_time_left: biometricData.telemetry.eva1.oxy_time_left,
									scrubber_a_co2_storage: biometricData.telemetry.eva1.scrubber_a_co2_storage,
									scrubber_b_co2_storage: biometricData.telemetry.eva1.scrubber_b_co2_storage,
									suit_pressure_co2: biometricData.telemetry.eva1.suit_pressure_co2,
									suit_pressure_other:  biometricData.telemetry.eva1.suit_pressure_other,
									suit_pressure_oxy:  biometricData.telemetry.eva1.suit_pressure_oxy,
									suit_pressure_total:  biometricData.telemetry.eva1.suit_pressure_total,
									temperature:  biometricData.telemetry.eva1.temperature,
									}
							}
						}
					)
				}
				else {
					throw new Error('Biometric Data (EVA 1) is undefined')
				}

				if (biometricData) {
					setBiometricDataEva2(
						{
							telemetry: {
								eva: {
									batt_time_left: biometricData.telemetry.eva2.batt_time_left,
									co2_production: biometricData.telemetry.eva2.co2_production,
									coolant_gas_pressure: biometricData.telemetry.eva2.coolant_gas_pressure,
									coolant_liquid_pressure: biometricData.telemetry.eva2.coolant_liquid_pressure,
									coolant_ml: biometricData.telemetry.eva2.coolant_ml,
									fan_pri_rpm: biometricData.telemetry.eva2.fan_pri_rpm,
									fan_sec_rpm: biometricData.telemetry.eva2.fan_sec_rpm,
									heart_rate: biometricData.telemetry.eva2.heart_rate,
									helmet_pressure_co2: biometricData.telemetry.eva2.helmet_pressure_co2,
									oxy_consumption: biometricData.telemetry.eva2.oxy_consumption,
									oxy_pri_pressure: biometricData.telemetry.eva2.oxy_pri_pressure,
									oxy_pri_storage: biometricData.telemetry.eva2.oxy_pri_storage,
									oxy_sec_pressure: biometricData.telemetry.eva2.oxy_sec_pressure,
									oxy_sec_storage: biometricData.telemetry.eva2.oxy_sec_storage,
									oxy_time_left: biometricData.telemetry.eva2.oxy_time_left,
									scrubber_a_co2_storage: biometricData.telemetry.eva2.scrubber_a_co2_storage,
									scrubber_b_co2_storage: biometricData.telemetry.eva2.scrubber_b_co2_storage,
									suit_pressure_co2: biometricData.telemetry.eva2.suit_pressure_co2,
									suit_pressure_other: biometricData.telemetry.eva2.suit_pressure_other,
									suit_pressure_oxy: biometricData.telemetry.eva2.suit_pressure_oxy,
									suit_pressure_total: biometricData.telemetry.eva2.suit_pressure_total,
									temperature: biometricData.telemetry.eva2.temperature,
									}
							}
						}
					) 
				}
				else {
					throw new Error('Biometric Data (EVA 2) is undefined')
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

				const roverDataTemp = await fetchWithoutParams<RoverData>('mission/rover');
				if (roverDataTemp) { 
					setRoverData(roverDataTemp);
				} else { 
					throw new Error('Rover Data is Undefined!')
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

	const getWarningData = (): WarningData => {
		return warningData || defaultWarningValue
	}

	const getTodoData = (): TodoItems => { 
		return todoItems || defaultTodoValue
	}

	const getGeoJSONData = (): GeoJSON => {
		return mapGeoJSON || defaultGEOJSONValue
	}

	const getSpecData = (): EVASpecItems => {
		return {
			eva1: eva1SpecItem || defaultSpecValue.eva1,
			eva2: eva2SpecItem || defaultSpecValue.eva2,
		}
	}

	const getRoverData = (): RoverData => { 
		return roverData || defaultRoverValue
	}

	const getTelemetryData = (evaNumber: number): Biometrics => {
		let biometricData;
		if (evaNumber === 1) {
			biometricData = biometricDataEva1;
		} else if (evaNumber === 2) {
			biometricData = biometricDataEva2;
		} else {
			throw new Error(`Invalid Eva number: ${evaNumber}`);
		}
			return {
				telemetry: {
					eva: {
						batt_time_left: biometricData.telemetry.eva.batt_time_left,
						co2_production: biometricData.telemetry.eva.co2_production,
						coolant_gas_pressure: biometricData.telemetry.eva.coolant_gas_pressure,
						coolant_liquid_pressure: biometricData.telemetry.eva.coolant_liquid_pressure,
						coolant_ml: biometricData.telemetry.eva.coolant_ml,
						fan_pri_rpm: biometricData.telemetry.eva.fan_pri_rpm,
						fan_sec_rpm: biometricData.telemetry.eva.fan_sec_rpm,
						heart_rate: biometricData.telemetry.eva.heart_rate,
						helmet_pressure_co2: biometricData.telemetry.eva.helmet_pressure_co2,
						oxy_consumption: biometricData.telemetry.eva.oxy_consumption,
						oxy_pri_pressure: biometricData.telemetry.eva.oxy_pri_pressure,
						oxy_pri_storage: biometricData.telemetry.eva.oxy_pri_storage,
						oxy_sec_pressure: biometricData.telemetry.eva.oxy_sec_pressure,
						oxy_sec_storage: biometricData.telemetry.eva.oxy_sec_storage,
						oxy_time_left: biometricData.telemetry.eva.oxy_time_left,
						scrubber_a_co2_storage: biometricData.telemetry.eva.scrubber_a_co2_storage,
						scrubber_b_co2_storage: biometricData.telemetry.eva.scrubber_b_co2_storage,
						suit_pressure_co2: biometricData.telemetry.eva.suit_pressure_co2,
						suit_pressure_other: biometricData.telemetry.eva.suit_pressure_other,
						suit_pressure_oxy: biometricData.telemetry.eva.suit_pressure_oxy,
						suit_pressure_total: biometricData.telemetry.eva.suit_pressure_total,
						temperature: biometricData.telemetry.eva.temperature,
					}
				}
			};
	};

	return (
		<NetworkContext.Provider value={{ 
			getMissionTimes,
			getWarningData,
			getTodoData,
			getGeoJSONData,
			getSpecData,
			getTelemetryData,
			getRoverData,
		}}>
			{children}
		</NetworkContext.Provider>
	);
};


export const useNetwork = () => useContext(NetworkContext);
