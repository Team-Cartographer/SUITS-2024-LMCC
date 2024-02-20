"use client";

import lmcc_config from "@/lmcc_config.json";
import { useVignette } from "@/hooks/context/vignette-context";
import { fetchWithoutParams } from "@/api/fetchServer";
import { useEffect, useState } from "react";
import { Button } from "./button";

interface PanicData {
    infoWarning: string;
    infoTodo: string;
    isWarning: string;
  }

const defaultValue: PanicData = {
    infoWarning: "",
    infoTodo: "",
    isWarning: "",
  };

const Notifier = () => {
    const { displayVignette, hideVignette, isVignetteVisible } = useVignette();
    const [panicData, setPanicData] = useState<PanicData>(defaultValue);

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
        if (data) { setPanicData(data); }
        } catch (err) {
        console.error("Error fetching panic data:", err);
        }
    };

    useEffect(() => {
        fetchPanicData() 
        const intervalId = setInterval(() => {
          fetchPanicData();
        }, lmcc_config.tickspeed); 
        return () => clearInterval(intervalId);
      });

    const clearAlerts = async () => {
        await fetchWithoutParams<PanicData>(`api/v0?get=notif&infoWarning=&infoTodo=&isWarning=false`)
    }

      return (
        <>
          {isVignetteVisible && 
            <div className="vignette-overlay fixed inset-0 z-50 pointer-events-none" />
          }
          {panicData && (panicData.infoWarning !== "" || panicData.infoTodo !== "") && (
            <div className="fixed bottom-5 left-5 bg-background pl-4 pr-4 pt-4 rounded-lg shadow-lg z-50 max-w-xs outline-2 outline-slate-200 outline">
              {panicData.infoWarning !== "" && (
                <p className={`text-sm text-white font-semibold ${(panicData.infoTodo === "" || panicData.infoTodo === null) && "pb-4"}`}>
                    <span className="underline">Warning Info:</span> {panicData.infoWarning}
                </p>
              )}
              {panicData.infoTodo !== "" && panicData.infoTodo !== null && (
                <p className="text-sm text-white font-semibold mt-2 pb-4"><span className="underline">Todo Item:</span> {panicData.infoTodo}</p>
              ) }
              <Button onClick={clearAlerts}>
                Clear Alerts
              </Button>
              <div className="pb-4" /> 
            </div>
          )}
        </>
      );
};

export default Notifier;