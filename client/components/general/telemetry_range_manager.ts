import { fetchWithParams, fetchWithoutParams } from "@/api/fetchServer"
import { Biometrics, TodoItems, WarningData } from "@/hooks/types"

const higher = (value: number, upper: number): boolean => { return (value > upper) }
const lower = (value : number, lower: number): boolean => { return (value < lower) }
const isntNominal = (value: number, nom: number): boolean => { return (value !== nom) }
const isSubset = <T>(subset: T[], set: T[]): boolean => { return subset.every(element => set.includes(element)); }


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


const addTodoItems = async (items: [string, string][]) => {
    try {
        const todoItems = await fetchWithoutParams<TodoItems>("api/v0?get=todo");

        if (isSubset(items, todoItems?.todoItems || [])) { return; }

        await fetchWithParams<WarningData>(
          `api/v0`,
          {
            notif: 'update_todo',
            todoItems: [...(todoItems?.todoItems || []), ...items],
          });
      } catch (err) {
        const error = err as Error;
        console.error("Error updating Todo:", error) 
      }
}



const checkBiometricsHelper = (
    value: number, 
    upper: number, 
    _lower: number, 
    todoItemHigh: string, 
    todoItemLow: string, 
    todoItemNom: string, 
    evaNumber: number,
    nom?: number,
) => {
    if (higher(value, upper)) { 
        raiseAlert(todoItemHigh)
    } else if (lower(value, _lower)) { 
        raiseAlert(todoItemLow)
    } 
    
    if (nom && isntNominal(value, nom)) {
        raiseAlert(todoItemNom)
    }
    return;
}

const checkNominalBiometrics = (evaTelemetry: Biometrics["telemetry"]["eva"], evaNumber: number) => {
    
    checkBiometricsHelper(
        evaTelemetry.heart_rate, 160, 50,
        `Alert EVA ${evaNumber} that their heart rate is too high!`,
        `Alert EVA ${evaNumber} that their heart rate is too low!`,
        `Alert EVA ${evaNumber} that their heart rate is not nominal! (Nominal is ${90})`,
        evaNumber, 90);

    checkBiometricsHelper(
        evaTelemetry.oxy_consumption, 0.15, 0.05,
        `Alert EVA ${evaNumber} that their oxygen consumption is too high!`,
        `Alert EVA ${evaNumber} that their oxygen consumption is too low!`,
        `Alert EVA ${evaNumber} that their oxygen consumption is not nominal! (Nominal is ${0.1})`,
        evaNumber, 0.1);

    checkBiometricsHelper(
        evaTelemetry.co2_production, 0.15, 0.05, 
        `Alert EVA ${evaNumber} that their Co2 production is too high!`,
        `Alert EVA ${evaNumber} that their Co2 production is too low!`,
        `Alert EVA ${evaNumber} that their Co2 production is not nominal! (Nominal is ${0.1})`,
        evaNumber, 0.1);

    checkBiometricsHelper(
        evaTelemetry.oxy_consumption, 0.15, 0.05, 
        `Alert EVA ${evaNumber} that their oxygen consumption is too high!`, 
        `Alert EVA ${evaNumber} that their oxygen consumption is too low!`,
        `Alert EVA ${evaNumber} that their oxygen consumption is not nominal! (Nominal is ${0.1})`,
        evaNumber, 0.1);

    checkBiometricsHelper(
        evaTelemetry.suit_pressure_oxy, 4.1, 3.5, 
        `The primary oxygen tank is supplying too much oxygen, so EVA ${evaNumber} must swap to the secondary O2 Tank via the O2 Switch on the DCU.`,
        `The primary oxygen tank is supplying too little oxygen, so EVA ${evaNumber} must swap to the secondary O2 Tank via the O2 Switch on the DCU.`,
        `The primary oxygen tank is not supplying the correct amount of oxygen, so EVA ${evaNumber} must swap to the secondary O2 Tank via the O2 Switch on the DCU. (Nominal is 4.0psi)`,
        evaNumber, 4.0);

    checkBiometricsHelper(
        evaTelemetry.suit_pressure_co2, 0.1, 0,
        `EVA ${evaNumber}'s Co2 Scrubber has filled up and must be vented, via the carbon dioxide switch on the DCU`,
        `EVA ${evaNumber}'s Co2 Scrubber has filled up and must be vented, via the carbon dioxide switch on the DCU`,
        `EVA ${evaNumber}'s Co2 Scrubber has filled up and must be vented, via the carbon dioxide switch on the DCU`,
        evaNumber, 0); 

    checkBiometricsHelper(
        evaTelemetry.suit_pressure_other, 0.5, 0, 
        `The Partial Pressure of EVA ${evaNumber}'s Suit should be zero after the *decompress sequence*. Alert the user if this value is too high only after that step.`,
        `The Partial Pressure of EVA ${evaNumber}'s Suit should be zero after the *decompress sequence*. Alert the user if this value is too high only after that step.`,
        `The Partial Pressure of EVA ${evaNumber}'s Suit should be zero after the *decompress sequence*. Alert the user if this value is too high only after that step.`,
        evaNumber, 0); 

    checkBiometricsHelper(
        evaTelemetry.suit_pressure_total, 4.5, 3.5, 
        `EVA ${evaNumber}'s Total Suit Pressure being high alludes to a problem with either the O2 Tank or Scrubber. Review Values/Follow those Procedures`,
        `EVA ${evaNumber}'s Total Suit Pressure being low alludes to a problem with either the O2 Tank or Scrubber. Review Values/Follow those Procedures`,
        `EVA ${evaNumber}'s Total Suit Pressure being not nominal alludes to a problem with either the O2 Tank or Scrubber. Review Values/Follow those Procedures (Nominal: 4.0psi)`,
        evaNumber, 4.0);   

    checkBiometricsHelper(
        evaTelemetry.fan_pri_rpm, 30000, 20000, 
        `EVA ${evaNumber}'s Primary Fan is spinning too fast. Swap to the secondary fan using the DCU Fan Switch`, 
        `EVA ${evaNumber}'s Primary Fan is spinning too slow. Swap to the secondary fan using the DCU Fan Switch`,
        `EVA ${evaNumber}'s Primary Fan is not spinning at the correct speed (30000 RPM). Swap to the secondary fan using the DCU Fan Switch`,
        evaNumber, 30000);

    checkBiometricsHelper(
        evaTelemetry.fan_sec_rpm, 30000, 20000, 
        `EVA ${evaNumber}'s Secondary Fan is spinning too fast. Swap to the other fan using the DCU Fan Switch`, 
        `EVA ${evaNumber}'s Secondary Fan is spinning too slow. Swap to the other fan using the DCU Fan Switch`,
        `EVA ${evaNumber}'s Secondary Fan is not spinning at the correct speed (30000 RPM). Swap to the other fan using the DCU Fan Switch`,
        evaNumber, 30000);

    checkBiometricsHelper(
        evaTelemetry.scrubber_a_co2_storage, 60, 0, 
        `EVA ${evaNumber}'s Scrubber A is full and must be vented. Use the CO2 Vent Switch on the DCU to vent the scrubber.`,
        "This should never be encountered",
        "This should never be encountered",
        evaNumber);

    checkBiometricsHelper(
        evaTelemetry.scrubber_b_co2_storage, 60, 0, 
        `EVA ${evaNumber}'s Scrubber B is full and must be vented. Use the CO2 Vent Switch on the DCU to vent the scrubber.`,
        "This should never be encountered",
        "This should never be encountered",
        evaNumber);

    checkBiometricsHelper(
        evaTelemetry.temperature, 90, 50, 
        `EVA ${evaNumber}'s temperature is too high! Alert him to slow down.`,
        `EVA ${evaNumber}'s temperature is too low! Alert him to warm up.`,
        `EVA ${evaNumber}'s temperature is not nominal! Alert him to adjust to 70 degrees.`,
        evaNumber); //FIXME: Apparently Nominal should be 70, but with normal fluctuation that makes no sense);

    return; 
}





