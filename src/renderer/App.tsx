import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { StopwatchProvider } from '../providers/stopwatch_provider';
import HomePage from '../components/PAGES/home_page';
import TelemetryPage from '../components/PAGES/telemetry_page';
import './App.css';

export default function App() {
    return (
        <Router>
            <StopwatchProvider>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/telemetry" element={<TelemetryPage />} />
                </Routes>
            </StopwatchProvider>
        </Router>
    );
}
