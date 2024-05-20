import { Switch } from "@/components/ui/switch";
import { useNetwork } from "@/hooks/context/network-context";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const DATA_UI = () => {
    const network = useNetwork();
    const uiaState = network.getUIAData();
    const dcuState = network.getDCUData();
    const errorState = network.getErrorData();
    const commState = network.getCommData();

    const SwitchConfig = (link: boolean, name: string, color: string="text-green-400") => {
        return (
            <div className="flex flex-row gap-x-2 items-center">
                <RadioGroup className="flex flex-row gap-x-2 items-center">
                <RadioGroupItem value={name} checked={link} className={`cursor-default ${color}`} /> <span className="text-xs">{name}</span>
                </RadioGroup>
            </div>
        )
    }

    return ( 
        <div className="flex flex-col">
            <div className="flex flex-row gap-x-2">
                <div className="flex flex-col outline p-4 drop-shadow-2xl outline-muted-foreground rounded-lg bg-slate-950">
                    <span className="text-muted-foreground underline font-bold pb-1">UIA</span>
                    <div className="flex flex-row gap-x-6">
                        <div className="flex flex-col gap-y-2">
                        <span className="text-muted-foreground font-bold text-sm">EVA 1</span>
                        {SwitchConfig(uiaState.uia.eva1_power, "POWER")}
                        {SwitchConfig(uiaState.uia.eva1_oxy, "OXY")}
                        {SwitchConfig(uiaState.uia.eva1_water_supply, "WATER SUPPLY")}
                        {SwitchConfig(uiaState.uia.eva1_water_waste, "WATER WASTE")}
                        {SwitchConfig(uiaState.uia.oxy_vent, "OXY VENT")}
                        </div>
                        <div className="flex flex-col gap-y-2">
                        <span className="text-muted-foreground font-bold text-sm">EVA 2</span>
                        {SwitchConfig(uiaState.uia.eva2_power, "POWER")}
                        {SwitchConfig(uiaState.uia.eva2_oxy, "OXY")}
                        {SwitchConfig(uiaState.uia.eva2_water_supply, "WATER SUPPLY")}
                        {SwitchConfig(uiaState.uia.eva2_water_waste, "WATER WASTE")}
                        {SwitchConfig(uiaState.uia.depress, "DEPRESS")}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col outline p-4 drop-shadow-2xl outline-muted-foreground rounded-lg bg-slate-950">
                    <span className="text-muted-foreground underline font-bold pb-1">DCU</span>
                    <div className="flex flex-row gap-x-6">
                        <div className="flex flex-col gap-y-2">
                        <span className="text-muted-foreground font-bold text-sm">EVA 1</span>
                        {SwitchConfig(dcuState.dcu.eva1.batt, "BATT")}
                        {SwitchConfig(dcuState.dcu.eva1.oxy, "OXY")}
                        {SwitchConfig(dcuState.dcu.eva1.comm, "COMM")}
                        {SwitchConfig(dcuState.dcu.eva1.fan, "FAN")}
                        {SwitchConfig(dcuState.dcu.eva1.pump, "PUMP")}
                        {SwitchConfig(dcuState.dcu.eva1.co2, "CO2")}

                        </div>
                        <div className="flex flex-col gap-y-2">
                        <span className="text-muted-foreground font-bold text-sm">EVA 2</span>
                        {SwitchConfig(dcuState.dcu.eva2.batt, "BATT")}
                        {SwitchConfig(dcuState.dcu.eva2.oxy, "OXY")}
                        {SwitchConfig(dcuState.dcu.eva2.comm, "COMM")}
                        {SwitchConfig(dcuState.dcu.eva2.fan, "FAN")}
                        {SwitchConfig(dcuState.dcu.eva2.pump, "PUMP")}
                        {SwitchConfig(dcuState.dcu.eva2.co2, "CO2")}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-row py-2 gap-x-2">
                <div className="flex flex-col outline p-4 pb-6 drop-shadow-2xl outline-muted-foreground rounded-lg w-[68.2%] bg-slate-950">
                    <span className="text-muted-foreground underline font-bold pb-2">Errors</span>
                    <div className="flex flex-col gap-y-2">
                        {SwitchConfig(errorState.error.fan_error, "FAN ERROR", "text-red-400")}
                        {SwitchConfig(errorState.error.oxy_error, "OXY ERROR", "text-red-400")}
                        {SwitchConfig(errorState.error.pump_error, "PUMP ERROR", "text-red-400")}
                        {SwitchConfig(errorState.error.power_error, "POWER ERROR", "text-red-400")}
                    </div>
                </div>
                <div className="flex flex-col outline p-4 pb-6 drop-shadow-2xl outline-muted-foreground rounded-lg bg-slate-950">
                    <span className="text-muted-foreground underline font-bold pb-2">Communications</span>
                    <div className="flex flex-col items-center justify-center">
                        <span className="pb-4">COMM TOWER STATUS</span>
                        {commState.comm.comm_tower ? <span className="text-green-400">- CONNECTED -</span> : <span className="text-red-400">- DISCONNECTED -</span>}
                    </div>
                </div>
            </div>
        </div>
     );

     // {
    //     "dcu": {
    //         "eva1": {
    //             "batt": true,
    //             "oxy": true,
    //             "comm": true,
    //             "fan": true,
    //             "pump": true,
    //             "co2": true
    //         },
    //         "eva2": {
    //             "batt": true,
    //             "oxy": true,
    //             "comm": true,
    //             "fan": true,
    //             "pump": true,
    //             "co2": true
    //         }
    //     }
    // }
}
 
export default DATA_UI;