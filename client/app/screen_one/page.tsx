"use client";

/**
 * @author @abhi-arya1
 * @function HomePage
 * @fileoverview https://docs.google.com/document/d/1DABLaMeVG6YfqvkmPyuQxoyOtKfFTCykDSIMbTua3FQ/
 */

import Timers from "@/components/ui/timing";
import PanicButton from "@/components/hmd_link/panic_button";
import ConnectionStrength from "@/components/hmd_link/conn_strength";
import Map from "@/components/ui/map";
import { CameraFeed, TempYoutubeVideo } from "@/components/hmd_link/camera_feed";

const HomePage = () => {
  return (
    <div className="h-full flex flex-row gap-x-4">
      <div className="flex flex-col items-left pl-3 justify-start max-w-[600px]">
        <Timers />
        <CameraFeed />
        <CameraFeed />
      </div>
      <div className="h-full flex items-center justify-start pt-9 flex-col gap-x-4">
        <PanicButton />
        <ConnectionStrength desc="EVA 1" ping={25} />
        <ConnectionStrength desc="EVA 2" ping={5} />
        <ConnectionStrength desc="ROVER" ping={10} />
      </div>
      <div className=" bg-slate-600 flex flex-grow items-center justify-center rounded-l-2xl p-2 pl-3">
        <Map />
      </div>
    </div>
  );
};

export default HomePage;
