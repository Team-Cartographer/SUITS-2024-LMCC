import { useEffect, useState } from "react";
import { useNetwork } from "@/hooks/context/network-context";
import { Button } from "../ui/button";
import { BiometricData, Biometrics } from "@/hooks/types";
import dynamic from "next/dynamic";
import { checkNominal } from "./nominal_checker";

const NoSSR_GeoSampler = dynamic(() => import('@/components/hmd_link/geo_sampling'), { ssr: false })

interface WindowNames {
    [key: string]: JSX.Element;
}


const EVADataMap = (evaData: Biometrics) => { 
    const evaTelemetry = evaData.telemetry.eva
    return(
        <div>
            <ul>
                <li>{evaTelemetry.batt_time_left}</li>
                <li>{evaTelemetry.oxy_pri_storage}</li>
                <li>{evaTelemetry.oxy_sec_storage}</li>
                <li>{evaTelemetry.oxy_pri_storage}</li>
                <li>{evaTelemetry.oxy_pri_storage}</li>
                <li>{evaTelemetry.oxy_pri_storage}</li>
                <li>{evaTelemetry.oxy_pri_storage}</li>
                <li>{evaTelemetry.oxy_pri_storage}</li>
            </ul>
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

    //checkNominal(EVA1Data.telemetry.eva)
    //checkNominal(EVA2Data.telemetry.eva)

    const windowNames: WindowNames = {
        "eva1": EVADataMap(EVA1Data),
        "eva2": EVADataMap(EVA2Data),
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
        <div className="flex flex-col items-center justify-center p-4 outline outline-4 outline-slate-700 rounded-lg gap-y-2">
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