import { useState } from "react";
import { Button } from "../ui/button";

interface WindowNames {
    [key: string]: JSX.Element;
  }

const windowNames: WindowNames = {
    "uia": (
        <div className="overflow-scroll gap-y-3">
            Temp UIA
        </div>
    ),
    "rover": (
        <div>
            Testing Rover
        </div>
    ),
    "ingress": (
        <div>
            Testing Ingress
        </div>
    ),
    "geo": (
        <div>
            Testing Geo
        </div>
    ),
    "rep": (
        <div className="overflow-scroll list-decimal gap-y-3">
            Temp Repairs 
        </div>
    )
}

const windows = {
    "uia": "UIA/DCU/Egress",
    "rover": "Rover",
    "ingress": "Ingress",
    "geo": "Geological Sampling",
    "rep": "Equipment Diagnosis & Repairs"
}

const ProcedureLists = () => {
    const [visibleWindow, setVisibleWindow] = useState("uia");

    const renderWindow = () => {
        let pane = windowNames[visibleWindow]
        return (
            <div style={{ height: '100%', width: '100%' }} className="flex items-center justify-center overflow-auto">
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
        <div className="flex flex-col p-4 outline outline-4 outline-slate-700 rounded-lg gap-y-2">
            <div className="flex flex-row gap-x-2 pb-4">
                {renderButtons}
            </div>
            <div className="" style={{ height: '620px', width: '710px' }}>
                {renderWindow()}
            </div>
        </div>
     );
}
 
export default ProcedureLists;