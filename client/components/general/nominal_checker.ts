import { fetchWithParams, fetchWithoutParams } from "@/api/fetchServer"
import { Biometrics, WarningData } from "@/hooks/types"

const higher = (value: number, upper: number) => { return (value < upper) }
const lower = (value : number, lower: number) => { return (value > lower) }


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

const checkNominal = (evaTelemetry: Biometrics["telemetry"]["eva"]) => { 

    if (higher(evaTelemetry.batt_time_left, 10800)) {
        raiseAlert(`Battery Time Left is too high! Current: ${evaTelemetry.batt_time_left}, Max: ${10800}`)
    } else if (lower(evaTelemetry.batt_time_left, 3600)) {
        raiseAlert(`Battery Time Left is too low! Current: ${evaTelemetry.batt_time_left}, Min: ${3600}`)
    }

    if (higher(evaTelemetry.oxy_pri_storage, 100)) {
        raiseAlert(`Primary Oxygen Storage is too high! Current: ${evaTelemetry.oxy_pri_storage}, Max: ${100}`)
    } else if (lower(evaTelemetry.oxy_pri_storage, 20)) {
        raiseAlert(`Primary Oxygen Storage is too low! Current: ${evaTelemetry.oxy_pri_storage}, Min: ${20}`)
    }

    if (higher(evaTelemetry.oxy_pri_pressure, 3000)) {
        raiseAlert(`Primary Oxygen Pressure is too high! Current: ${evaTelemetry.oxy_sec_storage}, Max: ${3000}`)
    } else if (lower(evaTelemetry.oxy_pri_pressure, 600)) {
        raiseAlert(`Primary Oxygen Pressure is too low! Current: ${evaTelemetry.oxy_sec_storage}, Min: ${600}`)
    }

    if (higher(evaTelemetry.oxy_sec_storage, 100)) {
        raiseAlert(`Secondary Oxygen Storage is too high! Current: ${evaTelemetry.oxy_sec_storage}, Max: ${100}`)
    } else if (lower(evaTelemetry.oxy_sec_storage, 20)) {
        raiseAlert(`Secondary Oxygen Storage is too low! Current: ${evaTelemetry.oxy_sec_storage}, Min: ${20}`)
    }

    if (higher(evaTelemetry.oxy_sec_pressure, 3000)) {
        raiseAlert(`Secondary Oxygen Pressure is too high! Current: ${evaTelemetry.oxy_sec_storage}, Max: ${3000}`)
    } else if (lower(evaTelemetry.oxy_sec_pressure, 600)) {
        raiseAlert(`Secondary Oxygen Pressure is too low! Current: ${evaTelemetry.oxy_sec_storage}, Min: ${600}`)
    }




    
    return; 
}


export { checkNominal };
