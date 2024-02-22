"use client";

import { useVignette } from "@/hooks/context/vignette-context";
import { fetchWithoutParams, fetchWithParams } from "@/api/fetchServer";
import { useEffect, useState } from "react";
import { Button } from "./button";

interface PanicData {
    infoWarning: string;
    todoItems: [];
    isWarning: string;
  }

const defaultValue: PanicData = {
    infoWarning: "",
    todoItems: [],
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
        const intervalId = setInterval(fetchPanicData, 750); 
        return () => clearInterval(intervalId);
      });

    const clearAlerts = async () => {
        await fetchWithParams(`api/v0`,
        {
          notif: 'update',
          infoWarning: '',
          isWarning: "false",
          todoItems: ''
        })
    }

      return (
        <>
          {isVignetteVisible && 
            <div className="vignette-overlay fixed inset-0 z-50 pointer-events-none" />
          }
          {panicData && (panicData.infoWarning !== "") && (
            <div className="fixed bottom-5 left-[35rem] bg-background pl-4 pr-4 pt-4 rounded-lg shadow-lg z-50 max-w-xs outline-2 outline-slate-200 outline">
              {panicData.infoWarning !== "" && panicData.infoWarning !== null && (
                <p className={`text-sm text-white font-semibold pb-2`}>
                    <span className="underline">Warning Info:</span> {panicData.infoWarning}
                </p>
              )}
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