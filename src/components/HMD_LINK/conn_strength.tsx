/* eslint-disable no-nested-ternary */
import { SignalHigh, SignalLow, SignalMedium } from 'lucide-react';

interface ConnStrengthProps {
    evaNumber: string;
}

function ConnectionStrength({ evaNumber }: ConnStrengthProps) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, prefer-const
    let ping = 15;

    return (
        <div className="pt-3">
            <div className="flex flex-row bg-gray-300 rounded-xl p-2">
                EVA {evaNumber}:
                {ping <= 10 ? (
                    <SignalHigh className="icon-outline pl-1" />
                ) : ping > 10 && ping <= 20 ? (
                    <SignalMedium className="icon-outline pl-1" />
                ) : (
                    <SignalLow className="icon-outline pl-1" />
                )}
            </div>
        </div>
    );
}

export default ConnectionStrength;
