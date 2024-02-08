"use client";

/**
 * @author @abhi-arya1
 * @function TelemetryPage
 * @fileoverview Coming once all "TODO:" are complete
 */

// import Map from "@/components/ui/map";


// function TelemetryPage() {
  
//   //TODO: finish second page
//   return (
//     <div className="h-full flex flex-row gap-x-4 items-center justify-center">
//       <Map />
//     </div>
//   );
// }

// export default TelemetryPage;

import CameraFeed from "@/components/hmd_link/camera_feed";

CameraFeed()

// function CameraFeed() {
//   const videoUrlPromise = fetchVideo(); 
//   videoUrlPromise.then(videoUrl => {
//       return (
//           <div>
//               <video controls width="600">
//                   <source src={videoUrl} type="video/mp4" />
//                   Your browser does not support the video tag.
//               </video>
//           </div>
//       );
//   }).catch(error => {
//       console.error('Error fetching video:', error);
//       return <div>Error: {error.message}</div>;
//   });

//   return <div>Loading...</div>;
// }

// export default CameraFeed;