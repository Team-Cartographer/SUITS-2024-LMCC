"use client";

import { useVignette } from "@/hooks/context/vignette-context";
import { fetchWithParams } from "@/api/fetchServer";
import { useEffect, useState } from "react";
import { Button } from "./button";
import { useNetwork } from "@/hooks/context/network-context";
import { WarningData } from "@/hooks/types"
import { defaultWarningValue } from "@/hooks/defaults";
import { EyeOff, Trash } from "lucide-react";

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
            <div className="fixed top-5 right-5 bg-background flex flex-row pl-4 pr-4 pt-4 pb-3 rounded-lg shadow-lg z-50 max-w-xs outline-2 outline-slate-200 outline">
              {warningData.infoWarning !== "" && warningData.infoWarning !== null && (
                <p className={`text-sm text-white font-semibold pb-2`}>
                    <span className="underline">Warning:</span> {warningData.infoWarning}
                </p>
              )}
              <div role="button" className="text-white hover:text-gray-500 h-4 w-4 pr-5 pb-8 pl-3 self-end" onClick={clearAlerts}>
                <EyeOff />
              </div>
            </div>
          )}
        </>
      );
};

export default Notifier;