import { useState } from "react";
import { useNetwork } from "@/hooks/context/network-context";
import { Button } from "../ui/button";
import { ChatItemType, biometricIDMap as IDs } from "@/hooks/types";
import { checkNominalValues, EVADataMap } from "./telemetry_range_manager";
import GeminiChat from "./chatbox";

interface WindowNames {
    [key: string]: JSX.Element;
}

const windows = {
    "eva1": "EVA 1 Telemetry",
    "eva2": "EVA 2 Telemetry",
    "chat": "Chat"
}


const ScreenTwoContentManager = () => {
    const [visibleWindow, setVisibleWindow] = useState("eva1");
    const { getTelemetryData } = useNetwork()

    /////////// NOMINAL VALUE INFO /////////////////////////
    const EVA1Data = getTelemetryData(1);
    const EVA2Data = getTelemetryData(2);
    //const criticalIDs1 = checkNominalValues(EVA1Data.telemetry.eva, 1)
    //const criticalIDs2 = checkNominalValues(EVA2Data.telemetry.eva, 2)
    const [criticalIDs1, criticalIDs2] = [[], []] // Remove to add back nominal checks, or use these for temp testing


    const [chatHistory, setChatHistory] = useState<ChatItemType[]>([]);
    const [newTodoItem, setNewTodoItem] = useState<[string, string]>(["", ""]);


    const windowNames: WindowNames = {
        "eva1": EVADataMap(EVA1Data, 1, criticalIDs1),
        "eva2": EVADataMap(EVA2Data, 2, criticalIDs2),
        "chat": <GeminiChat 
                    chatHistory={chatHistory} 
                    setChatHistory={setChatHistory} 
                    newTodoItem={newTodoItem}
                    setNewTodoItem={setNewTodoItem}
                />
    }

    const renderWindow = () => {
        let pane = windowNames[visibleWindow]
        return (
            <div style={{ height: '100%', width: '100%' }} className="flex items-center justify-center max-h-screen">
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
        <div className="flex flex-col p-4 outline outline-4 items-center justify-center max-h-svh outline-slate-700 rounded-lg gap-y-2">
            <div className="" style={{ height: '700px', width: '650px' }}>
                {renderWindow()}
            </div>
            <div className="flex flex-row gap-x-2">
                {renderButtons}
            </div>
        </div>
     );
}
 
export default ScreenTwoContentManager;