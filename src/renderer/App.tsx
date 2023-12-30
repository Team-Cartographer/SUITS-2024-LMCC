import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Timers from '../components/UI_AND_UX/timing';
import GitHubButton from '../components/UI_AND_UX/github_button';
import EvaTelemetry from '../components/EVA/eva_telemetry';
import PanicButton from '../components/HMD_LINK/panic_button';
import ConnectionStrength from '../components/HMD_LINK/conn_strength';

function MainPage() {
    return (
        <div className="h-full flex flex-row gap-x-4">
            <div className="flex flex-col items-left pl-2 justify-center">
                <Timers />
                <GitHubButton />
                <EvaTelemetry
                    evaNumber="1"
                    bpm="129"
                    temp="100"
                    oxygenation="91.0"
                />
                <EvaTelemetry
                    evaNumber="2"
                    bpm="78"
                    temp="97.2"
                    oxygenation="99.0"
                />
            </div>
            <div className="h-full flex flex-col gap-x-4">
                <PanicButton />
                <ConnectionStrength evaNumber="1" />
                <ConnectionStrength evaNumber="2" />
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
