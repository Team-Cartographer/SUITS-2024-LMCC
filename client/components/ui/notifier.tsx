"use client";

import { useVignette } from "@/hooks/context/vignette-context";
import { fetchWithParams } from "@/api/fetchServer";
import { useEffect, useState } from "react";
import { Button } from "./button";
import { useNetwork } from "@/hooks/context/network-context";

interface PanicData {
    infoWarning: string;
    todoItems: [string, string][];
    isWarning: boolean;
  }

const defaultValue: PanicData = {
    infoWarning: "",
    todoItems: [],
    isWarning: false,
  };

const Notifier = () => {
    const { displayVignette, hideVignette, isVignetteVisible } = useVignette();
    const [panicData, setPanicData] = useState<PanicData>(defaultValue);
    const networkProvider = useNetwork();

    useEffect(() => {
        const intervalId = setInterval(async () => {
          const notification = networkProvider.getNotifData();
          setPanicData(notification);

          if (notification.isWarning === true) {
            displayVignette();
          } else if (notification.isWarning === false) {
            hideVignette();
          }

        }, 200); 
        return () => clearInterval(intervalId);
      });

    const clearAlerts = async () => {
        await fetchWithParams(`api/v0`,
        {
          notif: 'update',
          infoWarning: '',
          isWarning: false,
          todoItems: [...(panicData.todoItems || [])]
        })
    }

      return (
        <>
          {isVignetteVisible && 
            <div className="vignette-overlay fixed inset-0 z-50 pointer-events-none" />
          }
          {panicData && (panicData.infoWarning !== "") && (
            <div className="fixed bottom-5 left-5 bg-background pl-4 pr-4 pt-4 rounded-lg shadow-lg z-50 max-w-xs outline-2 outline-slate-200 outline">
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