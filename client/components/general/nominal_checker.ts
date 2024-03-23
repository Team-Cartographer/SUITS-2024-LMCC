import { fetchWithParams, fetchWithoutParams } from "@/api/fetchServer"
import { Biometrics, WarningData } from "@/hooks/types"

const higher = (value: number, upper: number) => { return (value > upper) }
const lower = (value : number, lower: number) => { return (value < lower) }
const isntNominal = (value: number, nom: number) => { return (value !== nom) }

/*
 * All values here via: 
 * https://github.com/SUITS-Techteam/TSS_2024/blob/main/SUITS_TelemetryValueRanges.pdf
 */

const raiseAlert = async (message: string) => {
    try {
        await fetchWithParams<WarningData>(
          `api/v0`,
          {
            notif: 'update_warning',
            infoWarning: message,
          });
      } catch (err) {
        const error = err as Error;
        console.error("Error updating Panic:", error) 
      }
}

const checkNominal = (evaTelemetry: Biometrics["telemetry"]["eva"], evaNumber: number) => { 

    if (higher(evaTelemetry.batt_time_left, 10800)) {
        raiseAlert(`EVA ${evaNumber}: Battery Time Left is too high! Current: ${evaTelemetry.batt_time_left}, Max: ${10800}`)
    } else if (lower(evaTelemetry.batt_time_left, 3600)) {
        raiseAlert(`EVA ${evaNumber}: Battery Time Left is too low! Current: ${evaTelemetry.batt_time_left}, Min: ${3600}`)
    }

    if (higher(evaTelemetry.oxy_pri_storage, 100)) {
        raiseAlert(`EVA ${evaNumber}: Primary Oxygen Storage is too high! Current: ${evaTelemetry.oxy_pri_storage}, Max: ${100}`)
    } else if (lower(evaTelemetry.oxy_pri_storage, 20)) {
        raiseAlert(`EVA ${evaNumber}: Primary Oxygen Storage is too low! Current: ${evaTelemetry.oxy_pri_storage}, Min: ${20}`)
    }

    if (higher(evaTelemetry.oxy_pri_pressure, 3000)) {
        raiseAlert(`EVA ${evaNumber}: Primary Oxygen Pressure is too high! Current: ${evaTelemetry.oxy_sec_storage}, Max: ${3000}`)
    } else if (lower(evaTelemetry.oxy_pri_pressure, 600)) {
        raiseAlert(`EVA ${evaNumber}: Primary Oxygen Pressure is too low! Current: ${evaTelemetry.oxy_sec_storage}, Min: ${600}`)
    }

    if (higher(evaTelemetry.oxy_sec_storage, 100)) {
        raiseAlert(`EVA ${evaNumber}: Secondary Oxygen Storage is too high! Current: ${evaTelemetry.oxy_sec_storage}, Max: ${100}`)
    } else if (lower(evaTelemetry.oxy_sec_storage, 20)) {
        raiseAlert(`EVA ${evaNumber}: Secondary Oxygen Storage is too low! Current: ${evaTelemetry.oxy_sec_storage}, Min: ${20}`)
    }

    if (higher(evaTelemetry.oxy_sec_pressure, 3000)) {
        raiseAlert(`EVA ${evaNumber}: Secondary Oxygen Pressure is too high! Current: ${evaTelemetry.oxy_sec_storage}, Max: ${3000}`)
    } else if (lower(evaTelemetry.oxy_sec_pressure, 600)) {
        raiseAlert(`EVA ${evaNumber}: Secondary Oxygen Pressure is too low! Current: ${evaTelemetry.oxy_sec_storage}, Min: ${600}`)
    }

    if (higher(evaTelemetry.coolant_ml, 100)) { 
        raiseAlert(`EVA ${evaNumber}: Coolant Storage is too high! Current: ${evaTelemetry.coolant_ml}, Max: ${100}`)
    } else if (lower(evaTelemetry.coolant_ml, 80)) {
        raiseAlert(`EVA ${evaNumber}: Coolant Storage is too low! Current: ${evaTelemetry.coolant_ml}, Min: ${80}`)
    } else if (isntNominal(evaTelemetry.coolant_ml, 100)) {
        raiseAlert(`EVA ${evaNumber}: Coolant Storage is not nominal! Current: ${evaTelemetry.coolant_ml}, Nominal: ${90}`)
    }

    if (higher(evaTelemetry.coolant_liquid_pressure, 700)) { 
        raiseAlert(`EVA ${evaNumber}: Coolant Liquid Pressure is too high! Current: ${evaTelemetry.coolant_liquid_pressure}, Max: ${700}`)
    } else if (lower(evaTelemetry.coolant_liquid_pressure, 100)) {
        raiseAlert(`EVA ${evaNumber}: Coolant Liquid Pressure is too low! Current: ${evaTelemetry.coolant_liquid_pressure}, Min: ${100}`)
    } else if (isntNominal(evaTelemetry.coolant_liquid_pressure, 500)) {
        raiseAlert(`EVA ${evaNumber}: Coolant Liquid Pressure is not nominal! Current: ${evaTelemetry.coolant_liquid_pressure}, Nominal: ${500}`)
    }

    if (higher(evaTelemetry.coolant_gas_pressure, 700)) {
        raiseAlert(`EVA ${evaNumber}: Coolant Gas Pressure is too high! Current: ${evaTelemetry.coolant_gas_pressure}, Max: ${700}`)
    } else if (lower(evaTelemetry.coolant_gas_pressure, 0)) { 
        raiseAlert(`EVA ${evaNumber}: Coolant Gas Pressure is too low! Current: ${evaTelemetry.coolant_gas_pressure}, Min: ${0}`)
    } else if (isntNominal(evaTelemetry.coolant_gas_pressure, 0)) {
        raiseAlert(`EVA ${evaNumber}: Coolant Gas Pressure is not nominal! Current: ${evaTelemetry.coolant_gas_pressure}, Nominal: ${0}`)
    }
    
    return; 
}


export { checkNominal };
