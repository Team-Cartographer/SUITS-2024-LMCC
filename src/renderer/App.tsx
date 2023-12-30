import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Timers from '../components/timing';
// import teamCartographerLogo from '../../assets/icons/team_cartographer_logo_rounded_edges.png';
import './App.css';

function MainPage() {
    return (
        <div className="flex flex-col items-left pl-2 justify-center default-font">
            <Timers />
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
