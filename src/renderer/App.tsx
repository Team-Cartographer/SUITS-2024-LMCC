import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Timers from '../components/timing';
import './App.css';
import GitHubButton from '../components/github_button';

function MainPage() {
    return (
        <div className="flex flex-col items-left pl-2 justify-center default-font">
            <Timers />
            <GitHubButton />
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
