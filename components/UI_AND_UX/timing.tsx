"use client";

/**
 * @author @abhi-arya1
 * @function Timers
 * @fileoverview https://docs.google.com/document/d/1hmx74L0iU5ikTFpniqynhU_xts1HKvM1jPmr64Lin-o/
 */

/* eslint-disable react/destructuring-assignment */
/* eslint-disable max-classes-per-file */
import React, { useState, useEffect } from "react";
import { Loop, Pause, PlayArrow } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useStopwatch } from "../providers/stopwatch_provider";

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const formatTime = (date: any) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    const strHours = hours < 10 ? `0${hours}` : hours;
    const strMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const strSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${strHours}:${strMinutes}:${strSeconds} ${ampm}`;
  };

  return (
    <div className="text-4xl font-semibold mb-4">{formatTime(currentTime)}</div>
  );
};

function Stopwatch() {
  const { isRunning, formattedTime, handleStartStop, handleReset } =
    useStopwatch();

  return (
    <div className="flex flex-row">
      <div className="text-4xl font-semibold mb-4">{formattedTime}</div>
      <IconButton
        aria-label="start-stop"
        onClick={handleStartStop}
        className="text-gray-200 h-9 pl-4 hover:text-gray-10"
      >
        {isRunning ? <Pause /> : <PlayArrow />}
      </IconButton>
      <IconButton
        aria-label="start-stop"
        onClick={handleReset}
        className="text-gray-200 h-9 pl-3 hover:text-gray-10"
      >
        <Loop />
      </IconButton>
    </div>
  );
}

function Timers() {
  return (
    <div className="flex flex-row pt-2 pl-2 gap-x-6">
      <div className="flex flex-col">
        <span className="font-bold text-md">Current Time</span>
        <Clock />
      </div>

      <div className="flex flex-col pl-5">
        <span className="font-bold text-md">Mission Elapsed Time</span>
        <Stopwatch />
      </div>
    </div>
  );
}

export default Timers;
