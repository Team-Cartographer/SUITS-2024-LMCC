"use client";


/**
 * @author @abhi-arya1 @ivanvuong @areich128 @hrishikesh-srihari
 * @function TelemetryPage
 * @fileoverview Coming once all "TODO:" are complete
 */


import PanicButton from "@/components/hmd_link/panic_button";
import ScreenTwoContentManager from "@/components/general/sc_two_content_manager";
import { RoverTelemetry } from "@/components/rover/rover_telemetry";
import dynamic from "next/dynamic";
import TodoLister from "@/components/hmd_link/todo-lister";


const NoSSR_Timers = dynamic(() => import('@/components/ui/timing'), { ssr: false })
const NoSSR_LiveView = dynamic(() => import ('@/components/rover/rover_live_view'), { ssr: false })


const ScreenTwo = () => {
  return (
    <div className="h-full flex flex-row gap-x-4">

      <div className="absolute top-0 left-0 p-1 flex flex-row gap-x-1 justify-start text-3xl font-bold"> <NoSSR_Timers /></div>
      <div className="absolute top-4 left-[39rem] p-1 flex flex-row gap-x-1 justify-start text-3xl font-bold"> <PanicButton /></div>

      <div className=" bg-slate-600 flex-grow items-center justify-center rounded-r-2xl p-2 pl-3">
        <div className="flex flex-col pt-[180px]">
          <RoverTelemetry />
          <NoSSR_LiveView />
          <TodoLister />
        </div>
      </div>

      <ScreenTwoContentManager />
    </div>
    )
}

export default ScreenTwo;
