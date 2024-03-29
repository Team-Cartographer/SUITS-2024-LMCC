import { useState } from "react";
import { Button } from "../ui/button";
import { fetchWithParams } from "@/api/fetchServer";
import { useNetwork } from "@/hooks/context/network-context";

interface WindowNames {
    [key: string]: JSX.Element;
  }


const windows = {
    "uia": "Egress",
    "ingress": "Ingress",
    "geo": "Geological Sampling",
    "rep": "Equipment Diagnosis & Repairs",
    "emergency": "Emergencies",
    "rover": "Rover",
}

const ProcedureLists = () => {
    const [visibleWindow, setVisibleWindow] = useState("uia");
    const { getTodoData } = useNetwork();
    const todoData = getTodoData();

    const sendTodoItem = async (event: React.MouseEvent) => {
        const childNodes = event.currentTarget.childNodes;
        const directTextContent = Array.from(childNodes).reduce((acc, node) => {
            if (node.nodeType === Node.TEXT_NODE) {
            return acc + node.textContent;
            }
            return acc;
        }, "");
        const new_item = directTextContent.trim();

        const current_list = todoData.todoItems;
        await fetchWithParams('api/v0',
        {
            notif: "update_todo",
            todoItems: [...(current_list || []), [new_item, "False"]]
        })
    }
    
    const windowNames: WindowNames = {
        "uia": (
            <div className="overflow-scroll flex flex-col gap-y-4">
                <div className="pl-4 font-bold pb-2 pt-3">Complete for Each EVA</div>
                <div className="pl-4" role="button" onClick={sendTodoItem}>1. Connect UIA to DCU</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>a. PLUG: Connect UIA and DCU via the cable</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>b. SWITCH: UIA EMU POWER to ON (activates the Umbilical on the UIA side)</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>c. SWITCH: DCU BATT to Umbilical (activated the Umbilical on the DCU side)</div>
                <div className="pl-4" role="button" onClick={sendTodoItem}>2. Begin Depress of Suit (one switch does both suits)</div>

                    <div className="pl-8" role="button" onClick={sendTodoItem}>a. SWITCH: UIA Depress to ON (This will take a few minutes)</div>
                <div className="pl-4" role="button" onClick={sendTodoItem}>3. Vent O2 Tanks (one switch does both suits)</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>a. SWITCH: UIA OXY VENT to ON (vents the content of the primary tank)</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>b. Wait until Both Primary and Secondary OXY Tanks are empty for both EVAs</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>c. SWITCH: UIA OXY VENT to OFF (conclude venting the primary tank)</div>
                <div className="pl-4" role="button" onClick={sendTodoItem}>4. Prepare O2 Tanks</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>a. Fill Primary Tank</div>
                        <div className="pl-12" role="button" onClick={sendTodoItem}>i. SWITCH: DCU OXY to Primary (sets the primary tank as the active tank)</div>
                        <div className="pl-12" role="button" onClick={sendTodoItem}>ii. SWITCH: UIA OXY SUPPLY to ON (fills the primary tank with oxygen)</div>
                        <div className="pl-12" role="button" onClick={sendTodoItem}>iii. Wait until Primary OXY Tank is at 3000 psi</div>
                        <div className="pl-12" role="button" onClick={sendTodoItem}>iv. SWITCH: UIA OXY SUPPLY to OFF (concludes filling the primary tank)</div>
                    
                    <div className="pl-8" role="button" onClick={sendTodoItem}>b. Fill Secondary Tank</div>
                        <div className="pl-12" role="button" onClick={sendTodoItem}>i. SWITCH: DCU OXY to Secondary (sets the secondary tank as the active tank)</div>
                        <div className="pl-12" role="button" onClick={sendTodoItem}>ii. SWITCH: UIA OXY SUPPLY to ON (fills the secondary tank with oxygen)</div>
                        <div className="pl-12" role="button" onClick={sendTodoItem}>iii. Wait until Secondary OXY Tank is at 3000 psi</div>
                        <div className="pl-12" role="button" onClick={sendTodoItem}>iv. SWITCH: UIA OXY SUPPLY to OFF (concludes filling the secondary tank)</div>
                    
                    <div className="pl-8" role="button" onClick={sendTodoItem}>c. SWITCH: DCU OXY to Primary (sets the primary tank as the active tank)</div>
                
                <div className="pl-4" role="button" onClick={sendTodoItem}>5. Prepare Water Coolant</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>a. SWITCH: DCU PUMP to OPEN (Allows coolant to flow between suits and UIA)</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>b. Flush Water Coolant</div>
                        <div className="pl-12" role="button" onClick={sendTodoItem}>i. SWITCH: UIA WATER WASTE to ON/OPEN (flushes the water coolant out of suit)</div>
                        <div className="pl-12" role="button" onClick={sendTodoItem}>ii. Wait until Water Coolant Tank is empty</div>
                        <div className="pl-12" role="button" onClick={sendTodoItem}>iii. SWITCH: UIA WATER WASTE to OFF (conclude flushing the water coolant)</div>
                    
                    <div className="pl-8" role="button" onClick={sendTodoItem}>c. Fill Water Coolant</div>
                        <div className="pl-12" role="button" onClick={sendTodoItem}>i. SWITCH: UIA WATER SUPPLY to ON (supplies the water coolant to suit)</div>
                        <div className="pl-12" role="button" onClick={sendTodoItem}>ii. Wait until Water Coolant Tank is full</div>
                        <div className="pl-12" role="button" onClick={sendTodoItem}>iii. SWITCH: UIA WATER SUPPLY to OFF (conclude supplying water coolant)</div>
                    
                    <div className="pl-8" role="button" onClick={sendTodoItem}>d. SWITCH: DCU PUMP to CLOSE (Prevents coolant to flow between suits and UIA)</div>
                
                <div className="pl-4" role="button" onClick={sendTodoItem}>6. End Depress of Suit</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>a. Wait until Suit Pressure is at 4 psi and is equal to O2 Pressure</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>b. SWITCH: UIA Depress to OFF</div>
                
                <div className="pl-4" role="button" onClick={sendTodoItem}>7. Double Check DCU Switch States</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>a. SWITCH: DCU BATT to LOCAL</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>b. SWITCH: DCU OXY to Primary</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>c. SWITCH: DCU COM to A</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>d. SWITCH: DCU FAN to Primary</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>e. SWITCH: DCU PUMP to CLOSED</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>f. SWITCH: DCU CO2 to A (CO2 Scrubber, will need to flip every 10-15 minutes)</div>
                
                <div className="pl-4" role="button" onClick={sendTodoItem}>8. Disconnect IMU to DCU</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>a. SWITCH: UIA EMU POWER to OFF (deactivated the Umbilical on the UIA side)</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>b. UNPLUG: Disconnect UIA and DCU via the cable</div>
            
                <div className="pl-4">9. Begin EVA</div>
            </div>
        ),
        "rover": (
            <div className="space-y-2">
                <div>Rover will be autonomously moving around the base of the mountain. When the Communications Tower repair is complete, the LMCC will begin receiving location data on the rover. At this point, LMCC2 will manually command the rover up the mountain.</div>
                <ul className="list-disc pl-4">
                    <li>At the top of the mountain, the rover will “collect samples” (via QR code)</li>
                    <li>LMCC2 will then pilot the rover to a rendezvous point with EV2 for transfer of the collected samples</li>
                </ul>
            </div>
        ),
        "ingress": (
            <div className="overflow-scroll flex flex-col gap-y-4">
                <div className="pl-4" role="button" onClick={sendTodoItem}>1. Connect UIA to DCU</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>a. PLUG: Connect UIA and DCU via the cable</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>b. SWITCH: UIA EMU POWER to ON (activates the Umbilical on the UIA side)</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>c. SWITCH: DCU BATT to Umbilical (activated the Umbilical on the DCU side)</div>
                
                <div className="pl-4" role="button" onClick={sendTodoItem}>2. Vent O2 Tanks</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>a. SWITCH: UIA OXY VENT to ON (vents the content of the primary tank)</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>b. Wait until Primary and secondary OXY Tanks are empty</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>c. SWITCH: UIA OXY VENT to OFF (conclude venting the primary tank)</div>
                
                <div className="pl-4" role="button" onClick={sendTodoItem}>3. Flush Water Coolant</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>a. SWITCH: DCU PUMP to OPEN (Allows coolant to flow between suits and UIA)</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>b. Flush Water Coolant</div>
                        <div className="pl-12" role="button" onClick={sendTodoItem}>i. SWITCH: UIA WATER WASTE to ON/OPEN (flushes the water coolant out of suit)</div>
                        <div className="pl-12" role="button" onClick={sendTodoItem}>ii. Wait until Water Coolant Tank is empty</div>
                        <div className="pl-12" role="button" onClick={sendTodoItem}>iii. SWITCH: UIA WATER WASTE to OFF (conclude flushing the water coolant)</div>
                    
                
                <div className="pl-4" role="button" onClick={sendTodoItem}>4. Disconnect IMU to DCU</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>a. SWITCH: UIA EMU POWER to OFF (deactivated the Umbilical on the UIA side)</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>b. UNPLUG: Disconnect UIA and DCU cable</div>
            </div>
        ),
        "geo": (
            <div className="overflow-scroll flex flex-col gap-y-2">
                <div className="pl-4 font-bold" role="button" onClick={sendTodoItem}>XRF Scan (both EVs)</div>
                <div className="pl-4" role="button" onClick={sendTodoItem}>1. Relay arrival at worksite</div>
                <div className="pl-4" role="button" onClick={sendTodoItem}>2. Wait for instructions and go from LMCC</div>
                <div className="pl-4" role="button" onClick={sendTodoItem}>3. Begin scanning rocks in designated search area (see XRF user guide below)</div>
                <div className="pl-4" role="button" onClick={sendTodoItem}>4. Flag any rocks that have a geo composition outside of normal ranges</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>a. This is a good opportunity to use pin dropping</div>
                
                <div className="pl-4" role="button" onClick={sendTodoItem}>5. Continue scanning until abnormal sample is collected or given instruction to stop</div>
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