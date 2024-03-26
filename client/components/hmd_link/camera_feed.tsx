"use client";

/**
 * @author @ivanvuong
 * @function CameraFeed
 * The camera feed component for the LMCC console. 
 */


interface CameraFeedProps {
    className?: string
}


export function CameraFeed({ className }: CameraFeedProps) {
    return (
        <div className={`justify-center items-center ${className}`}>
        <video controls width="1400" autoPlay={true} loop={true}>
            <source src="https://192.168.0.19/api/holographic/stream/live.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
        </div>
    );
}

