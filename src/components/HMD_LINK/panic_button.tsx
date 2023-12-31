import { Button } from '@mui/material';
import { AlertTriangle } from 'lucide-react';

function onPanic() {
    // TODO: add panic button functionality
    // eslint-disable-next-line no-console
    console.log('Panic Pressed');
}

function PanicButton() {
    return (
        <div className="pt-8 pl-3">
            <Button
                className="bg-red-600 h-10 w-16 text-red-200"
                onClick={onPanic}
            >
                <AlertTriangle />
            </Button>
        </div>
    );
}

export default PanicButton;