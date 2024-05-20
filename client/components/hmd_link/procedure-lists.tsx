import { useState } from "react";
import { useNetwork } from "@/hooks/context/network-context";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button";

interface WindowNames {
    [key: string]: JSX.Element;
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
                    <div className="pl-8" role="button" onClick={sendTodoItem}>b. EV1 and EV2 switch PWR -- ON </div>
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
                <div className="pl-4" role="button" onClick={sendTodoItem}>1. EVs notify LMCC1 starting inspection procedure</div>
                <div className="pl-4" role="button" onClick={sendTodoItem}>2. EV1 scan Comm tower, EV2 scan MMRTG for possible issues</div>
                <div className="pl-4" role="button" onClick={sendTodoItem}>3. If issue found, notify LMCC1</div>
                <div className="pl-4" role="button" onClick={sendTodoItem}>4. If EVs do not have a procedure for the issue, standy until LMCCx sends new procedure</div>
                <div className="pl-4" role="button" onClick={sendTodoItem}>5. Execute appropriate procedure</div>
    
                <div className="pl-4 font-bold pb-1 pt-4">Cable Repair</div>
                <div className="pl-4" role="button" onClick={sendTodoItem}>1. EV1 Select Gear Icon (COMM Tower Screen 1)</div>
                <div className="pl-4" role="button" onClick={sendTodoItem}>2. EV1 Select Shutdown (COMM Tower Screen 2)</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>a. EV1 Verify shutdown complete and notify EV2 and LMCC1</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>b. EV2 Move POWER - OFF, notify EV1 and LMCC1</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>c. EV2 Navigate to Comm Tower to retrieve one end of power cable</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>d. EV1 retrieve spare cable</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>e. EV2 take appropriate end of cable to MMRTG, notify EV1 and LMCC1 when at MMRTG</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>f. EV1 disconnect damaged cable from Comm Tower, notify EV2 and LMCC1</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>g. EV2 disconnect damaged cable from MMRTG, notify EV1 and LMCC1</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>h. EV1 Connect new cable from Comm Tower, notify EV1 and LMCC1</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>i. EV2 Connect new cable from MMRTG, notify EV1 and LMCC1</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>j. EV2 Move POWER – ON, notify EV1 and LMCC1</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>k. EV1 POWER – ON, notify EV2 and LMCC1</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>l. EV1 when start up complete, notify EV2 and LMCC1</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>m. Screen 15. EV1 Verify channel “B” is operational, notify EV2 and LMCC1</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>n. On LMCC1 Go, switch to COM – B</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>o. Perform comm check</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>p. If Comm good, EV1/LMCC1 switch back to COM-A, EV2/LMCC2 continue COM-B, Else all to COM – A</div>

                <div className="pl-4" role="button" onClick={sendTodoItem}>Structural Damage Repair</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>1. EV1: Collect structural repair materials including metal patches, welding tools, and adhesives.</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>2. EV2: Assemble safety gear for climbing and securing both crew members.</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>3. EV1: Assess tower for visible structural damage.</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>4. EV2: Assist in removing debris and damaged components.</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>5. EV1: Apply metal patches over holes or tears using welding tools.</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>6. EV2: Provide support in applying patches or adhesives.</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>7. EV1: Secure larger structural issues with adhesives and temporary supports.</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>8. EV2: Ensure safety protocols are followed during high or difficult access points.</div>
                    
                <div className="pl-4" role="button" onClick={sendTodoItem}>Power System Troubleshooting and Repair</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>1. EV1: Assemble diagnostic kit, spare batteries, solar cells, and electrical repair tools.</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>2. EV2: Carry additional spare parts and protective equipment.</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>3. EV1: Perform diagnostics to identify power supply issues.</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>4. EV2: Assist in identifying damaged components.</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>5. EV1: Replace faulty batteries or solar cells.</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>6. EV2: Help in repairing or replacing wiring, ensuring secure connections.</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>7. EV1: Verify power system functionality post-repair</div>

                <div className="pl-4" role="button" onClick={sendTodoItem}>Antenna Alignment and Calibration</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>1.EV1: Prepare alignment tools and calibration software on a portable device.</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>2. EV2: Assemble securing gear and safety equipment for both crew members.</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>3. EV1: Adjust the antenna to correct orientation using tools.</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>4. EV2: Assist in antenna inspection for misalignment or damage.</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>5. EV1: Secure antenna position; perform calibration test.</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>6. EV2: Support in adjustment and calibration process; maintain communication with mission control.</div>
                    
                <div className="pl-4" role="button" onClick={sendTodoItem}>Transceiver Module Replacement</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>1. EV1: Collect replacement transceiver module and non-conductive tools.</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>2. EV2: Prepare electrostatic discharge safety equipment.</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>3. EV1: Remove the faulty module.</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>4. EV2: Assist in isolating power supply.</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>5. EV1: Install the new module ensuring all connections are secure.</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>6. EV2: Ensure module installation is correctly performed; conduct systems check to verify functionality.</div>
                
                <div className="pl-4" role="button" onClick={sendTodoItem}>Cable swap</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>a. Retrieve functional cable (EV1)</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>b. Take one end of cable to MMRTG site, relay when arrived (EV2)</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>c. Disconnect damaged cable from comm tower, relay when complete (EV1)</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>d. Disconnect damaged cable from MMRTG, relay when complete (EV2)</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>e. Connect functional cable to comm tower, relay when complete (EV1)</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>f. Connect functional cable to MMRTG, relay when complete (EV2)</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>g. Relay cable swap complete to MCC (EV1)</div>
               
                <div className="pl-4" role="button" onClick={sendTodoItem}>Restore power</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>a. Set MMRTG power switch to on position (EV2)</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>b. Power on comm tower by pressing power button (EV1)</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>c. Wait for system start up (EV1)</div>
                    <div className="pl-8" role="button" onClick={sendTodoItem}>d. Relay successful system start (EV1)</div>
                
                <div className="pl-4" role="button" onClick={sendTodoItem}>Verify Successful Repair (Both EVs)</div>
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


    const windows: {[key: string]: string} = {
        "egress": "Egress",
        "ingress": "Ingress",
        "geo": "Geological Sampling",
        "rep": "Equipment Diagnosis & Repairs",
        "emergency": "Emergencies",
        "rover": "Rover",
    }

    return ( 
        <div className="max-h-[650px] w-[400px] pl-3 flex flex-col items-center justify-center">
            <div className="overflow-scroll">
                {windowNames[visibleWindow]}
            </div>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="absolute top-[43rem]">
                    {windows[visibleWindow]}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top">
                <DropdownMenuLabel>All Procedures</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.keys(windows).map((window) => (
                    <DropdownMenuItem key={window} onSelect={() => setVisibleWindow(window)}>
                        {windows[window]}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
     );
}
 
export default ProcedureLists;