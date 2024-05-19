"use client";


/**
 * @author @abhi-arya1 @ivanvuong @areich128 @hrishikesh-srihari
 * @function TelemetryPage
 * @fileoverview Coming once all "TODO:" are complete
 */


import PanicButton from "@/components/hmd_link/panic_button";
import ScreenTwoContentManager from "@/components/general/sc_two_content_manager";
import dynamic from "next/dynamic";
import TodoLister from "@/components/hmd_link/todo-lister";
import RoverTelemetry from "@/components/rover/rover_telemetry";
import { Button } from "@/components/ui/button";
import { fetchWithoutParams } from "@/api/fetchServer";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";


const NoSSR_Timers = dynamic(() => import('@/components/ui/timing'), { ssr: false })
const NoSSR_LiveView = dynamic(() => import ('@/components/rover/rover_interface'), { ssr: false })


const ScreenTwo = () => {
  const [loading, setLoading] = useState(false); 

  return (
    <div className="h-screen flex flex-row gap-x-4">

      <div className="absolute top-0 left-0 p-1 flex flex-row gap-x-1 justify-start text-3xl font-bold"> <NoSSR_Timers /></div>
      <div className="absolute top-4 left-[40rem] p-1 flex flex-row gap-x-1 justify-start text-3xl font-bold"><PanicButton /></div>
      

      <div className=" bg-slate-600 flex-col w-[1050px] items-center justify-center rounded-r-2xl p-2 pl-3">
        <div className="flex flex-col pt-[180px]">
          <NoSSR_LiveView />
          <div className="flex flex-row items-center gap-x-2">
            <TodoLister />
            <RoverTelemetry />
            <Button onClick={async () => {
              setLoading(true);
              await fetchWithoutParams("navigate");
              setLoading(false);
            }}>
              {loading ? <Spinner /> : "Navigate"}
            </Button>
          </div>
        </div>
      </div>
      <ScreenTwoContentManager />
    </div>
    )
}

export default ScreenTwo;
