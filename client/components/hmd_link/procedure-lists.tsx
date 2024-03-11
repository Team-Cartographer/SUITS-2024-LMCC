import { useState } from "react";
import { Button } from "../ui/button";

interface WindowNames {
    [key: string]: JSX.Element;
  }

const windowNames: WindowNames = {
    "uia": (
        <div className="overflow-scroll gap-y-2">
        <div>Complete for each EV</div>
        <div>1. Connect UIA to DCU</div>
        <div>a. PLUG: Connect UIA and DCU via the cable</div>
        <div>b. SWITCH: UIA EMU POWER to ON (activates the Umbilical on the UIA side)</div>
        <div>c. SWITCH: DCU BATT to Umbilical (activated the Umbilical on the DCU side)</div>
        <div>2. Begin Depress of Suit (one switch does both suits)</div>
        <div>a. SWITCH: UIA Depress to ON (This will take a few minutes)</div>
        <div>3. Vent O2 Tanks (one switch does both suits)</div>
        <div>a. SWITCH: UIA OXY VENT to ON (vents the content of the primary tank)</div>
        <div>b. Wait until Both Primary and Secondary OXY Tanks are empty for both EVAs</div>
        <div>c. SWITCH: UIA OXY VENT to OFF (conclude venting the primary tank)</div>
        <div>4. Prepare O2 Tanks</div>
        <div>a. Fill Primary Tank</div>
        <div>i. SWITCH: DCU OXY to Primary (sets the primary tank as the active tank)</div>
        <div>ii. SWITCH: UIA OXY SUPPLY to ON (fills the primary tank with oxygen)</div>
        <div>iii. Wait until Primary OXY Tank is at 3000 psi</div>
        <div>iv. SWITCH: UIA OXY SUPPLY to OFF (concludes filling the primary tank)</div>
        <div>b. Fill Secondary Tank</div>
        <div>i. SWITCH: DCU OXY to Secondary (sets the secondary tank as the active
        tank)</div>
        <div>ii. SWITCH: UIA OXY SUPPLY to ON (fills the secondary tank with oxygen)</div>
        <div>iii. Wait until Secondary OXY Tank is at 3000 psi</div>
        <div>iv. SWITCH: UIA OXY SUPPLY to OFF (concludes filling the secondary tank)</div>
        <div>c. SWITCH: DCU OXY to Primary (sets the primary tank as the active tank)</div>
        <div>5. Prepare Water Coolant</div>
        <div>a. SWITCH: DCU PUMP to OPEN (Allows coolant to flow between suits and UIA)</div>
        <div>b. Flush Water Coolant</div>
        <div>i. SWITCH: UIA WATER WASTE to ON/OPEN (flushes the water coolant out
        of suit)</div>
        <div>ii. Wait until Water Coolant Tank is empty</div>
        <div>iii. SWITCH: UIA WATER WASTE to OFF (conclude flushing the water coolant)</div>
        <div>c. Fill Water Coolant</div>
        <div>i. SWITCH: UIA WATER SUPPLY to ON (supplies the water coolant to suit)</div>
        <div>ii. Wait until Water Coolant Tank is full</div>
        <div>iii. SWITCH: UIA WATER SUPPLY to OFF (conclude supplying water coolant)</div>
        <div>d. SWITCH: DCU PUMP to CLOSE (Prevents coolant to flow between suits and UIA)</div>
        <div>6. End Depress of Suit</div>
        <div>a. Wait until Suit Pressure is at 4 psi and is equal to O2 Pressure</div>
        <div>b. SWITCH: UIA Depress to OFF</div>
        <div>7. Double Check DCU Switch States</div>
        <div>a. SWITCH: DCU BATT to LOCAL</div>
        <div>b. SWITCH: DCU OXY to Primary</div>
        <div>c. SWITCH: DCU COM to A</div>
        <div>d. SWITCH: DCU FAN to Primary</div>
        <div>e. SWITCH: DCU PUMP to CLOSED</div>
        <div>f. SWITCH: DCU CO2 to A (CO2 Scrubber, will need to flip every 10-15 minutes)</div>
        <div>8. Disconnect IMU to DCU</div>
        <div>a. SWITCH: UIA EMU POWER to OFF (deactivated the Umbilical on the UIA side)</div>
        <div>b. UNPLUG: Disconnect UIA and DCU via the cable</div>
        <div>9. Begin EVA</div>
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
        <div className="overflow: scroll; gap-y-3">
            <div>XRF Scan (both EVs)</div>
            <div>1. Relay arrival at worksite</div>
            <div>2. Wait for instructions and go from LMCC</div>
            <div>3. Begin scanning rocks in designated search area (see XRF user guide below)</div>
            <div>4. Flag any rocks that have a geo composition outside of normal ranges</div>
            <div>a. This is a good opportunity to use pin dropping</div>
            <div>5. Continue scanning until abnormal sample is collected or given instruction to stop</div>
            <div style={{ height: '20px' }}></div>
            <div>XRF Scan (MCC)</div>
            <div>1. Wait for arrival confirmation from EV</div>
            <div>2. Relay search area to EV</div>
            <div>a. This will be a portion of the task where pin dropping could be useful,
            however, you will have a map of the designated search areas included</div>
            <div>3. Give EV go to proceed</div>
            <div>Sampling Procedure</div>
            <div>1. Grab XRF Scanners (looking for rocks outside of expected composition ranges)</div>
            <div>2. EVA1 Procedure Collection Procedures</div>
            <div>a. Navigate to Station A</div>
            <div>b. Collect Samples at Station A</div>
            <div>c. Navigate to Station B</div>
            <div>d. Collect Samples at Station B</div>
            <div>e. Navigate to Station C</div>
            <div>f. Collect Samples at Station C</div>
            <div>3. EVA2 Procedures Collection Procedures</div>
            <div>a. Navigate to Station D</div>
            <div>b. Collect Samples at Station D</div>
            <div>c. Navigate to Station E</div>
            <div>d. Collect Samples at Station E</div>
            <div>e. Navigate to Station F</div>
            <div>f. Collect Samples at Station F</div>
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