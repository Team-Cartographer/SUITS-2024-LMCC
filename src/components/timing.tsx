import React from 'react';

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

function Timers() {
    return (
        <div className="flex flex-row pt-2 gap-x-6">
            <div className="flex flex-col">
                <p className="font-bold text-md">Current Time</p>
                <Clock />
            </div>
            <div className="flex flex-col pl-5">
                <p className="font-bold text-md">Mission Elapsed Time</p>
                <h1 className="font-bold text-4xl italic underline">temp</h1>
            </div>
        </div>
    );
}

export default Timers;
