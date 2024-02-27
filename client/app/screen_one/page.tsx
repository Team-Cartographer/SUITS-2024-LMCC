"use client";

/**
 * @author @abhi-arya1
 * @function HomePage
 * @fileoverview https://docs.google.com/document/d/1DABLaMeVG6YfqvkmPyuQxoyOtKfFTCykDSIMbTua3FQ/
 */

import dynamic from 'next/dynamic'
import PanicButton from "@/components/hmd_link/panic_button";
import ConnectionStrength from "@/components/hmd_link/conn_strength";
import { CameraFeed } from "@/components/hmd_link/camera_feed";
import TodoLister from "@/components/hmd_link/todo-lister";
import ContentManager from "@/components/general/content-manager";
 
const NoSSR_Timers = dynamic(() => import('@/components/ui/timing'), { ssr: false })

const HomePage = () => {
  return (
    <div className="h-full flex flex-row gap-x-4">
      <div className="flex flex-col items-left pl-3 justify-start max-w-[600px]">
        <NoSSR_Timers />
        <CameraFeed />
        <CameraFeed />
        <TodoLister />
      </div>
      <div className="h-full flex items-center justify-start pt-9 flex-col gap-x-4">
        <PanicButton />
        <ConnectionStrength desc="EVA 1" ping={25} />
        <ConnectionStrength desc="EVA 2" ping={5} />
        <ConnectionStrength desc="ROVER" ping={10} />
      </div>
      <div className=" bg-slate-600 flex flex-grow items-center justify-center rounded-l-2xl p-2 pl-3">
        <div className="flex flex-col items-center justify-center gap-y-10">
          <ContentManager />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
