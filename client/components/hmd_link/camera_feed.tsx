/**
 * @author @ivanvuong
 * @function CameraFeed
 * The camera feed component for the LMCC console. 
 */

import { useEffect, useState } from "react";

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

const fetchVideo = async () => {
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
    }
}

function CameraFeed() {
    const videoUrlPromise = fetchVideo(); 

    videoUrlPromise.then(videoUrl => {
        return (
            <div>
                <video controls width="600">
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        );
    }).catch(error => {
        console.error('Error fetching video:', error);
        return <div>Error: {error.message}</div>;
    });

    return <div>Loading...</div>;
}

export default CameraFeed;
