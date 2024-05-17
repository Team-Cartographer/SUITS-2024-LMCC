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
import PhotoCapture from '@/components/hmd_link/photo_button';
 
const NoSSR_Timers = dynamic(() => import('@/components/ui/timing'), { ssr: false })

const HomePage = () => {
  return (
    <div className="h-screen flex flex-row gap-x-8 overflow-hidden">
      <div className="flex flex-col items-left pl-3 justify-start max-w-[600px] overflow-auto">
        <div>
          <NoSSR_Timers />
          <div className="flex flex-row items-center absolute top-[0.8rem] left-[26rem]">
            <PanicButton />
            <ConnectionStrength />
          </div>
        </div>
        <BiometricTelemetry evaNumber={1} bpm={0.0} temp={0.0} oxy={0.0} className="pt-[4.2rem]" />
        <CameraFeed ip={lmcc_config.eva1_ip} />
        <BiometricTelemetry evaNumber={2} bpm={0.0} temp={0.0} oxy={0.0} />
        <CameraFeed ip={lmcc_config.eva2_ip} />
        <div className="flex flex-row items-center gap-x-2 justify-center">
          <PhotoCapture eva={1} />
          <PhotoCapture eva={2} />
        </div>
      </div>
      <div className="bg-slate-600 p-4 flex-1 overflow-auto">
          <ScreenOneContentManager />
      </div>
    </div>
  );
};

export default HomePage;
