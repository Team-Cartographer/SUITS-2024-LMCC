/**
 * @author @abhi-arya1
 * @function ConnectionStrength
 */

import { Router } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Button } from "../ui/button";
import { useState } from "react";
import { fetchWithoutParams } from "@/api/fetchServer";
import { Spinner } from "../ui/spinner";

interface GatewayInfo {
    message: string;
    uptime: number; 
    get_requests: number;
    post_requests: number;
    total_requests: number;
    avg_requests_per_min: number;
}

const ConnectionStrength = () => {
  const [gatewayInfo, setGatewayInfo] = useState<GatewayInfo | null>(null);

  return (
    <div className="pt-4">
        <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link"><div 
                  className="rounded-xl group:condiv text-sm font-medium flex flex-row items-center px-4 py-[0.6rem] bg-primary text-primary-foreground hover:bg-primary/90 bg-slate-600 text-white hover:bg-slate-700"  
                  onMouseEnter={
                      async () => {
                        const response = await fetchWithoutParams<GatewayInfo>("apimonitor");
                        if(response) {
                          setGatewayInfo(response);
                        }
                      }
                  }
              >
                <Router className="h-4 w-4" /><span className="pl-2 group:condiv group-hover:underline">GATEWAY</span>
              </div></Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          {gatewayInfo ? (
            <div>
              <div className="text-lg font-bold pb-2 self-start">
                Gateway Info
              </div>
              <div className="pb-4 self-start text-base">
                <p>Uptime: {gatewayInfo.uptime}s</p>
                <p>Get Requests: {gatewayInfo.get_requests}</p>
                <p>Post Requests: {gatewayInfo.post_requests}</p>
                <p>Total Requests: {gatewayInfo.total_requests}</p>
                <p>Avg Requests Per Min: {gatewayInfo.avg_requests_per_min}</p>
              </div>
            </div>
          ) : (
            <Spinner />
          )}
        </HoverCardContent>
      </HoverCard>
        </div>
  );
};

export default ConnectionStrength;
