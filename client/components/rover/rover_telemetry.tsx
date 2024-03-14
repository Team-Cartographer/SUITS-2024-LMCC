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
        <div className="flex flex-col font-semibold">
            <h3 className="text-2xl justify-center">Telemetry Values</h3>
            <ul className="list-group">
                <li className = "list-group-item text-xl mt-5">Pos X: {roverData?.rover.posx}</li>
                <li className = "list-group-item text-xl mt-5">Pos Y: {roverData?.rover.posy}</li>
                <li className = "list-group-item text-xl mt-5">QR ID: {roverData?.rover.qr_id}</li>
            </ul>
        </div>
    );
}

