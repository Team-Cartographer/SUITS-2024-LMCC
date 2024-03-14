"use client";

import ContentManager from "@/components/general/content-manager";
/**
 * @author @abhi-arya1 @ivanvuong @areich128 @hrishikesh-srihari
 * @function TelemetryPage
 * @fileoverview Coming once all "TODO:" are complete
 */


import PanicButton from "@/components/hmd_link/panic_button";
import { RoverTelemetry } from "@/components/rover/rover_telemetry";
import dynamic from "next/dynamic";


const NoSSR_Timers = dynamic(() => import('@/components/ui/timing'), { ssr: false })


function TelemetryPage() {
  return (
    <div className="h-full flex flex-row gap-x-4">
      <div className="absolute top-0 left-0 p-1 h-full flex flex-row gap-x-1 justify-start text-3xl font-bold"> <NoSSR_Timers /></div>
      <div className="absolute top-4 left-[42rem] p-1 h-full flex flex-row gap-x-1 justify-start text-3xl font-bold"> <PanicButton /></div>
      <div className=" bg-slate-600 flex-grow items-center justify-center rounded-r-2xl p-2 pl-3">
      <div className="flex flex-col items-start justify-center gap-y-10 ml-auto">
        <span className="items-top-left justify-start text-4xl font-semibold pt-48 pb-10 underline drop-shadow-2xl">
          Rover Pilot Interface
        </span>
      </div>
      <RoverTelemetry />
    </div>
    <ContentManager /> {/* temporarily here to check scaling */}
    </div>
    )
  }

  export default TelemetryPage;
