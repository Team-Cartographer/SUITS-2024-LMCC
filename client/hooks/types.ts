
// MAP /////////////////////////////////////////////////////////////

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

interface GeoJSON {
    type: 'FeatureCollection';
    features: GeoJSONFeature[];
}

// NOTIFICATION/PANIC //////////////////////////////////////////////////

interface WarningData {
    infoWarning: string, 
}

interface TodoItems { 
    todoItems: [string, string][]
}


// CHAT /////////////////////////////////////////////////////////////

interface ChatHistoryType { 
    history: ChatItemType[]
    todoItem: string
}

interface ChatItemType { 
    role: string 
    parts: string[]
}

// TIMERS /////////////////////////////////////////////////////////////

interface TimerType { 
	mission: string 
	uia: string
	spec: string
	dcu: string, 
	rover: string
}

// SPEC /////////////////////////////////////////////////////////////

interface SpecData {
    Al2O3: number;
    CaO: number;
    FeO: number;
    K2O: number;
    MgO: number;
    MnO: number;
    P2O3: number;
    SiO2: number;
    TiO2: number;
    other: number;
  }
  
interface SpecItem {
data: SpecData;
id: number;
name: string;
}

interface Spec {
[key: string]: SpecItem;
}

interface SpecData {
spec: Spec;
}

interface EVASpecItems {
	eva1: SpecItem | null
	eva2: SpecItem | null
}

// BIOMETRICDATA /////////////////////////////////////////////////////////////

interface BiometricData {
    batt_time_left:            number;
    co2_production:            number;
    coolant_gas_pressure:      number;
    coolant_liquid_pressure:   number;
    coolant_ml:                number;
    fan_pri_rpm:               number;
    fan_sec_rpm:               number;
    heart_rate:                number;
    helmet_pressure_co2:       number;
    oxy_consumption:           number;
    oxy_pri_pressure:          number;
    oxy_pri_storage:           number;
    oxy_sec_pressure:          number;
    oxy_sec_storage:           number;
    oxy_time_left:             number;
    scrubber_a_co2_storage:    number;
    scrubber_b_co2_storage:    number;
    suit_pressure_co2:         number;
    suit_pressure_other:       number;
    suit_pressure_oxy:         number;
    suit_pressure_total:       number;
    temperature:               number;
}

interface Biometrics {
    telemetry: {
        [eva: string]: BiometricData;
    }
}

const biometricIDMap = { 
    batt_time_left:            '1',
    co2_production:            '2',
    coolant_gas_pressure:      '3',
    coolant_liquid_pressure:   '4',
    coolant_ml:                '5',
    fan_pri_rpm:               '6',
    fan_sec_rpm:               '7',
    heart_rate:                '8',
    helmet_pressure_co2:       '9',
    oxy_consumption:           '10',
    oxy_pri_pressure:          '11',
    oxy_pri_storage:           '12',
    oxy_sec_pressure:          '13',
    oxy_sec_storage:           '14',
    oxy_time_left:             '15',
    scrubber_a_co2_storage:    '16',
    scrubber_b_co2_storage:    '17',
    suit_pressure_co2:         '18',
    suit_pressure_other:       '19',
    suit_pressure_oxy:         '20',
    suit_pressure_total:       '21',
    temperature:               '22',
}

///// ROVER /////////////////////////////////////////////////////////////

interface RoverData {
    rover: {
        posx: number, 
        posy: number, 
        qr_id: number,
    }
}

// EXPORT /////////////////////////////////////////////////////////////

export type { 
    GeoJSON, 
    ChatHistoryType,
    ChatItemType,
    GeoJSONFeature, 
    WarningData,
    TodoItems,
    TimerType,
    Spec,
    SpecData,
    SpecItem,
    EVASpecItems, 
    Biometrics,
    BiometricData,
    RoverData,
}

export { biometricIDMap }
