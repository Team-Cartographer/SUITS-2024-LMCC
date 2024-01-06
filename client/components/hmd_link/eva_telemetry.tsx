/**
 * @author @abhi-arya1
 * @function EvaTelemetry
 * @fileoverview https://docs.google.com/document/d/1Xy8z90BzejGYqI_AKgyO51-lsJwjt9BTSWW9DCOqp5Q/
 */


const BPM_THRESH = 100;
const TEMP_THRESH = 99;
const O2_THRESH = 97;

interface TelemetryArgs {
    className?: string;
    evaNumber: string;
    bpm: string;
    temp: string;
    oxygenation: string;
}

function EvaTelemetry({
    className = '',
    evaNumber,
    bpm,
    temp,
    oxygenation,
}: TelemetryArgs) {
    let bpmCritical: boolean = parseInt(bpm, 10) > BPM_THRESH;
    let tempCritical: boolean = parseInt(temp, 10) > TEMP_THRESH;
    let oxygenationCritical: boolean = parseInt(oxygenation, 10) < O2_THRESH;

    return (
        <div className={className}>
            <div
                className={`flex flex-row gap-x-6 p-4 text-3xl ${
                    bpmCritical || tempCritical || oxygenationCritical
                        ? `bg-red-500 bg-opacity-50`
                        : 'bg-gray-750'
                } rounded-t-3xl items-center justify-start`}
            >
                <p>EVA {evaNumber}:</p>
                <p
                    className={`${
                        bpmCritical ? 'underline italic font-bold' : ''
                    }`}
                >
                    {bpm} <span className="text-red-500">BPM</span>
                </p>
                <p
                    className={`${
                        tempCritical ? 'underline italic font-bold' : ''
                    }`}
                >
                    {temp}
                    <span className="text-yellow-600">°F</span>
                </p>
                <p
                    className={`${
                        oxygenationCritical ? 'underline italic font-bold' : ''
                    }`}
                >
                    {oxygenation}
                    <span className="text-green-400"> SpO2</span>
                </p>
            </div>
        </div>
    );
}

export default EvaTelemetry;
