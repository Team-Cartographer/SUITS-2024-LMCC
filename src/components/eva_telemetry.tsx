/* eslint-disable react/require-default-props */

interface TelemetryArgs {
    evaNumber: string;
    bpm: string;
    temp: string;
    oxygenation: string;
    className?: string;
}

function EvaTelemetry({
    evaNumber,
    bpm,
    temp,
    oxygenation,
    className = '',
}: TelemetryArgs) {
    return (
        <div className="pt-4">
            <div
                className={`flex flex-row gap-x-6 p-4 bg-darkGray rounded-3xl 2xl:items-center justify-start ${className}`}
            >
                <p>EVA {evaNumber}:</p>
                <p>
                    {bpm} <span className="text-red-500">BPM</span>
                </p>
                <p>
                    {temp}
                    <span className="text-yellow-600">°F</span>
                </p>
                <p>
                    {oxygenation}
                    <span className="text-green-400"> SpO2</span>
                </p>
            </div>
        </div>
    );
}

export default EvaTelemetry;
