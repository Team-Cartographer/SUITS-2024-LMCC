/**
 * @author @abhi-arya1
 * @license MIT
 * @function App
 * @fileoverview https://docs.google.com/document/d/1RSU4adTqKHaJnn8IgiJoPSRARFnAKAd_Uv6gaTrrB3Q/
 */

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
