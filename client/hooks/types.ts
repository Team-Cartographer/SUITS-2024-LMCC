
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

interface PanicData {
    infoWarning: string, 
    todoItems: [string, string][], 
    isWarning: boolean,
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
    batt_time_left: number;
    co2_production: number;
    coolant_gas_pressure: number;
    coolant_liquid_pressure: number;
    coolant_m1: number;
    fan_pri_rpm: number;
    fan_sec_rpm: number;
    heart_rate: number;
    helmet_pressure_co2: number;
    oxy_consumption: number;
    oxy_pri_pressure: number;
    oxy_pri_storage: number;
    oxy_sec_pressure: number;
    oxy_sec_storage: number;
    oxy_time_left: number;
    scrubber_a_co2_storage: number;
    scrubber_b_co2_storage: number;
    suit_pressure_co2: number;
    suit_pressure_other: number;
    suit_pressure_oxy: number;
    suit_pressure_total: number;
    temperature: number;
}

interface Biometric {
    telemetry: {
        [eva: string]: BiometricData;
    }
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
    GeoJSONFeature, 
    PanicData, 
    TimerType,
    Spec,
    SpecData,
    SpecItem,
    EVASpecItems, 
    Biometric,
    BiometricData,
    RoverData,
}
