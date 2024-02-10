  "use client";

  /**
   * @author @abhi-arya1 @ivanvuong
   * @function TelemetryPage
   * @fileoverview Coming once all "TODO:" are complete
   */

  import { CameraFeed, TempYoutubeVideo } from "@/components/hmd_link/camera_feed";
  import Map from "@/components/ui/map";

  function TelemetryPage() {
    return (
      <div className="h-full flex flex-row gap-x-4 items-center justify-center">
          <CameraFeed />
          <Map />
      </div>
    )
  }

  export default TelemetryPage;
