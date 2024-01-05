"use client";
/**
 * @author @abhi-arya1
 * @function TelemetryPage
 * @fileoverview Coming once all "TODO:" are complete
 */

import { useState, useEffect } from "react";

function TelemetryPage() {
  const [text, setText] = useState('Loading Flask...');

  useEffect(() => {
    fetch('http://localhost:8080/api/home')
    .then((response) => response.json())
    .then((data) => {
        console.log(text);
        setText(data.message);
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
