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
	EvaStatus,
	UIAState,
	DCUState,
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


const defaultEvaStatusValue: EvaStatus = { 
  started: false,
  paused: false,
  completed: false,
  total_time: 0,
  uia: {
    started: false,
    completed: false,
    time: 0
  },
  dcu: {
    started: false,
    completed: false,
    time: 0
  },
  rover: {
    started: false,
    completed: false,
    time: 0
  },
  spec: {
    started: false,
    completed: false,
    time: 0
  }
}

const defaultUIAState: UIAState = {
    uia: {
        eva1_power:        false,
        eva1_oxy:          false,
        eva1_water_supply: false,
        eva1_water_waste:  false,
        eva2_power:        false,
        eva2_oxy:          false,
        eva2_water_supply: false,
        eva2_water_waste:  false,
        oxy_vent:          false,
        depress:           false
    }
};

const defaultDCUState: DCUState = {
    dcu: {
        eva1: {
            batt: false,
            oxy: false,
            comm: false,
            fan: false,
            pump: false,
            co2: false
        },
        eva2: {
            batt: false,
            oxy: false,
            comm: false,
            fan: false,
            pump: false,
            co2: false
        }
    }
};

///////////////////////////////////////////

export { 
    defaultWarningValue,
	defaultTodoValue,
	defaultUIAState,
	defaultDCUState,
    defaultRoverValue,
    defaultGEOJSONValue,
    defaultSpecValue, 
    defaultTimerValue, 
    defaultBiometricValue,
	defaultErrorValue,
	defaultEvaStatusValue,
}