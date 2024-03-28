"use client";

import { Camera } from "lucide-react";
import { Button } from "../ui/button";
import { fetchWithoutParams } from "@/api/fetchServer";
import { useState } from "react";
import { Spinner } from "../ui/spinner";

const PhotoCapture = () => {
    const [loading, setLoading] = useState(false);

    return ( 
        <div className="py-3">
            <Button 
                className="rounded-xl p-5 bg-slate-600 text-white hover:bg-slate-700"  
                onClick={
                    async () => {
                        setLoading(true);
                        await fetchWithoutParams("api/hololens/photo")
                        setLoading(false);
                    }
                }
            >
                <Camera className="h-4 w-4" /> <span className="pl-1">{loading ? <Spinner /> : "EVA 1"}</span>
            </Button>
        </div>
     );
}
 
export default PhotoCapture;