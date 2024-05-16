import { 
	GeoJSON,
	TodoItems,
	TimerType,
	SpecData,
	SpecItem,
	EVASpecItems,
	Biometrics,
	RoverData,
	WarningData,
} from "./types";

///////////////////////////////////////

const defaultWarningValue: WarningData = {
    infoWarning: "", 
}

const defaultTodoValue: TodoItems = {
	todoItems: []
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
	"eva1": {
		"name": "default_rock",
		"id": 0,
		"data": {
			"SiO2": 1,
			"TiO2": 1,
			"Al2O3": 1,
			"FeO": 1,
			"MnO": 1,
			"MgO": 1,
			"CaO": 1,
			"K2O": 1,
			"P2O3": 1,
			"other": 91
		}
	},
	"eva2": {
		"name": "default_rock",
		"id": 0,
		"data": {
			"SiO2": 1,
			"TiO2": 1,
			"Al2O3": 1,
			"FeO": 1,
			"MnO": 1,
			"MgO": 1,
			"CaO": 1,
			"K2O": 1,
			"P2O3": 1,
			"other": 91
		}
	}
}


const defaultRoverValue: RoverData = { 
	rover: {
		posx: 0,
		posy: 0,
		qr_id: 0,
	}
}

const defaultBiometricValue: Biometrics = { 
	telemetry: {
		eva: {
			batt_time_left: 0.0,
			co2_production: 0.0,
			coolant_gas_pressure: 0.0,
			coolant_liquid_pressure: 0.0,
			coolant_ml: 0.0,
			fan_pri_rpm: 0.0,
			fan_sec_rpm: 0.0,
			heart_rate: 0.0,
			helmet_pressure_co2: 0.0,
			oxy_consumption: 0.0,
			oxy_pri_pressure: 0.0,
			oxy_pri_storage: 0.0,
			oxy_sec_pressure: 0.0,
			oxy_sec_storage: 0.0,
			oxy_time_left: 0.0,
			scrubber_a_co2_storage: 0.0,
			scrubber_b_co2_storage: 0.0,
			suit_pressure_co2: 0.0,
			suit_pressure_other: 0.0,
			suit_pressure_oxy: 0.0,
			suit_pressure_total: 0.0,
			temperature: 0.0,
		}
	}
}

const defaultErrorValue = {
	error: { 
        fan_error: false,
        oxy_error: false,
        pump_error: false,
    }
}

///////////////////////////////////////////

export { 
    defaultWarningValue,
	defaultTodoValue,
    defaultRoverValue,
    defaultGEOJSONValue,
    defaultSpecValue, 
    defaultTimerValue, 
    defaultBiometricValue,
	defaultErrorValue,
}