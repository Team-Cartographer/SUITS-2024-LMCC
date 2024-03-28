"use client";

/**
 * @author @ivanvuong
 * @function CameraFeed
 * The camera feed component for the LMCC console. 
 */


interface CameraFeedProps {
    ip: string
    className?: string
}


export function CameraFeed({ ip, className }: CameraFeedProps) {
    return (
        <div className={`justify-center items-center pb-6 ${className}`}>
        <video controls width="1400" autoPlay={true} loop={true}>
            <source src={`https://${ip}/api/holographic/stream/live.mp4`} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
        </div>
    );
}

