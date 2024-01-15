"use client";

import { fetchImageWithParams, fetchImageWithoutParams, fetchWithoutParams } from "@/api/fetchServer";
import { useEffect, useState } from "react";
import io from 'socket.io-client';
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
    const [mapImage, setMapImage] = useState('')
    const [prevMapImage, setPrevMapImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [err, setErr] = useState('');
    const [points, setPoints] = useState<GeoJSONFeature[]>([])

    useEffect(() => {
        fetchInitialImage();
        fetchGeoJSONPoints();

        const socketIo = io(lmcc_config.lmcc_url);

        socketIo.on('connect', () => {
            console.log('Socket.IO Connected');
        });

        socketIo.on('map-update', (data) => {
            console.log('here')
            fetchInitialImage();
            fetchGeoJSONPoints();
        });

        // Clean up the socket connection when the component unmounts
        return () => {
            socketIo.disconnect();
        };

    }, [])


    const fetchGeoJSONPoints = async () => {
        const data = await fetchWithoutParams<GeoJSON>('api/v0?get=map_info');
        if (data && data.features) {
            setPoints(data.features);
        }
    };


    const fetchInitialImage = async () => {
        setIsLoading(true);
        setPrevMapImage(mapImage);
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
        } finally {
            setIsLoading(false);
        }
    }


    const handleImageClick = async (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        const target = event.target as HTMLImageElement;
        const tolerance = 100

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
        setIsLoading(true);
        setPrevMapImage(mapImage)
        try {
            const imageBlob = await fetchImageWithParams('api/v0?get=map_img', {
                map: action,
                pins: pins,
                dimensions: dims
            });
            if (imageBlob) {
                const imageObjectURL = URL.createObjectURL(imageBlob);
                setMapImage(imageObjectURL);
            } else {
                throw new Error('Image blob is undefined');
            }
        } catch (err) {
            const error = err as Error;
            setErr(error.message);
            console.error('Error updating image:', error);
        } finally {
            setIsLoading(false);
        }
    };


    if(isLoading) {
        if (prevMapImage) {
            return <div><img src={prevMapImage} alt="Loading Map" /></div>;
        } else {
            return <p>Loading Map from Server</p>
        }
    }

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
