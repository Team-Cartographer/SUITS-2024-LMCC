"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchWithParams, fetchWithoutParams } from "@/api/fetchServer";
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
	ErrorData,
	SpecRequest,
	EvaStatus,
	EvaData,
	UIAState,
	DCUState,
	CommState,
} from "@/lib/types";
import { 
    defaultTodoValue,
	defaultWarningValue,
    defaultRoverValue,
    defaultGEOJSONValue,
    defaultSpecValue, 
    defaultTimerValue, 
    defaultBiometricValue,
	defaultErrorValue,
	defaultEvaStatusValue,
	defaultUIAState,
	defaultDCUState,
	defaultCommState
} from "@/lib/defaults"

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
	getErrorData: () => ErrorData; 
	getEvaData: () => EvaStatus;
	getUIAData: () => UIAState;
	getDCUData: () => DCUState;
	getCommData: () => CommState;
	updateTodoItems: (newItem: string) => any; 
	updateTodoItemsViaList: (newItems: string[][]) => any;
	updateWarning: (warning: string) => any;
}

const defaultNetworkValue: NetworkContextType = {
	getMissionTimes: () => defaultTimerValue,
	getTodoData: () => defaultTodoValue,
	getWarningData: () => defaultWarningValue,
	getGeoJSONData: () => defaultGEOJSONValue,
	getSpecData: () => defaultSpecValue,
	getTelemetryData: (evaNumber: number) => defaultBiometricValue,
	getRoverData: () => defaultRoverValue,
	getErrorData: () => defaultErrorValue,
	getEvaData: () => defaultEvaStatusValue,
	getUIAData: () => defaultUIAState,
	getDCUData: () => defaultDCUState,
	getCommData: () => defaultCommState,
	updateTodoItems: (newItem: string) => 0,
	updateTodoItemsViaList: (newItems: string[][]) => 0,
	updateWarning: (warning: string) => 0,
};

const NetworkContext = createContext(defaultNetworkValue);

export const NetworkProvider = ({ children }: any) => {
	const TICKSPEED = 1000;

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
	const [errorData, setErrorData] = useState<ErrorData>(defaultErrorValue);
	const [commData, setCommData] = useState<CommState>(defaultCommState);
	const [evaData, setEvaData] = useState<EvaStatus>(defaultEvaStatusValue); 
	const [uiaSwitchState, setUiaSwitchState] = useState<UIAState>(defaultUIAState);
	const [dcuSwitchState, setDcuSwitchState] = useState<DCUState>(defaultDCUState);

	useEffect(() => {
		const interval = setInterval(async () => {
			try {
				const eva_data = await fetchWithoutParams<EvaData>('tss/eva_info'); 
				if(eva_data) { 
					setMissionTime(formatTime(eva_data.eva.total_time));
					setUiaTime(formatTime(eva_data.eva.uia.time));
					setSpecTime(formatTime(eva_data.eva.spec.time));
					setRoverTime(formatTime(eva_data.eva.rover.time));
					setDcuTime(formatTime(eva_data.eva.dcu.time));
					setEvaData(eva_data.eva)
				} else { 
					throw new Error("EVA Data is Undefined")
				}

				const commData = await fetchWithoutParams<CommState>('mission/comm');
				if (commData) {
					setCommData(commData);
				} else {
					throw new Error('Comm Data is Undefined!')
				}

				const warningData = await fetchWithoutParams<WarningData>('warning');
				if (warningData) {
					setWarningData(warningData);
				} else {
					setWarningData(defaultWarningValue);
				}

				const todoData = await fetchWithoutParams<TodoItems>('todo');
				if (todoData) {
					setTodoItems(todoData);
				} else {
					setTodoItems(defaultTodoValue);
				}

				const mapData = await fetchWithoutParams<GeoJSON>('geojson');
				if (mapData) {
					setMapGeoJSON(mapData);
				} else {
					throw new Error('Map Info is undefined')
				}

				const errorData = await fetchWithoutParams<ErrorData>('mission/error');
				if (errorData) {
					setErrorData(errorData);
					if (errorData.error.oxy_error) {
						updateWarning('Oxygen Error Detected! Run appropriate procedure!');
					}
					if (errorData.error.pump_error) {
						updateWarning('Pump Error Detected! Run appropriate procedure!');
					} 
					if (errorData.error.fan_error) {
						updateWarning('Fan Error Detected! Run appropriate procedure!');
					} 
				} else {
					throw new Error('Error Data is Undefined!')
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
					throw new Error('Biometric Data is undefined')
				}


				const specData = await fetchWithoutParams<SpecRequest>("mission/spec");
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

				const uiaDataTemp = await fetchWithoutParams<UIAState>('mission/uia');
				if (uiaDataTemp) { 
					setUiaSwitchState(uiaDataTemp);
				} else { 
					throw new Error('UIA Data is Undefined!')
				}

				const dcuDataTemp = await fetchWithoutParams<DCUState>('mission/dcu');
				if (dcuDataTemp) { 
					setDcuSwitchState(dcuDataTemp);
				} else { 
					throw new Error('DCU Data is Undefined!')
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

	const getTodoData = (): TodoItems => { 
		return todoItems || defaultTodoValue
	}

	const getWarningData = (): WarningData => {
		return warningData || defaultWarningValue
	}

	const getGeoJSONData = (): GeoJSON => {
		return mapGeoJSON || defaultGEOJSONValue
	}

	const getCommData = (): CommState => {
		return commData || defaultCommState
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

	const getErrorData = (): ErrorData => {
		return errorData || defaultErrorValue
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


	const getEvaData = (): EvaStatus => {
		return evaData || defaultEvaStatusValue
	}

	const getUIAData = (): UIAState => {
		return uiaSwitchState || defaultUIAState
	}

	const getDCUData = (): DCUState => {
		return dcuSwitchState || defaultDCUState
	}

	const updateTodoItems = async (newItem: string) => { 
        const newItems = await fetchWithParams('settodo',
        {
            todoItems: [...(todoItems.todoItems || []), [newItem, "False"]]
        })
		setTodoItems(newItems); 
	}

	const updateTodoItemsViaList = async (newItems: string[][]) => { 
        const _newItems = await fetchWithParams('settodo',
			{
				todoItems: newItems
			})
		setTodoItems(_newItems);
	}

	const updateWarning = async (warning: string) => {
		const warningData = await fetchWithParams(`setwarning`,
			{
				infoWarning: warning,
			})
		setWarningData(warningData);
	}

	return (
		<NetworkContext.Provider value={{ 
			getMissionTimes,
			getWarningData,
			getTodoData,
			getGeoJSONData,
			getDCUData,
			getSpecData,
			getTelemetryData,
			getRoverData,
			getErrorData,
			getEvaData,
			updateTodoItems,
			updateTodoItemsViaList,
			updateWarning,
			getUIAData,
			getCommData,
		}}>
			{children}
		</NetworkContext.Provider>
	);
};


export const useNetwork = () => useContext(NetworkContext);