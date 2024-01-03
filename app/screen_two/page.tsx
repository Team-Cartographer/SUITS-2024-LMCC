"use client";

/**
 * @author @abhi-arya1
 * @function TelemetryPage
 * @fileoverview Coming once all "TODO:" are complete
 */

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import Timers from "@/components/UI_AND_UX/timing";

function TelemetryPage() {
  const router = useRouter();

  return (
    <div className="h-full flex flex-row gap-x-4 items-center justify-center">
      <Timers />
      <Button
        onClick={() => {
          router.push("/screen_one");
        }}
      >
        Back to Home
      </Button>
      {/* TODO: Finish this file */}
    </div>
  );
}

export default TelemetryPage;
