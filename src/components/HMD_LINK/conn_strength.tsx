/* eslint-disable no-nested-ternary */
import { SignalHigh, SignalLow, SignalMedium } from 'lucide-react';

interface ConnStrengthProps {
    desc: string;
    ping: number;
    // eslint-disable-next-line react/require-default-props
    className?: string;
}

function ConnectionStrength({ desc, ping, className = '' }: ConnStrengthProps) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, prefer-const

    return (
        <div className={`pt-3 ${className}`}>
            <div
                className={`text-sm flex flex-row bg-gray-300 rounded-xl p-2 items-center justify-center ${
                    ping > 15 ? 'border-2 border-red-500' : ''
                }`}
            >
                {desc}:
                {ping <= 10 ? (
                    <SignalHigh className="h-7 w-7 icon-outline pl-1" />
                ) : ping > 10 && ping <= 20 ? (
                    <SignalMedium className="h-7 w-7 icon-outline pl-1" />
                ) : (
                    <SignalLow className="h-7 w-7 icon-outline pl-1" />
                )}
            </div>
        </div>
    );
}

export default ConnectionStrength;
