/**
 * @author @abhi-arya1
 * @function PanicButton
 */

import { AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { fetchWithoutParams } from "@/api/fetchServer";
import { useState, useEffect } from "react";
import "../../hooks/context/VignetteContext";
import lmcc_config from "../../../client/lmcc_config.json";

interface PanicData {
  infoWarning: string;
  infoTodo: string;
  isWarning: boolean;
}

const PanicButton = () => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const intervalId = setInterval(fetchPanicData, lmcc_config.tickspeed); // Fetch every 5 seconds
    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  const fetchPanicData = async () => {
    try {
      const data = await fetchWithoutParams<PanicData>(
        `api/v0?get=notif&infoWarning=${inputValue}&isWarning=true`,
      );
      if (data.isWarning) {
        toggleVignette();
      }
    } catch (err) {
      console.error("Error fetching panic data:", err);
    }
  };

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const onPanic = async () => {
    try {
      console.log(inputValue);
      await fetchWithoutParams<PanicData>(
        `api/v0?get=notif&infoWarning=${inputValue}&isWarning=true`,
      );
    } catch (err) {
      const error = err as Error;
      console.error("Error updating image:", error);
    }
    console.log("Panic Pressed");
    setInputValue("");
  };

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger className="flex h-12 w-14 items-center justify-center rounded-xl bg-red-600 text-red-200 hover:bg-red-700">
          <AlertTriangle className="h-7 w-7" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="pb-2">Send a Warning</AlertDialogTitle>
            <AlertDialogDescription>
              <div>
                <form onSubmit={onPanic}>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="bg-background text-muted-foreground outline-muted-foreground h-full w-full rounded-lg p-2 outline outline-1"
                    placeholder="Warning Info Here..."
                  />
                  <div className="fixed bottom-0 right-0 p-3 pb-6 pr-5">
                    <AlertDialogAction
                      onClick={onPanic}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      Send
                    </AlertDialogAction>
                  </div>
                </form>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <div className="pr-20">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PanicButton;
