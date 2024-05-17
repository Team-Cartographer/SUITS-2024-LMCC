"use client";

import { Camera } from "lucide-react";
import { Button } from "../ui/button";
import { fetchWithoutParams } from "@/api/fetchServer";
import { useState } from "react";
import { Spinner } from "../ui/spinner";

const PhotoCapture = ({ eva }: { eva: number }) => {
    const [loading, setLoading] = useState(false);

    return ( 
        <div>
            <Button 
                className="rounded-xl border-2 p-5 bg-slate-600 text-white hover:bg-slate-700"  
                onClick={
                    async () => {
                        setLoading(true);
                        await fetchWithoutParams(`takephoto?eva=${eva}`)
                        setLoading(false);
                    }
                }
            >
                <Camera className="h-4 w-4" /> <span className="pl-1">{loading ? <Spinner /> : `EVA ${eva}`}</span>
            </Button>
        </div>
     );
}
 
export default PhotoCapture;