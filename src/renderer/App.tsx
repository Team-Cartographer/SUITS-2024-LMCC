import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Clock from '../components/clock';
import teamCartographerLogo from '../../assets/icons/team_cartographer_logo_rounded_edges.png';

function Hello() {
    return (
        <div className="flex flex-col items-left pl-2 justify-center default-font">
            <img
                src={teamCartographerLogo}
                alt="Logo"
                height={50}
                width={50}
                className="pt-5"
            />
            <h1 className="pt-5 font-extrabold text-7xl">LMCC Console</h1>
            <Clock />
        </div>
    );
}

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Hello />} />
            </Routes>
        </Router>
    );
}
