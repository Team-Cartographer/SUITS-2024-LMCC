// ./app/screen_two/page.tsx
// Code notes by Isaiah: https://docs.google.com/document/d/17xVcVvvVmFHU4XP4ukxu7YCvT04KC2miXijcyR0V_II/edit?usp=sharing
/**
 * @author @abhi-arya1
 * @author @datsisaiah 
 * @function TelemetryPage
 * @fileoverview Coming once all "TODO:" are complete
 */
// ./app/screen_two/page.tsx
import React from 'react';
import MediaPlayer from '@/components/rover/rover_live_view';

const App = () => {
  return (
    <div>
      {/* Use MediaPlayer component by passing the URL of the media */}
      <MediaPlayer url="https://www.youtube.com/watch?v=NfcLKjFB59o" volume={0.7} />
    </div>
  );
};

export default App;
