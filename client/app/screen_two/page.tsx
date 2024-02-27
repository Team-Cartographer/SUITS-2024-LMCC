"use client";

/**
 * @author @abhi-arya1 @ivanvuong @areich128
 * @function TelemetryPage
 * @fileoverview Coming once all "TODO:" are complete
 */

import dynamic from 'next/dynamic'
 
const NoSSR_GeoSampler = dynamic(() => import('@/components/hmd_link/geo_sampling'), { ssr: false })


  function TelemetryPage() {
    return (
      <div className="h-full flex flex-row gap-x-4 items-center justify-center">
          <NoSSR_GeoSampler />
      </div>
      
    )
  }

  export default TelemetryPage;
