"use client";

/**
 * @author @abhi-arya1 @hrishikesh-srihari
 * @function RoverTelemetry
 */

import { useNetwork } from "@/hooks/context/network-context";

export function RoverTelemetry() {
    const networkProvider = useNetwork(); 
    const roverData = networkProvider.getRoverData();
    
    return (
        <div className="flex flex-row bg-slate-900 rounded-t-3xl p-2 pl-5 max-w-[640px] font-semibold items-start gap-x-4">
                <p>Rover Telemetry</p>
                <p> 
                    X: <span> </span>
                    {roverData?.rover.posx}
                </p>
                <p> 
                    Y:  <span> </span>
                    {roverData?.rover.posy}
                </p>
                <p>
                    QR ID:  <span> </span>
                    {roverData?.rover.qr_id}
                </p>
        </div>
    );
}

