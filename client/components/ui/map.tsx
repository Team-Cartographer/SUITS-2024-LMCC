"use client";

import { fetchWithParams, fetchImageWithoutParams, fetchWithoutParams } from "@/api/fetchServer";
import { useEffect, useState } from "react";
import lmcc_config from "@/lmcc_config.json"

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
        const x = Math.round(event.clientX - rect.left);
        const y = Math.round(event.clientY - rect.top);

        fetchGeoJSONPoints();

        const nearPoint = points.find(point => {
            const [pointX, pointY] = point.properties.description.split('x').map(Number);
            const isNearPoint = (Math.abs(x - pointX) <= tolerance) && (Math.abs(y - pointY) <= tolerance);
            return isNearPoint;
        });

        if (nearPoint) {
            await updateImageWithPins("rm", [nearPoint.properties.description], [rect.width, rect.height]);
        } else {
            await updateImageWithPins("add", [`${x}x${y}`], [rect.width, rect.height]);
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
    };

    if(err) {
        return <p>Error: "{err}" was thrown while loading Map</p>
    }

    return ( 
        <div>
            {mapImage && <img src={mapImage} alt="Map" onClick={handleImageClick} />}
        </div>
    );
}
 
export default Map;
