/**
 * @author @abhi-arya1
 * @function PanicButton
 * @fileoverview Coming once all "TODO:" are complete
 */

import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";

function onPanic() {
  // TODO: add panic button functionality
  console.log("Panic Pressed");
}

const PanicButton = () => {
  return (
    <div className="pt-8 pl-4">
      <Button
        className="bg-red-600 text-red-200 hover:bg-red-700"
        onClick={onPanic}
      >
        <AlertTriangle />
      </Button>
    </div>
  );
};

export default PanicButton;
