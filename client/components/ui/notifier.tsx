"use client";

import { useVignette } from "@/hooks/context/vignette-context";
import { fetchWithParams } from "@/api/fetchServer";
import { useEffect, useState } from "react";
import { Button } from "./button";
import { useNetwork } from "@/hooks/context/network-context";
import { WarningData } from "@/hooks/types"
import { defaultWarningValue } from "@/hooks/defaults";

const Notifier = () => {
    const { displayVignette, hideVignette, isVignetteVisible } = useVignette();
    const [warningData, setWarningData] = useState<WarningData>(defaultWarningValue);
    const networkProvider = useNetwork();

    useEffect(() => {
        const intervalId = setInterval(async () => {
          const warningData = networkProvider.getWarningData();
          setWarningData(warningData);

          if (warningData.infoWarning !== '') {
            displayVignette();
          } else if (warningData.infoWarning === '') {
            hideVignette();
          }

        }, 200); 
        return () => clearInterval(intervalId);
      });

    const clearAlerts = async () => {
        await fetchWithParams(`api/v0`,
        {
          notif: 'update_warning',
          infoWarning: '',
        })
    }

      return (
        <>
          {isVignetteVisible && 
            <div className="vignette-overlay fixed inset-0 z-50 pointer-events-none" />
          }
          {warningData && (warningData.infoWarning !== "") && (
            <div className="fixed bottom-5 left-[500px] bg-background pl-4 pr-4 pt-4 rounded-lg shadow-lg z-50 max-w-xs outline-2 outline-slate-200 outline">
              {warningData.infoWarning !== "" && warningData.infoWarning !== null && (
                <p className={`text-sm text-white font-semibold pb-2`}>
                    <span className="underline">Warning Info:</span> {warningData.infoWarning}
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