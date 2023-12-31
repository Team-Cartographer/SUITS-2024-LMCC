import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Timers from '../components/UI_AND_UX/timing';
import GitHubButton from '../components/UI_AND_UX/github_button';
import EvaTelemetry from '../components/EVA/eva_telemetry';
import PanicButton from '../components/HMD_LINK/panic_button';
import ConnectionStrength from '../components/HMD_LINK/conn_strength';
import EVALiveView from '../components/HMD_LINK/eva_live_view';

function MainPage() {
    return (
        <div className="h-full flex flex-row gap-x-4">
            <div className="flex flex-col items-left pl-2 justify-center">
                <Timers />
                <GitHubButton />
                <EvaTelemetry
                    evaNumber="1"
                    bpm="129"
                    temp="97"
                    oxygenation="91.0"
                />
                <EVALiveView
                    evaNumber={1}
                    url="https://www.youtube.com/watch?v=lPyl6d2FJGw"
                    volume={0}
                />
                <EvaTelemetry
                    className="pt-3"
                    evaNumber="2"
                    bpm="78"
                    temp="97.2"
                    oxygenation="99.0"
                />
                <EVALiveView
                    evaNumber={2}
                    url="https://youtu.be/WkwULe0h5-g?t=427"
                    volume={0}
                />
            </div>
            <div className="h-full flex flex-col gap-x-4">
                <PanicButton />
                <ConnectionStrength desc="EVA 1" ping={25} />
                <ConnectionStrength desc="EVA 2" ping={5} />
                <ConnectionStrength desc="ROVER" ping={10} />
            </div>
            <div className="pl-2 bg-gray-200 flex-grow rounded-l-2xl">Test</div>
        </div>
    );
}

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage />} />
            </Routes>
        </Router>
    );
}
