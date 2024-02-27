"use client";

/**
 * @author @abhi-arya1 @ivanvuong @areich128
 * @function TelemetryPage
 * @fileoverview Coming once all "TODO:" are complete
 */

import GeoSampler from "@/components/hmd_link/geo_sampling";
import PanicButton from "@/components/hmd_link/panic_button";
import { DataTable } from "@/components/ui/data_table";


  function TelemetryPage() {
    return (
      <div className="h-full flex flex-row gap-x-4 items-center justify-center">
          <GeoSampler />
      </div>
      
    )
  }

  export default TelemetryPage;
