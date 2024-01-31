"use client";

/**
 * @author @abhi-arya1
 * @function Timers
 * @fileoverview https://docs.google.com/document/d/1hmx74L0iU5ikTFpniqynhU_xts1HKvM1jPmr64Lin-o/
 */

import React, { useEffect, useState } from "react";
import Clock from "react-live-clock";
import { fetchWithoutParams } from "@/api/fetchServer";
import lmcc_config from "@/lmcc_config.json"

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [hours, minutes, secs].map(v => v < 10 ? "0" + v : v).join(":");
};

const MissionClock = () => {
  return (
    <div className="text-4xl font-semibold mb-4 absolute pt-6">
      <Clock format={"hh:mm:ss A"} ticking={true} timezone={"US/Pacific"} />
    </div>
  );
};

const MissionStopwatch = () => {
  const [formattedTime, setFormattedTime] = useState("00:00:00");
  // ... (other state variables)

  useEffect(() => {
      const interval = setInterval(async () => {
          try {
              const data = await fetchWithoutParams<{ telemetry: { eva_time: number } }>('tss/telemetry'); //fetch mission elapsed time
              if (data?.telemetry?.eva_time !== undefined) {
                console.log(data.telemetry.eva_time)
                setFormattedTime(formatTime(data.telemetry.eva_time));
            }
              
          } catch (error) {
              console.error('Error fetching eva_time:', error); // Error check 
          }
      }, lmcc_config.tickspeed);

      return () => clearInterval(interval);
  }, [/* dependencies */]);

  return (
   
     
      <div className="flex flex-row">
          <div className="text-4xl font-semibold mb-4 absolute pt-0">
              {formattedTime}
          </div>
      </div>
  );
};


const Timers = () => {
  return (
    <div className="flex flex-row pt-2 pl-2 gap-x-6">
      <div className="flex flex-col">
        <p className="font-bold text-md">Current Time</p>
        <MissionClock />
      </div>

      <div className="flex flex-col pl-32">
        <p className="font-bold text-md">Mission Elapsed Time</p>
        <MissionStopwatch />
      </div>
    </div>
  );
};


export default Timers;
