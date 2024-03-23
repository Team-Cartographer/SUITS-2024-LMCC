import { fetchWithParams } from "@/api/fetchServer"
import { Biometrics, WarningData, biometricIDMap as IDs } from "@/hooks/types";

const higher = (value: number, upper: number): boolean => { return (value > upper) }
const lower = (value : number, lower: number): boolean => { return (value < lower) }
const isntNominal = (value: number, nom: number): boolean => { return (value !== nom) }

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


const checkBiometricsHelper = (
    value: number, 
    upper: number, 
    _lower: number, 
    todoItemHigh: string, 
    todoItemLow: string, 
    todoItemNom: string, 
    evaNumber: number,
    id: string, 
    nom?: number,
): string => {
    if (higher(value, upper)) { 
        raiseAlert(todoItemHigh)
        return id;
    } else if (lower(value, _lower)) { 
        raiseAlert(todoItemLow)
        return id;
    } 
    
    // FIXME: Add back as necessary 
    // if (nom && isntNominal(value, nom)) {
    //     raiseAlert(todoItemNom)
    //     return id;
    // }
    
    return '0';
}


const checkOtherHelper = (
    value: number, upper: number, _lower: number, val_type: string, evaNumber: number, id: string, nom?: number): string => {
    if (higher(value, upper)) {
        raiseAlert(`EVA ${evaNumber}: ${val_type} is too high! Current: ${value}, Max: ${upper}`)
        return id 
    } else if (lower(value, _lower)) {
        raiseAlert(`EVA ${evaNumber}: ${val_type} is too low! Current: ${value}, Min: ${_lower}`)
        return id 
    }

    // FIXME: Add back as necessary 
    // if (nom && isntNominal(value, nom)) {
    //     raiseAlert(`EVA ${evaNumber}: ${val_type} is not nominal! Current: ${value}, Nominal: ${nom}`)
    //     return id
    // }
    return '0'
}

