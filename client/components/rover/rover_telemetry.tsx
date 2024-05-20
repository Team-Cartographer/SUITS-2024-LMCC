import { useNetwork } from "@/hooks/context/network-context";
import {
    Alert,
    AlertDescription,
    AlertTitle,
  } from "@/components/ui/alert"
   

const RoverTelemetry = () => {
    const networkProvider = useNetwork(); 
    const roverData = networkProvider.getRoverData();

	return (
		<div className="flex flex-row gap-x-1 items-center justify-start p-2 pt-3">
            <Alert className="outline-muted-foreground outline">
                <AlertTitle className="text-muted-foreground">Rover State Data</AlertTitle>
                <AlertDescription className="pt-1 flex flex-row gap-x-6">
                    <p>
                    X: <span> </span>
                    {roverData?.rover.posx.toPrecision(5)}*
                    </p>
                    <p>
                    Y: <span> </span>
                    {roverData?.rover.posy.toPrecision(5)}*
                    </p>
                    <p>
                    QR ID: <span> </span>
                    {roverData?.rover.qr_id}
                    </p>
                </AlertDescription>
            </Alert>
        </div>
    );
}
 
export default RoverTelemetry;