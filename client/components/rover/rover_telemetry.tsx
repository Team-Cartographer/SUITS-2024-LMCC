/**
 * @author @ivanvuong @abhi-arya1 @hrishikesh-srihari
 * @function Telemetry
 * @fileoverview 
 */

export function RoverTelemetry() {
    const var1 = 1.312
    const var2 = 5.341
    const var3 = 3.312
    return (
        <div className="rounded-xl border border-gray-700 p-4 max-h-[270px] max-w-[600px] mb-4 shadow-green-700/50 shadow-2xl  bg-gray-700">
        <h3 className="text-5xl justify-center" >Telemetry Values</h3>
        <ul className="list-group">
            <li className = "list-group-item text-3xl mt-5">Value 1: {var1}</li>
            <li className = "list-group-item text-3xl mt-5">Value 2: {var2}</li>
            <li className = "list-group-item text-3xl mt-5">Value 3: {var3}</li>
        </ul>
        </div>
    );
}

