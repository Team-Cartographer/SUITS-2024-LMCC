/**
 * @author @abhi-arya1 @ivanvuong
 * @function EvaTelemetry
 */

const BPM_LOWER_THRESH = 60;
const BPM_UPPER_THRESH = 100;
const TEMP_LOWER_THRESH = 97;
const TEMP_UPPER_THRESH = 99;
const BR_LOWER_THRESH = 12;
const BR_UPPER_THRESH = 20;
const BP_SYS_LOWER_THRESH = 90;
const BP_SYS_UPPER_THRESH = 140;
const BP_DIA_LOWER_THRESH = 60;
const BP_DIA_UPPER_THRESH = 120;

interface TelemetryArgs {
    className?: string;
    evaNumber: string;
    bpm: string;
    temp: string;
    breathing_rate: string;
    blood_pressure: [string, string];
}

function EvaTelemetry({
    className = '',
    evaNumber,
    bpm,
    temp,
    breathing_rate,
    blood_pressure,
}: TelemetryArgs) {
    let bpmCritical: boolean = parseInt(bpm, 10) > BPM_UPPER_THRESH || parseInt(bpm, 10) < BPM_LOWER_THRESH;
    let tempCritical: boolean = parseInt(temp, 10) > TEMP_UPPER_THRESH || parseInt(bpm, 10) < TEMP_LOWER_THRESH;
    let breathingRateCritical: boolean = parseInt(breathing_rate, 10) > BR_UPPER_THRESH || parseInt(breathing_rate, 10) < BR_LOWER_THRESH;
    let bloodPressureCritical: boolean = parseInt(blood_pressure[0], 10) > BP_SYS_UPPER_THRESH || parseInt(blood_pressure[0], 10) < BP_SYS_LOWER_THRESH
    || parseInt(blood_pressure[1], 10) > BP_DIA_UPPER_THRESH || parseInt(blood_pressure[1], 10) < BP_DIA_LOWER_THRESH;

    return (
        <div className={className}>
            <div
                className={`flex flex-row gap-x-6 text-3xl ${
                    bpmCritical || tempCritical || breathingRateCritical || bloodPressureCritical
                        ? `bg-red-500 bg-opacity-50`
                        : 'bg-gray-750'
                } rounded-t-3xl p-1 font-semibold items-center justify-center`}
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
                        breathingRateCritical ? 'underline italic font-bold' : ''
                    }`}
                >
                    {breathing_rate}
                    <span className="text-blue-400"> BRPM</span>
                </p>
                <p
                    className={`${
                        bloodPressureCritical ? 'underline italic font-bold' : ''
                    }`}
                >
                    {blood_pressure[0]}/{blood_pressure[1]}
                    <span className="text-orange-400"> mmHg</span>
                </p>
            </div>
        </div>
    );
}

export default EvaTelemetry;
