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

const TelemetryPage: React.FC = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div style={{ border: '2px solid #3498db', borderRadius: '10px', overflow: 'hidden', textAlign: 'center' }}>
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/NfcLKjFB59o"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

export default TelemetryPage;
