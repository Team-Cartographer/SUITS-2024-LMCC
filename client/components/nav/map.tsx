"use client";

/**
 * @author @abhi-arya1
 * @function Map
 * The minimap component for the LMCC console. 
 */

import { fetchWithParams, fetchImageWithoutParams, fetchWithoutParams } from "@/api/fetchServer";
import { useEffect, useState } from "react";
import lmcc_config from "@/lmcc_config.json"
import { useNetwork } from "@/hooks/context/network-provider";

// Note that all scaling must be based off of 1024x815 dimensions!

const SCALING_FACTOR = 1/(lmcc_config.scale_factor);
const MAP_HEIGHT = 3543;
const MAP_WIDTH = 3720;

/* 
    When you are running this file and want to resize the map, 
    make sure to divide the height and width by the scale factor, 
    and multiply the rect height, width, and x, y in const handleImageClick(); 
*/

interface GeoJSONFeature {
    type: 'Feature';
    geometry: {
        type: 'Point';
        coordinates: [number, number];
    };
    properties: {
        name: string;
        description: string;
    };
}

// Gets GeoJSON interface type hinting
interface GeoJSON {
    type: 'FeatureCollection';
    features: GeoJSONFeature[];
}


// Map Component
const Map = () => {
    const [mapImage, setMapImage] = useState(''); // URL to Map Image
    const [err, setErr] = useState(''); // Potential Error in getting Map
    const [points, setPoints] = useState<GeoJSONFeature[]>([]) // Set of points to have from the map
    const networkProvider = useNetwork();

    // This updates the map image on all computers running every {lmcc_config.tickspeed} seconds. 
    useEffect(() => {
        const interval = setInterval(() => {
            const mapData = networkProvider.getGeoJSONData();
            const mapImage = networkProvider.getMapImage();
            setMapImage(mapImage);
            setPoints(mapData.features);
        }, lmcc_config.tickspeed); 
        return () => {
            clearInterval(interval);
        };
    });

    // Checks if the image was clicked, and whether that click was/wasn't near an existing point
    const handleImageClick = async (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        const target = event.target as HTMLImageElement;
        const tolerance = 50

        const rect = target.getBoundingClientRect();
        // Make sure to scale these 
        const x = Math.round(event.clientX - rect.left) / SCALING_FACTOR;
        const y = Math.round(event.clientY - rect.top) / SCALING_FACTOR;

        setPoints(networkProvider.getGeoJSONData().features);

        // This looks whether the click was within a pixel radius of size "tolerance" to another point (defined on line 95). 
        const nearPoint = points.find(point => {
            const [pointX, pointY] = point.properties.description.split('x').map(Number);
            const isNearPoint = (Math.abs(x - pointX) <= tolerance) && (Math.abs(y - pointY) <= tolerance);
            return isNearPoint;
        });

        let dims = [rect.width / SCALING_FACTOR, rect.height / SCALING_FACTOR]

        if (nearPoint) {
            await updateImageWithPins("rm", [nearPoint.properties.description], dims);
        } else {
            await updateImageWithPins("add", [`${x}x${y}`], dims);
        }
    };


    // Updates the Image every time it is clicked
    const updateImageWithPins = async (action: string, pins: string[], dims: number[]) => {
        try {
            await fetchWithParams('api/v0?get=map_img', {
                map: action,
                pins: pins,
                dimensions: dims
            });
        } catch (err) {
            const error = err as Error;
            setErr(error.message);
            console.error('Error updating image:', error);
        }
        if (action === "add"){
            console.log(`updated Map image by adding pins at ${pins}`) 
        } else {
            console.log(`updated Map image by removing pins at ${pins}`) 
        }
    };


    // Renders Error if there was an Error
    if(err) {
        return (
            <div className="flex flex-col items-center justify-center">
                <p>Error: &quot;{err}&quot; was thrown while loading Map</p>
                <p>Make sure Gateway and the TSS Server are running.</p>            
                </div>
        )
    }

    // Renders the Map Image if it exists. 
    // Please DO NOT use <Image /> from `next/image`, as only the HTML5 <img /> tag works here!
    return ( 
        <div className="">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {mapImage && <img className="rounded-3xl" src={mapImage} alt="Map" onClick={handleImageClick} width={MAP_WIDTH * SCALING_FACTOR} height={MAP_HEIGHT * SCALING_FACTOR} />}
        </div>
    );
}
 
export default Map;
