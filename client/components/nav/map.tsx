"use client";

/**
 * @author @abhi-arya1
 * @function Map
 * The minimap component for the LMCC console. 
 */

import lmcc_config from "@/lmcc_config.json"
import { fetchWithParams, fetchWithoutParams } from "@/api/fetchServer";
import { useEffect, useState } from "react";
import { useNetwork } from "@/hooks/context/network-context";
import { GeoJSONFeature } from "@/lib/types";

// Note that all scaling must be based off of 1024x815 dimensions!

const SCALING_FACTOR = 1/(lmcc_config.scale_factor);
const MAP_HEIGHT = 3543;
const MAP_WIDTH = 3720;

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";


let MAP_URLS: string[] = []

/* 
    When you are running this file and want to resize the map, 
    make sure to divide the height and width by the scale factor, 
    and multiply the rect height, width, and x, y in const handleImageClick(); 
*/

interface NearPoint { 
    name: string, 
    description: string, 
    x: number,
    y: number
}

// Map Component
const Map = () => {
    const [mapImage, setMapImage] = useState(''); // URL to Map Image
    const [err, setErr] = useState(''); // Potential Error in getting Map
    const [points, setPoints] = useState<GeoJSONFeature[]>([]) // Set of points to have from the map
    const [shiftPressed, setShiftPressed] = useState(false); // Whether the shift key is pressed or not
    const [modalOpen, setModalOpen] = useState(false); // Whether the modal is open or not
    const [descContent, setDescContent] = useState<string | null>(null); // Description content for the pin
    const [nearPoint, setNearPoint] = useState<NearPoint | null>(null); // Near point  
    const [loading, setLoading] = useState(false); // Whether the map pin is loading or not
    const [navLoad, setNavLoading] = useState(false); // Whether the navigation is loading or not

    const networkProvider = useNetwork();


    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if(event.key === 'Shift') {
                setShiftPressed(true);
            }
        };
        const handleKeyUp = (event: KeyboardEvent) => {
            if(event.key === 'Shift') {
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

    
    // This updates the map image on all computers running every {lmcc_config.tickspeed} seconds. 
    useEffect(() => {
        const interval = setInterval(() => {
            // fetchImage();
            const mapData = networkProvider.getGeoJSONData()
            setPoints(mapData.features);
        }, 500); 
        return () => {
            clearInterval(interval);
        };
    });


    // // Fetches the current map image and sets them to the URL state, checking for errors
    // const fetchImage = async () => {
    //     try {
    //         const imageBlob = await fetchImageWithoutParams('map');
    //         if (imageBlob) {
    //             for (let mapUrl of MAP_URLS) {
    //                 URL.revokeObjectURL(mapUrl);
    //             }
    //             const newUrl = URL.createObjectURL(imageBlob);
    //             setMapImage(newUrl);
    //             MAP_URLS = [...MAP_URLS, newUrl]
    //         } else {
    //             throw new Error('Image blob is undefined');
    //         }
    //     } catch (err) {
    //         const error = err as Error;
    //         setErr(error.message);
    //         console.error('Error fetching image:', error);
    //     }
    // }

    useEffect(() => {
        const socket = new WebSocket(`ws://${lmcc_config.lmcc_ip}:3001/map`);
    
        socket.binaryType = "arraybuffer";
    
        socket.onopen = () => {
          console.log("WebSocket connection established");
        };
    
        socket.onmessage = (event) => {
            if (event.data instanceof ArrayBuffer) {
                const arrayBuffer = event.data;
                const blob = new Blob([arrayBuffer], { type: "image/png" });
                const newUrl = URL.createObjectURL(blob);
                setMapImage(newUrl);
                setErr('');
                setLoading(false);
            }
        };
    
        socket.onerror = (error) => {
          console.error("WebSocket error:", error);
          setErr("WebSocket error occurred: " + error);
        };
    
        socket.onclose = (event) => {
          console.log("WebSocket connection closed:", event);
        };
    
        return () => {
          socket.close();
        };
      }, []);

    // Checks if the image was clicked, and whether that click was/wasn't near an existing point
    const handleImageClick = async (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        const target = event.target as HTMLImageElement;
        const tolerance = 40;

        const rect = target.getBoundingClientRect();
        const x = Math.round(event.clientX - rect.left) / SCALING_FACTOR;
        const y = Math.round(event.clientY - rect.top) / SCALING_FACTOR;

        const nearPoint = points.find(point => {
            const [pointX, pointY] = point.properties.description.split('x').map(Number);
            const isNearPoint = (Math.abs(x - pointX) <= tolerance) && (Math.abs(y - pointY) <= tolerance);
            return isNearPoint;
        });

        if (nearPoint) {
           if(shiftPressed) {
                await removePin(nearPoint.properties.description, nearPoint.properties.name);
           } else { 
                setModalOpen(true);
                setNearPoint({
                    name: nearPoint.properties.name,
                    description: nearPoint.properties.description,
                    x: x,
                    y: y
                });
           }
        } else {
            await addPin(`${x}x${y}`, "");
        }
    };


    // Updates the Image every time it is clicked
    const addPin = async (xystring: string, _descContent: string) => {
        try {
            setLoading(true)
            const feature = { 
                type: "Feature",
                properties: {
                    name: _descContent,
                    description: xystring,
                    utm: [0, 0] 
                },
                geometry: {
                    type: "Point",
                    coordinates: xystring.split('x').map(Number)
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

    const removePin = async (xystring: string, _descContent: string) => {
        try {
            setLoading(true);
            const feature = { 
                type: "Feature",
                properties: {
                    name: _descContent,
                    description: xystring,
                    utm: [0, 0]
                },
                geometry: {
                    type: "Point",
                    coordinates: xystring.split('x').map(Number)
                }
            }
            console.log("Removing: " + JSON.stringify(feature))
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
            <div className="flex flex-col items-center justify-center text-muted-foreground pt-28">
                <p>Error: &quot;{err}&quot; was thrown while loading Map</p>
                <p className="pb-20">Make sure Gateway and the TSS Server are running.</p>         
                <Spinner size="icon" />   
            </div>
        )
    }

    // Renders the Map Image if it exists. 
    return ( 
        <div className="flex flex-col items-center justify-center pb-2 drop-shadow-2xl">
            {modalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(2, 8, 23, 0.5)' }} className="transition-all">
                <div style={{ padding: 20, background: '#000', borderRadius: 5, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <div className="flex flex-col gap-y-2">
                        <h2 className="font-bold text-xl">Enter Pin Description</h2>
                        <Input type="text" onChange={(e) => setDescContent(e.target.value)} onKeyDown={(e) => {
                            if(e.key === 'Enter') {
                                setModalOpen(false);
                                if(nearPoint && descContent) {
                                    removePin(nearPoint.description, nearPoint.name)
                                    addPin(`${nearPoint.x}x${nearPoint.y}`, descContent);
                                }
                            }
                        }} className="pb-3"/>
                        <div className="self-center">  
                        <Button onClick={() => {
                            setModalOpen(false)
                            if(nearPoint && descContent) {
                                removePin(nearPoint.description, nearPoint.name)
                                addPin(`${nearPoint.x}x${nearPoint.y}`, descContent);
                                setDescContent(null);
                            }
                        }}>
                            Close
                        </Button>
                        </div>
                    </div>
                </div>
                </div>
            )}
            { /* eslint-disable-next-line @next/next/no-img-element */ }
            {mapImage && <img className="rounded-3xl pb-2" id="map" src={mapImage} alt="Map" onClick={handleImageClick} width={MAP_WIDTH * SCALING_FACTOR} height={MAP_HEIGHT * SCALING_FACTOR} />}
            {shiftPressed && <span className="text-muted-foreground text-sm flex flex-row items-center gap-x-2">Removing: On (Press Shift+Click to Remove) {loading && <span className="text-muted-foreground text-sm flex flex-row gap-x-1 items-center">|| <Spinner /> Loading Pin...</span>}</span>}
            {!shiftPressed && <span className="text-muted-foreground text-sm flex flex-row items-center gap-x-2 pb-2">Removing: Off (Press Shift+Click to Remove) {loading && <span className="text-muted-foreground text-sm flex flex-row gap-x-1 items-center">|| <Spinner /> Loading Pin...</span>}</span>}
            <Button onClick={async () => {
                setNavLoading(true);
                await fetchWithoutParams("navigate");
                setNavLoading(false);
            }}>
            {navLoad ? <Spinner /> : "Navigate"}
            </Button>
        </div>
    );
}
 
export default Map;