import { useState } from "react";
import { Button } from "../ui/button";
import { fetchWithParams } from "@/api/fetchServer";
import { useNetwork } from "@/hooks/context/network-context";

interface WindowNames {
    [key: string]: JSX.Element;
  }


const windows = {
    "egress": "Egress",
    "ingress": "Ingress",
    "geo": "Geological Sampling",
    "rep": "Equipment Diagnosis & Repairs",
    "emergency": "Emergencies",
    "rover": "Rover",
}

const ProcedureLists = () => {
    const [visibleWindow, setVisibleWindow] = useState("egress");
    const { updateTodoItems } = useNetwork();

    const sendTodoItem = async (event: React.MouseEvent) => {
        const childNodes = event.currentTarget.childNodes;
        const directTextContent = Array.from(childNodes).reduce((acc, node) => {
            if (node.nodeType === Node.TEXT_NODE) {
            return acc + node.textContent;
            }
            return acc;
        }, "");
        const new_item = directTextContent.trim();
        
        updateTodoItems(new_item); 
    }
    
    const windowNames: WindowNames = {
        "egress": (
            <div className="overflow-scroll flex flex-col gap-y-4">
                <div className="pl-4 font-bold pb-2 pt-3">Complete for Each EVA</div>
                <div className="pl-4" role="button" onClick={sendTodoItem}>1. Connect UIA to DCU and start Depress</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>a. EV1 and EV2 connect UIA and DCU umbilical</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>b. EV1 and EV2 switch EMU PWR -- ON </div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>c. BATT -- UMB</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>c. DEPRESS PUMP PWR -- ON</div>

                <div className="pl-4" role="button" onClick={sendTodoItem}>2. Prep O2 Tanks</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>a. OXYGEN O2 VENT -- OPEN</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>b. Wait until both Primary and Secondary OXY tanks are below 10 psi</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>c. OXYGEN O2 VENT -- CLOSE</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>d. OXY -- PRI</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>e. OXYGEN EMU-1, EMU-2 -- OPEN</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>f. Wait until EV1 and EV2 Primary O2 tanks are greater than 3000 psi</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>g. OXYGEN EMU-1, EMU-2 -- CLOSE</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>h. OXY -- SEC</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>i. OXYGEN EMU-1, EMU-2 -- OPEN</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>j. Wait until EV1, EV2 secondary O2 tanks are greater than 3000 psi</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>k. OXYGEN EMU-1, EMU-2 -- CLOSE</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>l. OXY -- PRI</div>

                <div className="pl-4" role="button" onClick={sendTodoItem}>3. Prep Water Tanks</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>a. PUMP -- OPEN</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>b. EV1, EV2 WASTE WATER -- OPEN</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>c. Wait until water EV1 and EV2 Coolnt tank is less than 5%</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>d. EV1, EV2 WASTE WATER -- CLOSE</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>e. EV1, EV2 SUPPLY WATER -- OPEN</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>f. Wait until water EV1 and EV2 Coolant tank is greater than 95%</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>g. EV1, EV2 SUPPLY WATER -- CLOSE</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>h. PUMP -- CLOSE</div>

                <div className="pl-4" role="button" onClick={sendTodoItem}>4. END Depress, Check Switches and Disconnect</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>a. Wait until SUIT P, O2 P = 4</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>b. DEPRESS PUMP PWR -- OFF</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>c. BATT -- LOCAL</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>d. EV1, EV2 PWR -- OFF</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>d. Verify OXY -- PRI</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>d. Verify COMMS -- A</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>d. Verify FAN -- PRI</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>d. Verify PUMP -- CLOSE</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>d. Verify CO2 -- A</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>d. EV1, EV2 disconnect UIA and DCU umbilical</div>
            
                <div className="pl-4">9. Begin EVA</div>
            </div>
        ),
        "rover": (
            <div className="space-y-2">
                <ul className="list-disc pl-4">
                <div role="button" onClick={sendTodoItem}>After rover loaction obtained, LMCC2 command rover to worksite G</div>
                    <li role="button" onClick={sendTodoItem}>Once at Worksite G, LMCC2 will collect samples via QR code</li>
                    <li role="button" onClick={sendTodoItem}>Once samples collected, LMCC2 command rover to a rendezvous point and notify EV2</li>
                    <li role="button" onClick={sendTodoItem}>Once rover and EV2 at rendezvous site, EV2 collect samples from rover</li>

                </ul>
            </div>
        ),
        "ingress": (
            <div className="overflow-scroll flex flex-col gap-y-4">
                <div className="pl-4" role="button" onClick={sendTodoItem}>1. Connect UIA to DCU and start Depress</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>a. EV1 and EV2 connect UIA and DCU umbilical</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>b. EV1 and EV2 switch EMU PWR to ON </div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>c. BATT -- UMB</div>

                <div className="pl-4" role="button" onClick={sendTodoItem}>2. Vent O2 Tanks</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>a. OXYGEN O2 VENT - OPEN</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>b. Wait until Primary and secondary OXY Tanks are less than 10 psi</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>c. OXYGEN O2 VENT -- CLOSE</div>
                
                <div className="pl-4" role="button" onClick={sendTodoItem}>3. Empty Water Tanks</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>a. PUMP -- OPEN</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>b. EV1, EV2 WASTE WATER -- OPEN</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>C. Wait until water EV1 and EV2 coolant tank is less than 5%</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>d. EV1, EV2 WASTE WATER -- CLOSE</div>

                
                <div className="pl-4" role="button" onClick={sendTodoItem}>4. Disconnect IMU from DCU</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>a. EV1, EV2 EMU PWR -- OFF</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>b. EV1, EV2 disconnect umbilical</div>
            </div>
        ),
        "geo": (
            <div className="overflow-scroll flex flex-col gap-y-2">
                <div className="pl-4 font-bold" role="button" onClick={sendTodoItem}>XRF Scan (both EVs)</div>
                <div className="pl-4" role="button" onClick={sendTodoItem}>1. On go from LMCCx, EVx navigate to Station x</div>
                <div className="pl-4" role="button" onClick={sendTodoItem}>2. EVx perform Scan and Sampling procedure at designated Station</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>EV Open Sampling Procedure</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>If available, perform Field Notes on Rock, which can include picture, voice notes, etc.</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>Perform XRF Scan</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>Press and HOLD trigger</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>Aim close to sample until beep, then release trigger</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>If Rock Composition outside of normal parameters, collect rock</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>If able, drop and label a pin</div>
                <div className="pl-4" role="button" onClick={sendTodoItem}>3. EVx Navigate to Station x</div>
                <div className="pl-4" role="button" onClick={sendTodoItem}>3. EVx perform Scan and Sampling procedure at designated station</div>
                <div style={{ height: '20px' }}></div>
    
                <div className="pl-4 font-bold pt-4" role="button" onClick={sendTodoItem}>XRF Scan (MCC)</div>
                <div className="pl-4" role="button" onClick={sendTodoItem}>1. Wait for arrival confirmation from EV</div>
                <div className="pl-4" role="button" onClick={sendTodoItem}>2. Relay search area to EV</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>a. This will be a portion of the task where pin dropping could be useful, however, you will have a map of the designated search areas included</div>
                
                <div className="pl-4" role="button" onClick={sendTodoItem}>3. Give EV go to proceed</div>
                <div className="pl-4 pt-4 font-bold" role="button" onClick={sendTodoItem}>Sampling Procedure</div>
                <div className="pl-4" role="button" onClick={sendTodoItem}>1. Grab XRF Scanners (looking for rocks outside of expected composition ranges)</div>
                <div className="pl-4" role="button" onClick={sendTodoItem}>2. EVA1 Procedure Collection Procedures</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>a. Navigate to Station A</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>b. Collect Samples at Station A</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>c. Navigate to Station B</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>d. Collect Samples at Station B</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>e. Navigate to Station C</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>f. Collect Samples at Station C</div>
                
                <div className="pl-4" role="button" onClick={sendTodoItem}>3. EVA2 Procedures Collection Procedures</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>a. Navigate to Station D</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>b. Collect Samples at Station D</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>c. Navigate to Station E</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>d. Collect Samples at Station E</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>e. Navigate to Station F</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>f. Collect Samples at Station F</div>
                
            </div>
        ),
        "rep": (
            <div className="overflow-scroll flex flex-col gap-y-3">
                <div className="pl-4 font-bold pt-1" role="button" onClick={sendTodoItem}>Arrive at Worksite</div>
                <div className="pl-4" role="button" onClick={sendTodoItem}>1. Inspect Worksite for Damage</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>a. Relay to MCC arrival and inspection start</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>b. Begin inspection of the worksite</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>c. Once issue is discovered, relay issue to MCC</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>d. Wait to receive repair procedures from MCC</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>Note:</div>
                    <div className="pl-12" role="button" onClick={sendTodoItem}>i. This can be the MCC referring the crewmember to one procedure pre-saved to a library in the HMD. Additional procedures will soon be provided in addition to the Cable Repair procedure.</div>
                    <div className="pl-12" role="button" onClick={sendTodoItem}>ii. Growth: MCC can send new procedures.</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>e. Continue to appropriate procedure.</div>
                
                <div className="pl-4 font-bold pb-1 pt-4">Cable Repair</div>
                <div className="pl-4" role="button" onClick={sendTodoItem}>2. Shut down comm tower (EV1)</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>a. Select power button on screen</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>b. Select shut down option</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>c. Relay system shutdown complete</div>
                
                <div className="pl-4" role="button" onClick={sendTodoItem}>3. Power down MMRTG (EV2)</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>a. Set power switch to off position</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>b. Relay power down to mcc</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>c. Return to comm tower for cable swap task</div>
                
                <div className="pl-4" role="button" onClick={sendTodoItem}>4. Cable swap</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>a. Retrieve functional cable (EV1)</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>b. Take one end of cable to MMRTG site, relay when arrived (EV2)</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>c. Disconnect damaged cable from comm tower, relay when complete (EV1)</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>d. Disconnect damaged cable from MMRTG, relay when complete (EV2)</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>e. Connect functional cable to comm tower, relay when complete (EV1)</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>f. Connect functional cable to MMRTG, relay when complete (EV2)</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>g. Relay cable swap complete to MCC (EV1)</div>
               
                <div className="pl-4" role="button" onClick={sendTodoItem}>5. Restore power</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>a. Set MMRTG power switch to on position (EV2)</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>b. Power on comm tower by pressing power button (EV1)</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>c. Wait for system start up (EV1)</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>d. Relay successful system start (EV1)</div>
                
                <div className="pl-4" role="button" onClick={sendTodoItem}>6. Verify Successful Repair (Both EVs)</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>a. Verify channel is live on comm tower display</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>b. Test if comm channel is functional</div>
                    <div className="pl-12" role="button" onClick={sendTodoItem}>i. Follow channel switch protocol</div>
                    <div className="pl-12" role="button" onClick={sendTodoItem}>ii. Protocol:</div>
                        <div className="pl-16" role="button" onClick={sendTodoItem}>1. MCC relays channel switch start</div>
                        <div className="pl-16" role="button" onClick={sendTodoItem}>2. EV will swap to repaired channel</div>
                        <div className="pl-16" role="button" onClick={sendTodoItem}>3. If no comms are received within 10 seconds, EV will return to working channel</div>
                        <div className="pl-16" role="button" onClick={sendTodoItem}>4. Otherwise proceed</div>
                    
                    <div className="pl-8" role="button" onClick={sendTodoItem}>c. Wait for go to proceed from MCC</div>

            </div>
        ),
        "emergency": (
            <div className="overflow-scroll space-y-2">
                <h2 className="font-bold py-2 pl-1">In Case of Emergency:</h2>
                <div className="pl-4" role="button" onClick={sendTodoItem}>1. MCC Notices error and reports error to EVA</div>
                <div className="pl-4" role="button" onClick={sendTodoItem}>2. EVA confirms error</div>
                <div className="pl-4" role="button" onClick={sendTodoItem}>3. MCC gives EVA procedure for fixing the error (EVA hopefully has procedure on display)</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>a. Both LMCC and HMC should have caution and warning systems</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>b. O2 Error</div>
                        <div className="pl-12" role="button" onClick={sendTodoItem}>i. Swap O2 switch to secondary position</div>
                        <div className="pl-12" role="button" onClick={sendTodoItem}>ii. Relay O2 position switch to LMCC</div>
                        <div className="pl-12" role="button" onClick={sendTodoItem}>iii. Begin navigation back to airlock</div>
                    
                    <div className="pl-8" role="button" onClick={sendTodoItem}>c. Fan Error</div>
                        <div className="pl-12" role="button" onClick={sendTodoItem}>i. Swap FAN switch to secondary position</div>
                        <div className="pl-12" role="button" onClick={sendTodoItem}>ii. Relay FAN position switch to LMCC</div>
                        <div className="pl-12" role="button" onClick={sendTodoItem}>iii. Begin navigation back to airlock</div>
                    
                    <div className="pl-8" role="button" onClick={sendTodoItem}>d. Abort Procedure (LMCC)</div>
                        <div className="pl-12" role="button" onClick={sendTodoItem}>i. Relay abort mission and return to airlock command to EVs</div>
               
                <div className="pl-4" role="button" onClick={sendTodoItem}>4. EVA Fixes Error</div>
                <div className="pl-4" role="button" onClick={sendTodoItem}>5. MCC requests that EVA returns to base to repair error</div>
            </div>
        )
    }

    const renderWindow = () => {
        let pane = windowNames[visibleWindow]
        return (
            <div style={{ height: '100%', width: '100%' }} className="flex flex-col items-center justify-center overflow-auto">
                {pane}
            </div>
        );
    };

    const renderButtons = Object.entries(windows).map(([key, value]) => (
        <Button key={key} className={`text-sm p-1 pr-2 pl-2 hover:bg-slate-300 ${visibleWindow === key && "bg-slate-800 text-white hover:bg-slate-800 cursor-default"}`} onClick={() => setVisibleWindow(key)}>
            {value}
        </Button>
    ));

    return ( 
        <div className="flex flex-col p-4 outline outline-4 outline-slate-700 rounded-lg gap-y-2">
            <div className="" style={{ height: '730px', width: '850px' }}>
                {renderWindow()}
            </div>
            <div className="flex flex-row gap-x-2 pt-3 items-center justify-center">
                {renderButtons}
            </div>
        </div>
     );
}
 
export default ProcedureLists;