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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useNetwork } from '@/hooks/context/network-context';
import { TaskStatus } from '@/lib/types';
 
const NoSSR_Timers = dynamic(() => import('@/components/ui/timing'), { ssr: false })

const HomePage = () => {
  const evaStatus = useNetwork().getEvaData()

  const getPhaseStatus = (task: TaskStatus, name: string) => {
    if(task.completed) { 
      return `${name} completed`
    } else if (task.started) { 
      return `${name} started`
    } else { 
      return `${name} not started`
    }
  };

  const getPhaseStyle = (task: TaskStatus) => { 
    if(task.completed) { 
      return 'text-green-500'
    } else if (task.started) { 
      return 'text-yellow-500'
    } else { 
      return 'text-red-500'
    }
  }
  
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
        <div className="flex flex-row gap-x-2">
        <Alert className="font-bold">
          <AlertTitle>EVA Phase Manager</AlertTitle>
            <AlertDescription className="grid grid-rows-2 grid-cols-2 pt-2">
            <div className={getPhaseStyle(evaStatus.uia)}>{getPhaseStatus(evaStatus.uia, 'UIA')}</div>
            <div className={getPhaseStyle(evaStatus.dcu)}>{getPhaseStatus(evaStatus.dcu, 'DCU')}</div>
            <div className={getPhaseStyle(evaStatus.rover)}>{getPhaseStatus(evaStatus.rover, 'Rover')}</div>
            <div className={getPhaseStyle(evaStatus.spec)}>{getPhaseStatus(evaStatus.spec, 'Spec')}</div>
          </AlertDescription>
        </Alert>
        <div className="flex flex-col items-center gap-y-2 justify-center pb-2 pt-1">
          <PhotoCapture eva={1} />
          <PhotoCapture eva={2} />
        </div>
        </div>
      </div>
      <div className="bg-slate-600 p-4 flex-1 overflow-auto">
          <ScreenOneContentManager />
      </div>
    </div>
  );
};

export default HomePage;
