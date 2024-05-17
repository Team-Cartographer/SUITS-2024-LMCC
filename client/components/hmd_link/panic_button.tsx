"use client";

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
import { fetchWithParams, fetchWithoutParams } from "@/api/fetchServer";
import { useState } from "react";
import { WarningData } from "@/lib/types";
import { useNetwork } from "@/hooks/context/network-context";

const PanicButton = () => {
  const [inputValue, setInputValue] = useState("");
  const { updateWarning } = useNetwork();

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const _updateWarning = () => { 
    updateWarning(inputValue); 
  }

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger className="flex border-2 h-12 w-14 items-center justify-center rounded-xl bg-red-600 text-red-200 hover:bg-red-700">
          <AlertTriangle className="h-7 w-7" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="pb-2">Send a Warning</AlertDialogTitle>
            <AlertDialogDescription>
              <div>
                <form onSubmit={_updateWarning}>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="bg-background text-muted-foreground outline-muted-foreground h-full w-full rounded-lg p-2 outline outline-1"
                    placeholder="Warning Info Here..."
                  />
                  <div className="fixed bottom-0 right-0 p-3 pb-6 pr-5">
                    <AlertDialogAction
                      onClick={_updateWarning}
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
