"use client";

/**
 * @author @abhi-arya1
 * @function Map
 * The minimap component for the LMCC console. 
 */

import lmcc_config from "@/lmcc_config.json"
import { fetchWithParams, fetchImageWithoutParams } from "@/api/fetchServer";
import { useEffect, useState } from "react";
import { useNetwork } from "@/hooks/context/network-context";
import { GeoJSONFeature } from "@/hooks/types";

// Note that all scaling must be based off of 1024x815 dimensions!

const SCALING_FACTOR = 1/(lmcc_config.scale_factor);
const MAP_HEIGHT = 3543;
const MAP_WIDTH = 3720;

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Input } from "../ui/input";
  

let MAP_URLS: string[] = []

/* 
    When you are running this file and want to resize the map, 
    make sure to divide the height and width by the scale factor, 
    and multiply the rect height, width, and x, y in const handleImageClick(); 
*/

interface ModalProps { 
    isOpen: boolean; 
    onClose: () => void;
    children: React.ReactNode;
}

// Map Component
const Map = () => {
    const [mapImage, setMapImage] = useState(''); // URL to Map Image
    const [err, setErr] = useState(''); // Potential Error in getting Map
    const [points, setPoints] = useState<GeoJSONFeature[]>([]) // Set of points to have from the map
    const [shiftPressed, setShiftPressed] = useState(false); // Whether the shift key is pressed or not
    const [modalOpen, setModalOpen] = useState(false); // Whether the modal is open or not
    const [descContent, setDescContent] = useState(''); // Description content for the pin
    const networkProvider = useNetwork();

    const NameModal = ({ onClick }: any) => { 
        if (!modalOpen) return null;
        
        return (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(2, 8, 23, 0.5)' }}>
                <div style={{ padding: 20, background: '#000', borderRadius: 5, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <div className="flex flex-col">
                        <h2 className="font-bold text-xl">Enter Pin Description</h2>
                        {/* <input type="text" onChange={(e) => {setDescContent(e.target.value)}} className="text-black" /> */}
                        <Input type="text" onChange={(e) => {setDescContent(e.target.value)}} className="text-black"/>
                    </div>
                    <button onClick={onClick}>Close</button>
                </div>
            </div>
        );};

    // This updates the map image on all computers running every {lmcc_config.tickspeed} seconds. 
    useEffect(() => {
        const interval = setInterval(() => {
            fetchImage();
            const mapData = networkProvider.getGeoJSONData()
            setPoints(mapData.features);
        }, 150); 
        return () => {
            clearInterval(interval);
        };
    });

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if(event.key === 'Shift') {
                console.log("remove enabled");
                setShiftPressed(true);
            }
        };
        const handleKeyUp = (event: KeyboardEvent) => {
            if(event.key === 'Shift') {
                console.log("remove disabled");
                setShiftPressed(false);
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp)
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);


    // Fetches the current map image and sets them to the URL state, checking for errors
    const fetchImage = async () => {
        try {
            const imageBlob = await fetchImageWithoutParams('map');
            if (imageBlob) {
                for (let mapUrl of MAP_URLS) {
                    URL.revokeObjectURL(mapUrl);
                }
                const newUrl = URL.createObjectURL(imageBlob);
                setMapImage(newUrl);
                MAP_URLS = [...MAP_URLS, newUrl]
            } else {
                throw new Error('Image blob is undefined');
            }
        } catch (err) {
            const error = err as Error;
            setErr(error.message);
            console.error('Error fetching image:', error);
        }
    }

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

        if (nearPoint) {
           if(shiftPressed) {
                await removePin(nearPoint.properties.description);
           } else { 
                setModalOpen(true);
           }
        } else {
            await addPin(`${x}x${y}`);
        }
    };


    // Updates the Image every time it is clicked
    const addPin = async (xystring: string) => {
        try {
            const feature = { 
                type: "Feature",
                properties: {
                    name: "placedWaypoint",
                    description: xystring
                },
                geometry: {
                    type: "Point",
                    coordinates: [xystring.split('x').map(Number)]
                }
            }
            await fetchWithParams('addfeature', {
                feature: feature
            });
        } catch (err) {
            const error = err as Error;
            setErr(error.message);
            console.error('Error updating image:', error);
        }
    };

    const removePin = async (xystring: string) => {
        try {
            const feature = { 
                type: "Feature",
                properties: {
                    name: "placedWaypoint",
                    description: xystring
                },
                geometry: {
                    type: "Point",
                    coordinates: [xystring.split('x').map(Number)]
                }
            }
            await fetchWithParams('removefeature', {
                feature: feature
            });
        } catch (err) {
            const error = err as Error;
            setErr(error.message);
            console.error('Error updating image:', error);
        }
    }


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
    return ( 
        <div className="">
            {<NameModal onClick={() => {setModalOpen(false);}} />}
            {mapImage && <img className="rounded-3xl" id="map" src={mapImage} alt="Map" onClick={handleImageClick} width={MAP_WIDTH * SCALING_FACTOR} height={MAP_HEIGHT * SCALING_FACTOR} />}
        </div>
    );
}
 
export default Map;
