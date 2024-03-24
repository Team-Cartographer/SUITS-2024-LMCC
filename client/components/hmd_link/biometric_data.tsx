/**
 * @author @abhi-arya1 @ivanvuong
 * @function EvaTelemetry
 */
import { useNetwork } from "@/hooks/context/network-context";

const BPM_LOWER_THRESH = 50;
const BPM_UPPER_THRESH = 160;
const TEMP_LOWER_THRESH = 50;
const TEMP_UPPER_THRESH = 90;
const BR_LOWER_THRESH = 0.05;
const BR_UPPER_THRESH = 0.15;

interface TelemetryArgs {
    className?: string;
    evaNumber: number;
    bpm: number;
    temp: number;
    oxy: number;
}

function BiometricTelemetry({
    className = '',
    evaNumber,
    bpm,
    temp,
    oxy,
}: TelemetryArgs) {
    const { getTelemetryData } = useNetwork();
    const biometricDataEva = getTelemetryData(evaNumber)

    bpm = biometricDataEva.telemetry.eva.heart_rate;
    temp = biometricDataEva.telemetry.eva.temperature;
    oxy = biometricDataEva.telemetry.eva.oxy_consumption;

    let bpmCritical: boolean = bpm > BPM_UPPER_THRESH || bpm < BPM_LOWER_THRESH;
    let tempCritical: boolean = temp > TEMP_UPPER_THRESH || temp < TEMP_LOWER_THRESH;
    let oxyCritical: boolean = oxy > BR_UPPER_THRESH || oxy < BR_LOWER_THRESH;

    

    return (
        <div className={className}>
            <div
                className={`flex flex-row gap-x-6 text-xl ${
                    bpmCritical || tempCritical || oxyCritical
                        ? 'bg-red-500 bg-opacity-50'
                        : 'bg-slate-600'
                } rounded-t-3xl p-1 pl-5 pr-5 font-semibold items-start gap-x-4`}
            >
                <p>EVA {evaNumber}:</p>
                <p
                    className={`${
                        bpmCritical ? 'underline italic font-bold' : ''
                    }`}
                >
                    {bpm.toFixed(2)} <span className="text-red-500">BPM</span>
                </p>
                <p
                    className={`${
                        tempCritical ? 'underline italic font-bold' : ''
                    }`}
                >
                    {temp.toFixed(2)}
                    <span className="text-yellow-600">°F</span>
                </p>
                <p
                    className={`${
                        oxyCritical ? 'underline italic font-bold' : ''
                    }`}
                >
                    {oxy.toFixed(2)}
                    <span className="text-blue-400"> PSI/MIN</span>
                </p>
            </div>
        </div>
    );
}

export default BiometricTelemetry;
