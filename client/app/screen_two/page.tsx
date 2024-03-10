"use client";

import Timers from "@/components/ui/timing";
import PanicButton from "@/components/hmd_link/panic_button";
import { RoverTelemetry } from "@/components/rover/rover_telemetry";

/**
 * @author @abhi-arya1 @ivanvuong @areich128
 * @function TelemetryPage
 * @fileoverview Coming once all "TODO:" are complete
 */


function TelemetryPage() {
  return (
    <div className="h-full flex flex-row gap-x-4">
      <div className=" bg-slate-600 flex-grow items-center justify-center rounded-r-2xl p-2 pl-3">
      <div className="flex flex-col items-start justify-center gap-y-10 ml-auto">
      <span className="items-top-left justify-start text-6xl font-semibold p-4">
        Rover Pilot Interface
      </span>
      </div>
    </div>
    <div className="absolute top-0 right-0 p-1 h-full flex flex-row gap-x-1 justify-start text-3xl font-bold"> <Timers /></div>
    <div className="absolute top-10 left-[900px] p-1 h-full flex flex-row gap-x-1 justify-start text-3xl font-bold"> <PanicButton /></div>
    <div className="absolute top-[500px] left-[250px] p-1 h-full flex flex-row gap-x-1 justify-start text-7xl font-bold"> <RoverTelemetry /></div>
    </div>
    )
  }

  export default TelemetryPage;