const checkNominalValues = (evaTelemetry: Biometrics["telemetry"]["eva"], evaNumber: number): string[] => { 
    const criticalIds = [] as string[];
    let out = '0';

    out = checkOtherHelper(evaTelemetry.batt_time_left, 10800, 3600, "Battery Time Left", evaNumber, IDs.batt_time_left); 
    if (out !== '0') criticalIds.push(out);

    out = checkOtherHelper(evaTelemetry.oxy_pri_storage, 100, 20, "Primary Oxygen Storage", evaNumber, IDs.oxy_pri_storage);
    if (out !== '0') criticalIds.push(out);

    out = checkOtherHelper(evaTelemetry.oxy_pri_pressure, 3000, 600, "Primary Oxygen Pressure", evaNumber, IDs.oxy_pri_pressure);
    if (out !== '0') criticalIds.push(out);

    out = checkOtherHelper(evaTelemetry.oxy_sec_storage, 100, 20, "Secondary Oxygen Storage", evaNumber, IDs.oxy_sec_storage);
    if (out !== '0') criticalIds.push(out);

    out = checkOtherHelper(evaTelemetry.oxy_sec_pressure, 3000, 600, "Secondary Oxygen Pressure", evaNumber, IDs.oxy_sec_pressure);
    if (out !== '0') criticalIds.push(out);

    out = checkOtherHelper(evaTelemetry.oxy_time_left, 10800, 3600, "Oxygen Time Left", evaNumber, IDs.oxy_time_left);
    if (out !== '0') criticalIds.push(out);

    out = checkOtherHelper(evaTelemetry.coolant_ml, 100, 80, "Coolant Storage", evaNumber, IDs.coolant_ml, 90);
    if (out !== '0') criticalIds.push(out);

    out = checkOtherHelper(evaTelemetry.coolant_liquid_pressure, 700, 100, "Coolant Liquid Pressure", evaNumber, IDs.coolant_liquid_pressure, 500);
    if (out !== '0') criticalIds.push(out);

    out = checkOtherHelper(evaTelemetry.coolant_gas_pressure, 700, 0, "Coolant Gas Pressure", evaNumber, IDs.coolant_gas_pressure, 0);
    if (out !== '0') criticalIds.push(out);

    out = checkBiometricsHelper(
        evaTelemetry.heart_rate, 160, 50,
        `Alert EVA ${evaNumber} that their heart rate is too high!`,
        `Alert EVA ${evaNumber} that their heart rate is too low!`,
        `Alert EVA ${evaNumber} that their heart rate is not nominal! (Nominal is ${90})`,
        evaNumber, IDs.heart_rate, 90);
        if (out !== '0') criticalIds.push(out);


    out = checkBiometricsHelper(
        evaTelemetry.oxy_consumption, 0.15, 0.05,
        `Alert EVA ${evaNumber} that their oxygen consumption is too high!`,
        `Alert EVA ${evaNumber} that their oxygen consumption is too low!`,
        `Alert EVA ${evaNumber} that their oxygen consumption is not nominal! (Nominal is ${0.1})`,
        evaNumber, IDs.oxy_consumption, 0.1);
        if (out !== '0') criticalIds.push(out);

    out = checkBiometricsHelper(
        evaTelemetry.co2_production, 0.15, 0.05, 
        `Alert EVA ${evaNumber} that their Co2 production is too high!`,
        `Alert EVA ${evaNumber} that their Co2 production is too low!`,
        `Alert EVA ${evaNumber} that their Co2 production is not nominal! (Nominal is ${0.1})`,
        evaNumber, IDs.co2_production, 0.1);
        if (out !== '0') criticalIds.push(out);
    

    out = checkBiometricsHelper(
        evaTelemetry.suit_pressure_oxy, 4.1, 3.5, 
        `The primary oxygen tank is supplying too much oxygen, so EVA ${evaNumber} must swap to the secondary O2 Tank via the O2 Switch on the DCU.`,
        `The primary oxygen tank is supplying too little oxygen, so EVA ${evaNumber} must swap to the secondary O2 Tank via the O2 Switch on the DCU.`,
        `The primary oxygen tank is not supplying the correct amount of oxygen, so EVA ${evaNumber} must swap to the secondary O2 Tank via the O2 Switch on the DCU. (Nominal is 4.0psi)`,
        evaNumber, IDs.suit_pressure_oxy, 4.0);
        if (out !== '0') criticalIds.push(out);

    out = checkBiometricsHelper(
        evaTelemetry.suit_pressure_co2, 0.1, 0,
        `EVA ${evaNumber}'s Co2 Scrubber has filled up and must be vented, via the carbon dioxide switch on the DCU`,
        `EVA ${evaNumber}'s Co2 Scrubber has filled up and must be vented, via the carbon dioxide switch on the DCU`,
        `EVA ${evaNumber}'s Co2 Scrubber has filled up and must be vented, via the carbon dioxide switch on the DCU`,
        evaNumber, IDs.suit_pressure_co2, 0); 
        if (out !== '0') criticalIds.push(out);

    out = checkBiometricsHelper(
        evaTelemetry.suit_pressure_other, 0.5, 0, 
        `The Partial Pressure of EVA ${evaNumber}'s Suit should be zero after the *decompress sequence*. Alert the user if this value is too high only after that step.`,
        `The Partial Pressure of EVA ${evaNumber}'s Suit should be zero after the *decompress sequence*. Alert the user if this value is too high only after that step.`,
        `The Partial Pressure of EVA ${evaNumber}'s Suit should be zero after the *decompress sequence*. Alert the user if this value is too high only after that step.`,
        evaNumber, IDs.suit_pressure_other, 0); 
        if (out !== '0') criticalIds.push(out);

    out = checkBiometricsHelper(
        evaTelemetry.suit_pressure_total, 4.5, 3.5, 
        `EVA ${evaNumber}'s Total Suit Pressure being high alludes to a problem with either the O2 Tank or Scrubber. Review Values/Follow those Procedures`,
        `EVA ${evaNumber}'s Total Suit Pressure being low alludes to a problem with either the O2 Tank or Scrubber. Review Values/Follow those Procedures`,
        `EVA ${evaNumber}'s Total Suit Pressure being not nominal alludes to a problem with either the O2 Tank or Scrubber. Review Values/Follow those Procedures (Nominal: 4.0psi)`,
        evaNumber, IDs.suit_pressure_total, 4.0);   
        if (out !== '0') criticalIds.push(out);

    out = checkBiometricsHelper(
        evaTelemetry.fan_pri_rpm, 30000, 20000, 
        `EVA ${evaNumber}'s Primary Fan is spinning too fast. Swap to the secondary fan using the DCU Fan Switch`, 
        `EVA ${evaNumber}'s Primary Fan is spinning too slow. Swap to the secondary fan using the DCU Fan Switch`,
        `EVA ${evaNumber}'s Primary Fan is not spinning at the correct speed (30000 RPM). Swap to the secondary fan using the DCU Fan Switch`,
        evaNumber, IDs.fan_pri_rpm, 30000);
        if (out !== '0') criticalIds.push(out);

    out = checkBiometricsHelper(
        evaTelemetry.fan_sec_rpm, 30000, 20000, 
        `EVA ${evaNumber}'s Secondary Fan is spinning too fast. Swap to the other fan using the DCU Fan Switch`, 
        `EVA ${evaNumber}'s Secondary Fan is spinning too slow. Swap to the other fan using the DCU Fan Switch`,
        `EVA ${evaNumber}'s Secondary Fan is not spinning at the correct speed (30000 RPM). Swap to the other fan using the DCU Fan Switch`,
        evaNumber, IDs.fan_sec_rpm, 30000);
        if (out !== '0') criticalIds.push(out);

    out = checkBiometricsHelper(
        evaTelemetry.scrubber_a_co2_storage, 60, 0, 
        `EVA ${evaNumber}'s Scrubber A is full and must be vented. Use the CO2 Vent Switch on the DCU to vent the scrubber.`,
        "This should never be encountered",
        "This should never be encountered",
        evaNumber, IDs.scrubber_a_co2_storage);
        if (out !== '0') criticalIds.push(out);

    out = checkBiometricsHelper(
        evaTelemetry.scrubber_b_co2_storage, 60, 0, 
        `EVA ${evaNumber}'s Scrubber B is full and must be vented. Use the CO2 Vent Switch on the DCU to vent the scrubber.`,
        "This should never be encountered",
        "This should never be encountered",
        evaNumber, IDs.scrubber_b_co2_storage);
        if (out !== '0') criticalIds.push(out);

    out = checkBiometricsHelper(
        evaTelemetry.temperature, 90, 50, 
        `EVA ${evaNumber}'s temperature is too high! Alert him to slow down.`,
        `EVA ${evaNumber}'s temperature is too low! Alert him to warm up.`,
        `EVA ${evaNumber}'s temperature is not nominal! Alert him to adjust to 70 degrees.`,
        evaNumber, IDs.temperature); //FIXME: Apparently Nominal should be 70, but with normal fluctuation that makes no sense... 70);
        if (out !== '0') criticalIds.push(out);


    return criticalIds; 
}


