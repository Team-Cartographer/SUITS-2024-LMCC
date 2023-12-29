import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { GitHub } from '@mui/icons-material';

function Hello() {
  return (
    <div className="flex flex-col items-center justify-center default-font">
      <h1 className="pt-5 font-extrabold text-6xl">Hello Tailwind</h1>
      <GitHub />
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
