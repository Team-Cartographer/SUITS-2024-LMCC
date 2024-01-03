/* eslint-disable react/destructuring-assignment */
/* eslint-disable max-classes-per-file */
import React from 'react';
import 'tailwindcss/tailwind.css';
import { Loop, Pause, PlayArrow } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useStopwatch } from '../../providers/stopwatch_provider';

type ClockState = {
    date: Date;
};

class Clock extends React.Component<{}, ClockState> {
    timerID: number | undefined;

    constructor(props: {}) {
        super(props);
        this.state = { date: new Date() };
    }

    componentDidMount() {
        this.timerID = window.setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        if (this.timerID !== undefined) {
            window.clearInterval(this.timerID);
        }
    }

    tick() {
        this.setState({
            date: new Date(),
        });
    }

    render() {
        return (
            <div className="flex flex-row font-bold text-4xl">
                {/* eslint-disable-next-line react/destructuring-assignment */}
                <h2>{this.state.date.toLocaleTimeString()}</h2>
            </div>
        );
    }
}

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
                <p className="font-bold text-md">Current Time</p>
                <Clock />
            </div>

            <div className="flex flex-col pl-5">
                <p className="font-bold text-md">Mission Elapsed Time</p>
                <Stopwatch />
            </div>
        </div>
    );
}

export default Timers;