const EVADataMap = (evaData: Biometrics, evaNumber: number, criticalIDs: string[]) => { 
    const setClassName = (id: string): string => { 
        if (criticalIDs.includes(id)) {
            return 'bg-red-900 p-1 rounded-xl'
        }
        return '' 
    }

    const evaTelemetry = evaData.telemetry.eva
    return(
        <div className="overflow-scroll flex flex-col gap-y-3 text-sm">
            <div className="flex flex-row gap-x-3">
                <div className="flex flex-col gap-y-3">
                    <h1 className="font-bold"><span className="italic pr-1">{`EVA ${evaNumber}`}</span> Suit Resources {'[Lower, Upper, Nominal]'}</h1>
                    <li className={setClassName(IDs.batt_time_left)}>Batt. Time Left:  {evaTelemetry.batt_time_left.toFixed(2)}sec {'[3,600, 10,800]'}</li>
                    <li className={setClassName(IDs.oxy_pri_storage)}>O2 Sec. Stor:  {evaTelemetry.oxy_pri_storage.toFixed(2)}% {'[20, 100]'}</li>
                    <li className={setClassName(IDs.oxy_sec_pressure)}>O2 Sec. Stor: {evaTelemetry.oxy_sec_storage.toFixed(2)}% {'[20, 100]'}</li>
                    <li className={setClassName(IDs.oxy_pri_pressure)}>O2 Pri. Pressure: {evaTelemetry.oxy_pri_pressure.toFixed(2)}psi {'[600, 3,000]'}</li>
                    <li className={setClassName(IDs.oxy_sec_pressure)}>O2 Sec. Pressure: {evaTelemetry.oxy_sec_pressure.toFixed(2)}psi {'[600, 3,000]'}</li>
                    <li className={setClassName(IDs.oxy_time_left)}>O2 Time Left {evaTelemetry.oxy_time_left.toFixed(2)}sec {'[3,600, 21,600]'}</li>
                    <li className={setClassName(IDs.coolant_ml)}>Coolant Stor: {evaTelemetry.coolant_ml.toFixed(2)}% {'[80, 100, 100]'}</li>
                </div>

                <div className="flex flex-col gap-y-3">
                    <h1 className="font-bold">Suit Atmosphere</h1>
                    <li className={setClassName(IDs.heart_rate)}>Heart Rate: {evaTelemetry.heart_rate.toFixed(2)}bpm {'[50, 160, 90]'}</li>
                    <li className={setClassName(IDs.oxy_consumption)}>O2 Consumption: {evaTelemetry.oxy_consumption.toFixed(2)}psi/min {'[0.05, 0.15, 0.1]'}</li>
                    <li className={setClassName(IDs.suit_pressure_oxy)}>O2 Suit Pressure: {evaTelemetry.suit_pressure_oxy.toFixed(2)}psi/min {'[0.05, 0.15, 0.1]'}</li>
                    <li className={setClassName(IDs.suit_pressure_co2)}>CO2 Production: {evaTelemetry.co2_production.toFixed(2)}psi {'[3.5, 4.1, 4.0]'}</li>
                    <li className={setClassName(IDs.suit_pressure_other)}>Other Suit Pressure: {evaTelemetry.suit_pressure_other.toFixed(2)}psi {'0, 0.1, 0]'}</li>
                    <li className={setClassName(IDs.suit_pressure_total)}>Total Suit Pressure: {evaTelemetry.suit_pressure_total.toFixed(2)}psi {'[0, 0.5, 0]'}</li>
                    <li className={setClassName(IDs.helmet_pressure_co2)}>Helmet Pressure Co2: {evaTelemetry.helmet_pressure_co2.toFixed(2)}psi {'[3.5, 4.5, 4.0]'}</li>
                </div>
            </div>

            <div className="flex flex-row gap-x-3 pt-4">
                <div className="flex flex-col gap-y-3">
                    <h1 className="font-bold">Suit Helmet Fan</h1>
                    <li className={setClassName(IDs.fan_pri_rpm)}>Primary Fan RPM: {evaTelemetry.fan_pri_rpm.toFixed(2)} RPM {'[20k, 30k, 30k]'}</li>
                    <li className={setClassName(IDs.fan_sec_rpm)}>Sec. Fan RPM: {evaTelemetry.fan_sec_rpm.toFixed(2)} RPM {'[20k, 30k, 30k]'}</li>
                </div>

                <div className="flex flex-col gap-y-3">
                    <h1 className="font-bold">Suit Co2 Scrubbers</h1>
                    <li className={setClassName(IDs.scrubber_a_co2_storage)}>Scrubber A Co2 Stor: {evaTelemetry.scrubber_a_co2_storage.toFixed(2)}% {'[0, 60]'}</li>
                    <li className={setClassName(IDs.scrubber_b_co2_storage)}>Scrubber B Co2 Stor: {evaTelemetry.scrubber_b_co2_storage.toFixed(2)}% {'[0, 60]'}</li>
                </div>
            </div>

            <div className="max-w-[400px] flex flex-col gap-y-3">
            <h1 className="font-bold pt-4">Suit Temperature</h1>
            <li className={setClassName(IDs.temperature)}>Temperature: {evaTelemetry.temperature.toFixed(2)} *F {'[50, 90, 70]'}</li>
            <li className={setClassName(IDs.coolant_liquid_pressure)}>Coolant Liquid Pres: {evaTelemetry.coolant_liquid_pressure.toFixed(2)} psi {'[100, 700, 500]'}</li>
            <li className={setClassName(IDs.coolant_gas_pressure)}>Coolant Gas Pres: {evaTelemetry.coolant_gas_pressure.toFixed(2)} psi {'[0, 700, 0]'}</li>
            </div>
        </div>
    )
}




export { checkNominalValues, EVADataMap };
