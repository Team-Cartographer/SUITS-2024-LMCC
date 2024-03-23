import { useState } from "react";
import { useNetwork } from "@/hooks/context/network-context";
import { Button } from "../ui/button";
import { Biometrics } from "@/hooks/types";
import dynamic from "next/dynamic";
import { checkNominalOther } from "./telemetry_range_manager";

const NoSSR_GeoSampler = dynamic(() => import('@/components/hmd_link/geo_sampling'), { ssr: false })

interface WindowNames {
    [key: string]: JSX.Element;
}


const EVADataMap = (evaData: Biometrics, evaNumber: number) => { 
    const evaTelemetry = evaData.telemetry.eva
    return(
        <div className="overflow-scroll flex flex-col gap-y-3">
            <div className="flex flex-row gap-x-3">
                <div className="flex flex-col gap-y-3">
                    <h1 className="font-bold"><span className="italic pr-1">{`EVA ${evaNumber}`}</span> Suit Resources</h1>
                    <li>Batt. Time Left:  {evaTelemetry.batt_time_left.toFixed(2)}sec {'[3,600, 10,800]'}</li>
                    <li>O2 Sec. Stor:  {evaTelemetry.oxy_pri_storage.toFixed(2)}% {'[20, 100]'}</li>
                    <li>O2 Sec. Stor: {evaTelemetry.oxy_sec_storage.toFixed(2)}% {'[20, 100]'}</li>
                    <li>O2 Pri. Pressure: {evaTelemetry.oxy_pri_pressure.toFixed(2)}psi {'[600, 3,000]'}</li>
                    <li>O2 Sec. Pressure: {evaTelemetry.oxy_sec_pressure.toFixed(2)}psi {'[600, 3,000]'}</li>
                    <li>O2 Time Left {evaTelemetry.oxy_time_left.toFixed(2)}sec {'[3,600, 21,600]'}</li>
                    <li>Coolant Stor: {evaTelemetry.coolant_ml.toFixed(2)}% {'[80, 100, 100]'}</li>
                </div>

                <div className="flex flex-col gap-y-3">
                    <h1 className="font-bold">Suit Atmosphere</h1>
                    <li>Heart Rate: {evaTelemetry.heart_rate.toFixed(2)}bpm {'[50, 160, 90]'}</li>
                    <li>O2 Consumption: {evaTelemetry.oxy_consumption.toFixed(2)}psi/min {'[0.05, 0.15, 0.1]'}</li>
                    <li>O2 Suit Pressure: {evaTelemetry.suit_pressure_oxy.toFixed(2)}psi/min {'[0.05, 0.15, 0.1]'}</li>
                    <li>CO2 Production: {evaTelemetry.co2_production.toFixed(2)}psi {'[3.5, 4.1, 4.0]'}</li>
                    <li>Other Suit Pressure: {evaTelemetry.suit_pressure_other.toFixed(2)}psi {'0, 0.1, 0]'}</li>
                    <li>Total Suit Pressure: {evaTelemetry.suit_pressure_total.toFixed(2)}psi {'[0, 0.5, 0]'}</li>
                    <li>Helmet Pressure Co2: {evaTelemetry.helmet_pressure_co2.toFixed(2)}psi {'[3.5, 4.5, 4.0]'}</li>
                </div>
            </div>

            <div className="flex flex-row gap-x-3 pt-4">
                <div className="flex flex-col gap-y-3">
                    <h1 className="font-bold">Suit Helmet Fan</h1>
                    <li>Primary Fan RPM: {evaTelemetry.fan_pri_rpm.toFixed(2)} RPM {'[20k, 30k, 30k]'}</li>
                    <li>Sec. Fan RPM: {evaTelemetry.fan_sec_rpm.toFixed(2)} RPM {'[20k, 30k, 30k]'}</li>
                </div>

                <div className="flex flex-col gap-y-3">
                    <h1 className="font-bold">Suit Co2 Scrubbers</h1>
                    <li>Scrubber A Co2 Stor: {evaTelemetry.scrubber_a_co2_storage.toFixed(2)}% {'[0, 60]'}</li>
                    <li>Scrubber B Co2 Stor: {evaTelemetry.scrubber_b_co2_storage.toFixed(2)}% {'[0, 60]'}</li>
                </div>
            </div>

            <h1 className="font-bold pt-4">Suit Temperature</h1>
            <li>Temperature: {evaTelemetry.temperature.toFixed(2)} *F {'[50, 90, 70]'}</li>
            <li>Coolant Liquid Pres: {evaTelemetry.coolant_liquid_pressure.toFixed(2)} psi {'[100, 700, 500]'}</li>
            <li>Coolant Gas Pres: {evaTelemetry.coolant_gas_pressure.toFixed(2)} psi {'[0, 700, 0]'}</li>
        </div>
    )

}

const windows = {
    "eva1": "EVA 1 Telemetry",
    "eva2": "EVA 2 Telemetry",
}

const ScreenTwoContentManager = () => {
    const [visibleWindow, setVisibleWindow] = useState("eva1");
    const { getTelemetryData } = useNetwork()

    const EVA1Data = getTelemetryData(1);
    const EVA2Data = getTelemetryData(2);

    //checkNominalOther(EVA1Data.telemetry.eva, 1)
    //checkNominalOther(EVA2Data.telemetry.eva, 2)

    const windowNames: WindowNames = {
        "eva1": EVADataMap(EVA1Data, 1),
        "eva2": EVADataMap(EVA2Data, 2),
    }

    const renderWindow = () => {
        let pane = windowNames[visibleWindow]
        return (
            <div style={{ height: '100%', width: '100%' }} className="flex items-center justify-center">
                {pane}
            </div>
        );
    };

    const renderButtons = Object.entries(windows).map(([key, value]) => (
        <Button key={key} className={`hover:bg-slate-300 ${visibleWindow === key && "bg-slate-800 text-white hover:bg-slate-800 cursor-default"}`} onClick={() => setVisibleWindow(key)}>
            {value}
        </Button>
    ));

    return ( 
        <div className="flex flex-col p-4 outline outline-4 items-center justify-center outline-slate-700 rounded-lg gap-y-2">
            <div className="" style={{ height: '720px', width: '750px' }}>
                {renderWindow()}
            </div>
            <div className="flex flex-row gap-x-2">
                {renderButtons}
            </div>
        </div>
     );
}
 
export default ScreenTwoContentManager;