
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
    eva: string;
    bpm: string;
    temp: string;
    breathing_rate: string;
    blood_pressure: [string, string]
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
    BiometricData,
}