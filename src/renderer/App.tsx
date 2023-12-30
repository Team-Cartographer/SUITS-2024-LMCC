import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Timers from '../components/timing';
import './App.css';
import GitHubButton from '../components/github_button';
import EvaTelemetry from '../components/eva_telemetry';

function MainPage() {
    return (
        <div className="flex flex-col items-left pl-2 justify-center default-font">
            <Timers />
            <GitHubButton />
            <EvaTelemetry
                className="text-3xl w-1/3"
                evaNumber="1"
                bpm="80"
                temp="98.0"
                oxygenation="98.0"
            />
            <EvaTelemetry
                className="text-3xl w-1/3"
                evaNumber="2"
                bpm="78"
                temp="97.2"
                oxygenation="99.0"
            />
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
