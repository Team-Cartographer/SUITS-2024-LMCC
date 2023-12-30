/* eslint-disable react/destructuring-assignment */
/* eslint-disable max-classes-per-file */
import { Loop, Pause, PlayArrow } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import React from 'react';
import 'tailwindcss/tailwind.css';

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

interface StopwatchState {
    time: number;
    isRunning: boolean;
}

class Stopwatch extends React.Component<{}, StopwatchState> {
    interval: number | null = null;

    constructor(props: {}) {
        super(props);
        this.state = {
            time: 0,
            isRunning: false,
        };
    }

    componentDidUpdate(prevProps: {}, prevState: StopwatchState) {
        if (this.state.isRunning && !prevState.isRunning) {
            this.startTimer();
        } else if (!this.state.isRunning && prevState.isRunning) {
            this.stopTimer();
        }
    }

    componentWillUnmount() {
        this.stopTimer();
    }

    startTimer = () => {
        this.interval = window.setInterval(() => {
            this.setState((prevState) => ({ time: prevState.time + 1000 }));
        }, 1000);
    };

    stopTimer = () => {
        if (this.interval !== null) {
            window.clearInterval(this.interval);
            this.interval = null;
        }
    };

    handleReset = () => {
        this.stopTimer();
        this.setState({ time: 0, isRunning: false });
    };

    handleStartStop = () => {
        this.setState((prevState) => ({ isRunning: !prevState.isRunning }));
    };

    // eslint-disable-next-line class-methods-use-this
    formatTime = (time: number) => {
        const hours = Math.floor(time / 3600000);
        const minutes = Math.floor((time - hours * 3600000) / 60000);
        const seconds = Math.floor(
            (time - hours * 3600000 - minutes * 60000) / 1000,
        );

        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    render() {
        const { time, isRunning } = this.state;

        return (
            <div className="flex flex-row">
                <div className="text-4xl font-semibold mb-4">
                    {this.formatTime(time)}
                </div>
                <IconButton
                    aria-label="start-stop"
                    onClick={this.handleStartStop}
                    className="text-gray-200 h-9 pl-4 hover:text-gray-10"
                >
                    {isRunning ? <Pause /> : <PlayArrow />}
                </IconButton>
                <IconButton
                    aria-label="start-stop"
                    onClick={this.handleReset}
                    className="text-gray-200 h-9 pl-3 hover:text-gray-10"
                >
                    <Loop />
                </IconButton>
            </div>
        );
    }
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
