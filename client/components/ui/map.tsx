"use client";

import { fetchWithParams, fetchImageWithoutParams, fetchWithoutParams } from "@/api/fetchServer";
import { useEffect, useState } from "react";
import lmcc_config from "@/lmcc_config.json"

const SCALING_FACTOR = 0.5 // Map Scaling Factor
const MAP_HEIGHT = 815 * SCALING_FACTOR // Scaled by 1/2
const MAP_WIDTH = 1024 * SCALING_FACTOR // Scaled by 1/2

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

interface GeoJSON {
    type: 'FeatureCollection';
    features: GeoJSONFeature[];
}

const Map = () => {
    const [mapImage, setMapImage] = useState('');
    const [err, setErr] = useState('');
    const [points, setPoints] = useState<GeoJSONFeature[]>([])

    useEffect(() => {
        fetchImage();
        fetchGeoJSONPoints();

        const interval = setInterval(() => {
            fetchImage();
            fetchGeoJSONPoints();
        }, lmcc_config.tickspeed); 
        return () => {
            clearInterval(interval);
        };
    }, []);

    const fetchGeoJSONPoints = async () => {
        const data = await fetchWithoutParams<GeoJSON>('api/v0?get=map_info');
        if (data && data.features) {
            setPoints(data.features);
        }
    };


    const fetchImage = async () => {
        try {
            const imageBlob = await fetchImageWithoutParams('api/v0?get=map_img');
            if (imageBlob) {
                const imageObjectURL = URL.createObjectURL(imageBlob);
                setMapImage(imageObjectURL);
            } else {
                throw new Error('Image blob is undefined');
            }
        } catch (err) {
            const error = err as Error;
            setErr(error.message);
            console.error('Error fetching image:', error);
        }
    }

    const handleImageClick = async (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        const target = event.target as HTMLImageElement;
        const tolerance = 50

        const rect = target.getBoundingClientRect();
        const x = Math.round(event.clientX - rect.left) / SCALING_FACTOR;
        const y = Math.round(event.clientY - rect.top) / SCALING_FACTOR;

        fetchGeoJSONPoints();

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

    if(err) {
        return (
            <div className="flex flex-col items-center justify-center">
                <p>Error: &quot;{err}&quot; was thrown while loading Map</p>
                <p>Make sure Gateway and the TSS Server are running.</p>            
                </div>
        )
    }

    return ( 
        <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {mapImage && <img src={mapImage} alt="Map" onClick={handleImageClick} width={MAP_WIDTH} height={MAP_HEIGHT} />}
        </div>
    );
}
 
export default Map;
