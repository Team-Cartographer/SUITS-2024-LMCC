import { useState } from "react";
import { useNetwork } from "@/hooks/context/network-context";
import { Button } from "../ui/button";
import { checkNominalValues, EVADataMap } from "./telemetry_range_manager";

const ScreenTwoContentManager = () => {
    const [visibleWindow, setVisibleWindow] = useState("eva1");
    const { getTelemetryData } = useNetwork()

    /////////// NOMINAL VALUE INFO /////////////////////////
    const EVA1Data = getTelemetryData(1);
    const EVA2Data = getTelemetryData(2);
    const criticalIDs1 = checkNominalValues(EVA1Data.telemetry.eva, 1)
    const criticalIDs2 = checkNominalValues(EVA2Data.telemetry.eva, 2)
    
    return ( 
        <div className="grid grid-cols-1 grid-rows-2 p-8 outline outline-4 items-center justify-center max-h-svh outline-slate-700 rounded-lg gap-y-2">
            <div className="border-b-slate-700 pb-4 border-b-4">
                {EVADataMap(EVA1Data, 1, criticalIDs1)}
            </div>
            <div>
                {EVADataMap(EVA2Data, 2, criticalIDs2)}
            </div>
        </div>
     );
}
 
export default ScreenTwoContentManager;