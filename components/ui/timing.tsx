"use client";

/**
 * @author @abhi-arya1
 * @function Timers
 * @fileoverview https://docs.google.com/document/d/1hmx74L0iU5ikTFpniqynhU_xts1HKvM1jPmr64Lin-o/
 */

import React from "react";
import { Loop, Pause, PlayArrow } from "@mui/icons-material";
import { useStopwatch } from "../providers/stopwatch_provider";
import Clock from "react-live-clock";
import { Button } from "./button";

const MissionClock = () => {
  return (
    <div className="text-4xl font-semibold mb-4 absolute pt-6">
      <Clock format={"hh:mm:ssa"} ticking={true} timezone={"US/Pacific"} />
    </div>
  );
};

function Stopwatch() {
  const { isRunning, formattedTime, handleStartStop, handleReset } =
    useStopwatch();

  return (
    <div className="flex flex-row">
      <div className="text-4xl font-semibold mb-4 absolute pt-0">
        {formattedTime}
      </div>
      <div className="pl-40">
        <Button
          size="icon"
          variant="ghost"
          onClick={handleStartStop}
          className="pl-3 text-muted-foreground hover:text-slate-600 hover:bg-transparent"
        >
          {isRunning ? <Pause /> : <PlayArrow />}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleReset}
          className="pl-1 text-muted-foreground hover:text-slate-600 hover:bg-transparent"
        >
          <Loop />
        </Button>
      </div>
    </div>
  );
}

const Timers = () => {
  return (
    <div className="flex flex-row pt-2 pl-2 gap-x-6">
      <div className="flex flex-col">
        <p className="font-bold text-md">Current Time</p>
        <MissionClock />
      </div>

      <div className="flex flex-col pl-32">
        <p className="font-bold text-md">Mission Elapsed Time</p>
        <Stopwatch />
      </div>
    </div>
  );
};

export default Timers;
