"use client";
/**
 * @author @abhi-arya1
 * @function TelemetryPage
 * @fileoverview Coming once all "TODO:" are complete
 */

import { useState, useEffect } from "react";

function TelemetryPage() {
  const [text, setText] = useState('Hi There!');

  return (
    <div className="h-full flex flex-row gap-x-4 items-center justify-center">
      {text}
      {/* TODO: Finish this file */}
    </div>
  );
}

export default TelemetryPage;
