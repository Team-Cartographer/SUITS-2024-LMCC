"use client";

import lmcc_config from "@/lmcc_config.json";
import { useVignette } from "@/hooks/context/vignette-context";
import { fetchWithoutParams } from "@/api/fetchServer";
import { useEffect } from "react";

interface PanicData {
    infoWarning: string;
    infoTodo: string;
    isWarning: string;
  }

const Notifier = () => {
    const { displayVignette, hideVignette, isVignetteVisible } = useVignette();

    const fetchPanicData = async () => {
        try {
        const data = await fetchWithoutParams<PanicData>(
            `api/v0?get=notif`,
        );
        if (data && data.isWarning === "true") {
            console.log(data)
            displayVignette();
        } else {
            hideVignette();
        }
        } catch (err) {
        console.error("Error fetching panic data:", err);
        }
    };

    useEffect(() => {
        fetchPanicData();
        const intervalId = setInterval(() => {
          fetchPanicData();
        }, lmcc_config.tickspeed); 
        return () => clearInterval(intervalId);
      });

    const vignetteStyle = {
    backgroundImage: 'radial-gradient(ellipse at center, transparent 60%, rgba(255, 0, 0, 0.8) 80%)',
    };

    if (isVignetteVisible) { 
        return ( 
            <div className="fixed inset-0 z-50 pointer-events-none">
            <div className="absolute inset-0 bg-transparent" style={vignetteStyle}></div>
            </div>
        )
    }
}

export default Notifier;