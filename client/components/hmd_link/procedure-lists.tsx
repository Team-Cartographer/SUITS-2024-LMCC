import { useState } from "react";
import Map from "../nav/map";
import { Button } from "../ui/button";
import dynamic from "next/dynamic";

const NoSSR_GeoSampler = dynamic(() => import('@/components/hmd_link/geo_sampling'), { ssr: false })

interface WindowNames {
    [key: string]: JSX.Element;
  }

const windowNames: WindowNames = {
    "uia": (
        <div className="overflow-auto list-decimal gap-y-3">
            <h2>EVA Preparation Instructions</h2>

            <ol className="gap-y-3">
                <li>
                    <h3>Connect UIA to DCU</h3>
                    <ol type="a">
                        <li>PLUG: Connect UIA and DCU via the cable</li>
                        <li>SWITCH: UIA EMU POWER-{'>'} ON (activates the Umbilical on the UIA side)</li>
                        <li>SWITCH: DCU BATT -{'>'} Umbilical (activates the Umbilical on the DCU side)</li>
                    </ol>
                </li>

                <li>
                    <h3>Begin Depress of Suit (one switch does both suits)</h3>
                    <ol>
                        <li>SWITCH: UIA Depress -{'>'} ON (This will take a few minutes)</li>
                    </ol>
                </li>

                <li>
                    <h3>Vent O2 Tanks (one switch does both suits)</h3>
                    <ol type="a">
                        <li>SWITCH: UIA OXY VENT -{'>'} ON (vents the content of the primary tank)</li>
                        <li>Wait until Both Primary and Secondary OXY Tanks are empty for both EVAs</li>
                        <li>SWITCH: UIA OXY VENT -{'>'} OFF (conclude venting the primary tank)</li>
                    </ol>
                </li>

                <li>
                    <h3>Prepare O2 Tanks</h3>
                    <ol type="a">
                        <li>
                            <h4>Fill Primary Tank</h4>
                            <ol>
                                <li>SWITCH: DCU OXY -{'>'} Primary (sets the primary tank as the active tank)</li>
                                <li>SWITCH: UIA OXY SUPPLY -{'>'} ON (fills the primary tank with oxygen)</li>
                                <li>Wait until Primary OXY Tank is at 3000 psi</li>
                                <li>SWITCH: UIA OXY SUPPLY -{'>'} OFF (concludes filling the primary tank)</li>
                            </ol>
                        </li>
                        <li>
                            <h4>Fill Secondary Tank</h4>
                            <ol>
                                <li>SWITCH: DCU OXY -{'>'} Secondary (sets the secondary tank as the active tank)</li>
                                <li>SWITCH: UIA OXY SUPPLY -{'>'} ON (fills the secondary tank with oxygen)</li>
                                <li>Wait until Secondary OXY Tank is at 3000 psi</li>
                                <li>SWITCH: UIA OXY SUPPLY -{'>'} OFF (concludes filling the secondary tank)</li>
                            </ol>
                        </li>
                        <li>SWITCH: DCU OXY -{'>'} Primary (sets the primary tank as the active tank)</li>
                    </ol>
                </li>

                <li>
                    <h3>Prepare Water Coolant</h3>
                    <ol type="a">
                        <li>SWITCH: DCU PUMP -{'>'} OPEN (Allows coolant to flow between suits and UIA)</li>
                        <li>
                            <h4>Flush Water Coolant</h4>
                            <ol>
                                <li>SWITCH: UIA WATER WASTE -{'>'} ON/OPEN (flushes the water coolant out of suit)</li>
                                <li>Wait until Water Coolant Tank is empty</li>
                                <li>SWITCH: UIA WATER WASTE -{'>'} OFF (conclude flushing the water coolant)</li>
                            </ol>
                        </li>
                        <li>
                            <h4>Fill Water Coolant</h4>
                            <ol>
                                <li>SWITCH: UIA WATER SUPPLY -{'>'} ON (supplies the water coolant to suit)</li>
                                <li>Wait until Water Coolant Tank is full</li>
                                <li>SWITCH: UIA WATER SUPPLY -{'>'} OFF (conclude supplying water coolant)</li>
                            </ol>
                        </li>
                        <li>SWITCH: DCU PUMP -{'>'} CLOSE (Prevents coolant to flow between suits and UIA)</li>
                    </ol>
                </li>

                <li>
                    <h3>End Depress of Suit</h3>
                    <ol type="a">
                        <li>Wait until Suit Pressure is at 4 psi and is equal to O2 Pressure</li>
                        <li>SWITCH: UIA Depress -{'>'} OFF</li>
                    </ol>
                </li>

                <li>
                    <h3>Double Check DCU Switch States</h3>
                    <ol type="a">
                        <li>SWITCH: DCU BATT -{'>'} LOCAL</li>
                        <li>SWITCH: DCU OXY -{'>'} Primary</li>
                        <li>SWITCH: DCU COM -{'>'} A</li>
                        <li>SWITCH: DCU FAN -{'>'} Primary</li>
                        <li>SWITCH: DCU PUMP -{'>'} CLOSED</li>
                        <li>SWITCH: DCU CO2 -{'>'} A (CO2 Scrubber, will need to flip every 10-15 minutes)</li>
                    </ol>
                </li>

                <li>
                    <h3>Disconnect UIA to DCU</h3>
                    <ol type="a">
                        <li>SWITCH: UIA EMU POWER-{'>'} OFF (deactivated the Umbilical on the UIA side)</li>
                        <li>UNPLUG: Disconnect UIA and DCU via the cable</li>
                    </ol>
                </li>

                <li>
                    <h3>Begin EVA..</h3>
                </li>
            </ol>
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
        <div>
            Testing Eq. Diagnosis and Repairs
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