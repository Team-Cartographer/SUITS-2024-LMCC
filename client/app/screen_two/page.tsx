"use client";
import { fetchWithoutParams } from "@/api/fetchServer";
/**
 * @author @abhi-arya1
 * @function TelemetryPage
 * @fileoverview Coming once all "TODO:" are complete
 */

import { useState, useEffect } from "react";

function TelemetryPage() {
  const [text, setText] = useState('Loading Flask...');

  useEffect(() => {
    fetchWithoutParams<{ message: string }>('tests/hello').then((data) => {
      if (data?.message) {
        console.log("Message: ", data.message);
        setText(data.message);
      }
    })
    
  }, [text]);

  //TODO: start (and finish) second page
  return (
    <div className="h-full flex flex-row gap-x-4 items-center justify-center">
      {text}
    </div>
  );
}

export default TelemetryPage;
