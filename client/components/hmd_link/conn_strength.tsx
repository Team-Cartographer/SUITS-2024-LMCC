/**
 * @author @abhi-arya1
 * @function ConnectionStrength
 * @fileoverview https://docs.google.com/document/d/12t25fQjffmaiEypirbH_cjmmGfv19-wLZXoTAJ37Qf0/edit?usp=sharing
 */

import { SignalHigh, SignalLow, SignalMedium } from "lucide-react";

interface ConnStrengthProps {
  desc: string;
  ping: number;
  className?: string;
}


const ConnectionStrength = ({
  desc,
  ping,
  className = "",
}: ConnStrengthProps) => {
  return (
    <div className={`pt-3 min-w-24 ${className}`}>
      <div
        className={`text-sm flex flex-row bg-slate-600 rounded-xl p-2 items-center justify-center ${
          ping > 15 ? "border-2 border-red-500" : ""
        }`}
      >
        {desc}: 
        { /* FIXME: Change Ping Thresholds */ }
        {ping <= 10 ? (
          <SignalHigh className="h-7 w-7 icon-outline pl-1" />
        ) : ping > 10 && ping <= 20 ? (
          <SignalMedium className="h-7 w-7 icon-outline pl-1" />
        ) : (
          <SignalLow className="h-7 w-7 icon-outline pl-1" />
        )}
      </div>
    </div>
  );
};

export default ConnectionStrength;