const checkOtherHelper = (value: number, upper: number, _lower: number, val_type: string, evaNumber: number, nom?: number) => {
    if (higher(value, upper)) {
        raiseAlert(`EVA ${evaNumber}: ${val_type} is too high! Current: ${value}, Max: ${upper}`)
    } else if (lower(value, _lower)) {
        raiseAlert(`EVA ${evaNumber}: ${val_type} is too low! Current: ${value}, Min: ${_lower}`)
    }
    if (nom && isntNominal(value, nom)) {
        raiseAlert(`EVA ${evaNumber}: ${val_type} is not nominal! Current: ${value}, Nominal: ${nom}`)
    }
}

const checkNominalOther = (evaTelemetry: Biometrics["telemetry"]["eva"], evaNumber: number) => { 

    checkOtherHelper(evaTelemetry.batt_time_left, 10800, 3600, "Battery Time Left", evaNumber);
    checkOtherHelper(evaTelemetry.oxy_pri_storage, 100, 20, "Primary Oxygen Storage", evaNumber);
    checkOtherHelper(evaTelemetry.oxy_pri_pressure, 3000, 600, "Primary Oxygen Pressure", evaNumber);
    checkOtherHelper(evaTelemetry.oxy_sec_storage, 100, 20, "Secondary Oxygen Storage", evaNumber);
    checkOtherHelper(evaTelemetry.oxy_sec_pressure, 3000, 600, "Secondary Oxygen Pressure", evaNumber);
    checkOtherHelper(evaTelemetry.oxy_time_left, 10800, 3600, "Oxygen Time Left", evaNumber);
    checkOtherHelper(evaTelemetry.coolant_ml, 100, 80, "Coolant Storage", evaNumber, 90);
    checkOtherHelper(evaTelemetry.coolant_liquid_pressure, 700, 100, "Coolant Liquid Pressure", evaNumber, 500);
    checkOtherHelper(evaTelemetry.coolant_gas_pressure, 700, 0, "Coolant Gas Pressure", evaNumber, 0);
    
    return; 
}


export { checkNominalOther, checkNominalBiometrics };
