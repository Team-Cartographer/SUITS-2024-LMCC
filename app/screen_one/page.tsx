"use client";

/**
 * @author @abhi-arya1
 * @function HomePage
 * @fileoverview https://docs.google.com/document/d/1DABLaMeVG6YfqvkmPyuQxoyOtKfFTCykDSIMbTua3FQ/
 */

import Timers from "@/components/ui_and_ux/timing";
import GitHubButton from "@/components/ui_and_ux/github_button";
import PanicButton from "@/components/hmd_link/panic_button";
import ConnectionStrength from "@/components/hmd_link/conn_strength";

const HomePage = () => {
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
      </div>
      <div className="pl-2 bg-slate-600 flex-grow rounded-l-2xl">Test</div>
    </div>
  );
};

export default HomePage;
