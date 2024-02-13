/**
 * @author @abhi-arya1
 * @function PanicButton
 * @fileoverview Coming once all "TODO:" are complete
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
} from "@/components/ui/alert-dialog"
import { fetchWithoutParams } from "@/api/fetchServer";
import { FormEvent, useState } from "react";

interface PanicData {
    infoWarning: string;
    infoTodo: string;
    isWarning: boolean;
}

const PanicButton = () => {
  const [inputValue, setInputValue] = useState('');
  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const onPanic = async () => {
    try {
      console.log(inputValue);
      await fetchWithoutParams<PanicData>(`api/v0?get=notif&infoWarning=${inputValue}&isWarning=true`);

    } catch (err) {
        const error = err as Error;
        console.error('Error updating image:', error);
    }
    console.log("Panic Pressed");
    setInputValue('');
  }


  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger className="flex bg-red-600 text-red-200 hover:bg-red-700 w-14 h-12 items-center justify-center rounded-xl">
            <AlertTriangle className="h-7 w-7"/>
        </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="pb-2">Send a Warning</AlertDialogTitle>
            <AlertDialogDescription>
              <div>
                { /* TODO: MAKE FORM INPUTAREA BIGGER */ }
                <form onSubmit={onPanic}>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="h-full w-full p-2 rounded-lg bg-background text-muted-foreground outline outline-1 outline-muted-foreground"
                    placeholder="Warning Info Here..."
                  />
                  <div className="fixed bottom-0 right-0 p-3 pb-6 pr-5">
                    <AlertDialogAction onClick={onPanic} className="bg-red-600 text-white hover:bg-red-700">Send</AlertDialogAction>
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
