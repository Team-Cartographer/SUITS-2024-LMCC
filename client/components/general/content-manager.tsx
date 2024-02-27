import { useState } from "react";
import Map from "../nav/map";
import { Button } from "../ui/button";
import ProcedureLists from "../hmd_link/procedure-lists";

interface WindowNames {
    [key: string]: JSX.Element;
  }

const windowNames: WindowNames = {
    "map": <Map />,
    "lists": <ProcedureLists />
}

const windows = {
    "map": "Map",
    "lists": "Procedure Lists"
}

const ContentManager = () => {
    const [visibleWindow, setVisibleWindow] = useState("map");

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
 
export default ContentManager;