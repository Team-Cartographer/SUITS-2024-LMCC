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
import ScreenOneContentManager from "@/components/general/sc_one_content_manager";
import BiometricTelemetry from "@/components/hmd_link/biometric_data";
import lmcc_config from "@/lmcc_config.json"
import PhotoCapture from '@/components/hmd_link/photocap';
 
const NoSSR_Timers = dynamic(() => import('@/components/ui/timing'), { ssr: false })

const HomePage = () => {
  return (
    <div className="h-full flex flex-row gap-x-8">
      <div className="flex flex-col items-left pl-3 justify-start max-w-[600px]">
        <NoSSR_Timers />
        <BiometricTelemetry evaNumber={1} bpm={0.0} temp={0.0} oxy={0.0} className="pt-[4.2rem]" />
        <CameraFeed ip={lmcc_config.eva1_ip} />
        <BiometricTelemetry evaNumber={2} bpm={0.0} temp={0.0} oxy={0.0} />
        <CameraFeed ip={'1.2.3.4'} />
      </div>
      <div className="h-full flex items-center justify-start pt-9 flex-col gap-x-4">
        <PanicButton />
        <ConnectionStrength desc="EVA 1" ping={25} />
        <ConnectionStrength desc="EVA 2" ping={5} />
        <ConnectionStrength desc="ROVER" ping={10} />
        <PhotoCapture />
      </div>
      <div className=" bg-slate-600 flex flex-grow items-center justify-center rounded-l-2xl p-2 pl-3">
        <div className="flex flex-col items-center justify-center gap-y-10">
          <ScreenOneContentManager />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
