"use client";

/**
 * @author @ivanvuong @abhi-arya1 @hrishikesh-srihari
 * @function Telemetry
 * @fileoverview 
 */

import { RoverData } from "@/hooks/types";

import { useNetwork } from "@/hooks/context/network-context";
import { useEffect, useState } from "react";

export function RoverTelemetry() {
    const networkProvider = useNetwork(); 
    const roverData = networkProvider.getRoverData();
    
    return (
        <div className="rounded-xl border border-gray-700 p-4 max-h-[270px] max-w-[600px] mb-4 shadow-green-700/50 shadow-2xl  bg-gray-700">
        <h3 className="text-5xl justify-center" >Telemetry Values</h3>
        <ul className="list-group">
            <li className = "list-group-item text-3xl mt-5">Pos X: {roverData?.rover.posx}</li>
            <li className = "list-group-item text-3xl mt-5">Pos Y: {roverData?.rover.posy}</li>
            <li className = "list-group-item text-3xl mt-5">QR ID: {roverData?.rover.qr_id}</li>
        </ul>
        </div>
    );
}

