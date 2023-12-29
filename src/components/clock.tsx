import React from 'react';

type ClockState = {
  date: Date;
};

export default class Clock extends React.Component<{}, ClockState> {
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
      <div className="flex flex-row font-bold text-6xl pt-2">
        {/* eslint-disable-next-line react/destructuring-assignment */}
        <h2>{this.state.date.toLocaleTimeString()} </h2>
      </div>
    );
  }
}
