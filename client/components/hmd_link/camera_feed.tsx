/**
 * @author @ivanvuong
 * @function CameraFeed
 * The camera feed component for the LMCC console. 
 */

import React, { useState, useEffect } from 'react';

export const fetchVideoWithoutParams = async (path: string): Promise<Response | undefined> => {
    try {
        const response = await fetch(`https://$100.64.13.144${path}`, {
            method: 'GET',  
        });
        if (response.ok) {
            return response;
        } else {
            console.error('Failed to fetch video from the server');
        }
    } catch (error) {
        console.error('Error while fetching video:', error);
    }
    return undefined;
}

export const fetchVideo = async () => {
    try {
        const response = await fetchVideoWithoutParams('/api/holographic/stream/live_high.mp4?holo=true&pv=true&mic=false&loopback=true&RenderFromCamera=true');
        if (!response) {
            throw new Error('Failure')
        }
        const videoBlob = await response.blob();
        if (videoBlob) {
            const videoObjectURL = URL.createObjectURL(videoBlob);
            return videoObjectURL;
        } else {
            throw new Error('Video blob is undefined');
        }
    } catch (err) {
        const error = err as Error;
        console.error('Error fetching video:', error);
        return undefined
    };
};

function CameraFeed() {
    const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
    useEffect(() => {
        const fetchURL = async () => {
            try {
                const url = await fetchVideo();
                setVideoUrl(url);
            } catch (error) {
                console.error('Error fetching video:', error);
            }
        };
        fetchURL();
    }, []);
      return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <video controls width="1400">
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      }

//   export default CameraFeed;

  function TempYoutubeVideo() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div>
                <iframe
                    width="1236" 
                    height="695" 
                    src="https://www.youtube.com/embed/jfKfPfyJRdk" 
                    title="lofi hip hop radio 📚 - beats to relax/study to" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen={true}
                ></iframe>
            </div>
        </div>
    );
}
export default TempYoutubeVideo;
