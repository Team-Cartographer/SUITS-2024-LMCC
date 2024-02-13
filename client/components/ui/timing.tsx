"use client";

/**
 * @author @abhi-arya1, @adyxn
 * @function Timers
 */

import React, { useEffect, useState } from "react";
import Clock from "react-live-clock";
import { fetchWithoutParams } from "@/api/fetchServer"; //fetches without parameters 
import lmcc_config from "@/lmcc_config.json" // server tickspeed and ip 

const formatTime = (seconds: number) => {  //build formatted timer 
  const hours = Math.floor(seconds / 3600); // build hours timer 
  const minutes = Math.floor((seconds % 3600) / 60); //build minutes timer
  const secs = seconds % 60; // build seconds timer 

  return [hours, minutes, secs].map(v => v < 10 ? "0" + v : v).join(":");
};

const MissionClock = () => {   //using pacific timezone, build a corresponding mission clock
  return (
    <div className="flex flex-row">
    <div className="text-4xl font-semibold mb-4 absolute pt-0">
      <Clock format={"hh:mm:ss A"} ticking={true} timezone={"US/Pacific"} /> 
    </div>
    </div>
  );
};

const MissionStopwatch = () => {  
  const [formattedTime, setFormattedTime] = useState("00:00:00"); //uses formatted Time and uses time state to diplay
  // ... (other state variables)

  useEffect(() => {  //use Effect command to use timer using telemetry 
      const interval = setInterval(async () => {
          try {   //uses try catch hook to catch error if occured
              const data = await fetchWithoutParams<{ telemetry: { eva_time: number } }>('tss/telemetry'); //fetch eva elapsed time, from tss server if on
              if (data?.telemetry?.eva_time !== undefined) {
                setFormattedTime(formatTime(data.telemetry.eva_time)); //sets formatted time from telemetry to correct format
            }
              
          } catch (error) {
              console.error('Error fetching eva_time:', error); // Error check 
          }
      }, lmcc_config.tickspeed); //tickspeed from lmcc

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

const UIAStopwatch = () => {
  const[formattedTime, setFormattedTime] = useState("00:00:00"); //uses formatted Time and uses time state to diplay

  useEffect(() => {  //use Effect command to use timer using telemetry
    const interval = setInterval(async () => {
        try {  //uses try catch hook to catch error if occured
            const data = await fetchWithoutParams<{ eva: { uia: {time: number }}}>('tss/eva_info' ); //fetch uia elapsed time through eva_info dictionary, uia time 
            if (data?.eva?.uia?.time !== undefined) {
              setFormattedTime(formatTime(data.eva.uia.time)); //sets formatted time from telemetry to correct format
          }
            
        } catch (error) {
            console.error('Error fetching uia_time:', error); // Error check 
        }
    }, lmcc_config.tickspeed);

    return () => clearInterval(interval);
}, [/* dependencies */]);

    return (
   
     
      <div className="flex flex-col">
          <div className="text-2xl font-semibold mb-1 absolute pb-0">
              {formattedTime}
          </div>
      </div>
  );
    

}



const SpecStopwatch = () => {
  const[formattedTime, setFormattedTime] = useState("00:00:00"); 

  useEffect(() => { //use Effect command to use timer using telemetry
    const interval = setInterval(async () => {
        try {
            const data = await fetchWithoutParams<{ eva: { spec: {time: number }}}>('tss/eva_info' ); //fetch spec elapsed time through eva_info dictionary, spec time 
            if (data?.eva?.spec?.time !== undefined) {
              setFormattedTime(formatTime(data.eva.spec.time));
          }
            
        } catch (error) {
            console.error('Error fetching spec_time:', error); // Error check 
        }
    }, lmcc_config.tickspeed);

    return () => clearInterval(interval);
}, [/* dependencies */]);

    return (
   
     
      <div className="flex flex-row">
          <div className="text-2xl font-semibold mb-4 absolute pt-0">
              {formattedTime}
          </div>
      </div>
  );
    

}

const RoverStopwatch = () => {
  const[formattedTime, setFormattedTime] = useState("00:00:00"); 

  useEffect(() => {  //use Effect command to use timer using telemetry
    const interval = setInterval(async () => {
        try {
            const data = await fetchWithoutParams<{ eva: { rover: {time: number }}}>('tss/eva_info' ); //fetch rover elapsed time through eva_info dictionary, rover time 
            if (data?.eva?.rover?.time !== undefined) {
              setFormattedTime(formatTime(data.eva.rover.time));
          }
            
        } catch (error) {
            console.error('Error fetching rover_time:', error); // Error check 
        }
    }, lmcc_config.tickspeed);

    return () => clearInterval(interval);
}, [/* dependencies */]);

    return (
   
     
      <div className="flex flex-row">
          <div className="text-2xl font-semibold mb-4 absolute pt-0">
              {formattedTime}
          </div>
      </div>
  );
    

}


const DCUStopwatch = () => {
  const[formattedTime, setFormattedTime] = useState("00:00:00"); 

  useEffect(() => {  //use Effect command to use timer using telemetry
    const interval = setInterval(async () => {
        try {
            const data = await fetchWithoutParams<{ eva: { dcu: {time: number }}}>('tss/eva_info' ); //fetch dcu elapsed time through eva_info dictionary, dcu time 
            if (data?.eva?.dcu?.time !== undefined) {
              setFormattedTime(formatTime(data.eva.dcu.time));
          }
            
        } catch (error) {
            console.error('Error fetching dcu_time:', error); // Error check 
        }
    }, lmcc_config.tickspeed);

    return () => clearInterval(interval);
}, [/* dependencies */]);

    return (
   
     
      <div className="flex flex-row">
          <div className="text-2xl font-semibold mb-4 absolute pt-0">
              {formattedTime}
          </div>
      </div>
  );
    

}


const Timers = () => {
  return (                                             //main container for overall layout
    <div className="flex flex-col pt-2 pl-2 gap-y-3 pr-3">
      
      <div className="flex flex-row pl-2 gap-x-6">
        <div className="flex flex-col">
          <p className="font-bold text-md">Current Time</p>
          <MissionClock />
        </div>

        <div className="flex flex-col pl-32">
          <p className="font-bold text-md">Mission Elapsed Time</p>
          <MissionStopwatch />
        </div>
      </div>

      <div className="flex flex-row gap-x-5 space-x-5 mt-10 pr-6"> 
        <div>
          <p className="font-bold text-md pr-3">UIA Time</p>
          <UIAStopwatch />
        </div>
        <div>
          <p className="font-bold text-md">Spec Time</p>
          <SpecStopwatch />
        </div>
        <div>
          <p className="font-bold text-md">Rover Time</p>
          <RoverStopwatch />
        </div>
        <div>
          <p className="font-bold text-md">DCU Time</p>
          <DCUStopwatch />
        </div>
      </div>
    </div>
  );
};



export default Timers;
