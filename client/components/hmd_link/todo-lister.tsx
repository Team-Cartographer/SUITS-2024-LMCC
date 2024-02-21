"use client";

import { fetchWithParams, fetchWithoutParams } from "@/api/fetchServer";
import { useEffect, useState } from "react";

interface PanicData {
    infoWarning: string, 
    todoItems: [number, string, string][], 
    isWarning: boolean,
}


const TodoLister = () => {
    const [notifData, setNotifData] = useState<PanicData>();

    const fetchPanicData = async () => {
        try {
            const notificationData = await fetchWithoutParams<PanicData>(
                `api/v0?get=notif`,
            )
            if (notificationData) { 
                setNotifData(notificationData); 
                console.log(notificationData);
            } else { 
                throw Error('could not get notification data'); 
            }
        } catch (err) {
            console.error("Error fetching panic data:", err);
        }
    };

    useEffect(() => {
        const intervalId = setInterval(fetchPanicData, 750); 
        return () => clearInterval(intervalId);
      });



    return ( 
        <div className="flex flex-col self-start gap-x-2">
            <div>
                item2
            </div>
            <div>
                item2
            </div>
        </div>
     );
}
 
export default TodoLister