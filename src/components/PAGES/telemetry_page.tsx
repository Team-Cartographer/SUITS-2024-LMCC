import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Timers from '../UI_AND_UX/timing';

function TelemetryPage() {
    const navigate = useNavigate();

    return (
        <div className="h-full flex flex-row gap-x-4 items-center justify-center">
            <Timers />
            <Button
                onClick={() => {
                    navigate('/');
                }}
            >
                Back to Home
            </Button>
        </div>
    );
}

export default TelemetryPage;
