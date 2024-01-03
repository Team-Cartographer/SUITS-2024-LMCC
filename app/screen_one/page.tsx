"use client";

/**
 * @author @abhi-arya1
 * @function HomePage
 * @fileoverview https://docs.google.com/document/d/1DABLaMeVG6YfqvkmPyuQxoyOtKfFTCykDSIMbTua3FQ/
 */

import { useRouter } from "next/navigation";
import { Button } from "@mui/material/";
import Timers from "@/components/ui_and_ux/timing";
import GitHubButton from "@/components/ui_and_ux/github_button";
import PanicButton from "@/components/hmd_link/panic_button";
import ConnectionStrength from "@/components/hmd_link/conn_strength";

function HomePage() {
  const router = useRouter();

  return (
    <div className="h-full flex flex-row gap-x-4">
      <div className="flex flex-col items-left pl-3 justify-start">
        <Timers />
        <GitHubButton />
      </div>
      <div className="h-full flex flex-col gap-x-4">
        <PanicButton />
        <ConnectionStrength desc="EVA 1" ping={25} />
        <ConnectionStrength desc="EVA 2" ping={5} />
        <ConnectionStrength desc="ROVER" ping={10} />

        <div className="flex flex-row items-center justify-center pb-4 text-gray-50">
          ______
        </div>
        <Button
          className="bg-slate-600 text-white rounded-xl p-2 normal-case hover:bg-slate-700  custom-text-shadow"
          onClick={() => {
            router.push("/screen_two");
          }}
        >
          Raw Telemetry
        </Button>
      </div>
      <div className="pl-2 bg-slate-600 flex-grow rounded-l-2xl">Test</div>
    </div>
  );
}

export default HomePage;
