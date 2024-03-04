# all POST request helpers go in here
from flask import jsonify
from pathlib import Path
from typing import Any, Dict, List
import json
from .utils import get_lat_lon_from_tif

# Path to the `./server` Directory
SERVER_DIR: Path = Path(__file__).parent.parent 
NOTIF_PATH = SERVER_DIR / 'data' / 'notification.json'


def update_geojson(args: Dict[str, Any], add: bool=True) -> "json":
    """
    Updates a GeoJSON file based on the provided arguments to either add or remove pins.

    This function takes a dictionary of arguments and a boolean flag. It modifies a GeoJSON 
    file located at a predefined server directory. The function supports adding or removing 
    pins based on the boolean flag 'add'. When 'add' is True, pins are added; otherwise, pins 
    are removed.

    Parameters:
    - args (Dict[str, Any]): A dictionary containing the following keys:
        - 'pins' (List[str]): A list of pins to add or remove. Each pin is a string in 
          the format 'x_coordx y_coord'.
        - 'dimensions' (List[int], optional): A list containing two integers [height, width] 
          representing the dimensions of the image associated with the GeoJSON file. If not 
          provided, default values of 1024 for height and 815 for width are used.
    - add (bool, optional): A flag to determine if pins are to be added (True) or removed (False). 
      Defaults to True.

    The function reads the existing GeoJSON file, updates it based on the provided arguments, 
    and writes back the changes. It also returns a JSON response indicating the update status.

    Returns:
    - A JSON response object with the key 'update_status' set to 'OK' indicating the update 
      was successful.
    """
    # Define the path to the GeoJSON file
    geojson_path: Path = SERVER_DIR / 'data' / 'rockyard.geojson'

    # Retrieve pins and dimensions from the provided arguments
    pins: List[str] = args.get('pins', [])

    with open(geojson_path, 'r') as file:
        geojson_data: Dict[str, Any] = json.load(file)

    # Create a history of existing pins
    history: List[str] = []
    for feature in geojson_data['features']:
        history.append(feature['properties']['description'])
    
    # If add is False, remove pins from the history
    if not add:
        for pin in pins: 
            history = [item for item in history if item != pin]

        # Update the GeoJSON data with the modified pin list
        updated_features: List[Dict[str, Any]] = []
        for i, item in enumerate(history): 
            x, y = map(int, item.split('x'))
            lat, lon = get_lat_lon_from_tif(x, y)
            item_data: Dict[str, Any] = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [lat, lon]  
                },
                "properties": {
                    "name": f"Pin_{i}",
                    "description": item
                }
            }
            updated_features.append(item_data)
        
        geojson_data['features'] = updated_features

    # If add is True, add new pins to the existing history
    if add:
        pins.extend(history) 
        for pin in pins:
            x, y = map(int, pin.split('x'))
            lat, lon = get_lat_lon_from_tif(x, y)

            item_data: Dict[str, Any] = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [lat, lon]  
                },
                "properties": {
                    "name": f"Pin_{len(geojson_data['features'])}",
                    "description": pin
                }
            }
            # If the pin is not in the history, add it to the GeoJSON data
            if not pin in history:
                geojson_data['features'].append(item_data)

    # Write the updated GeoJSON data back to the file
    with open(geojson_path, 'w') as file:
        json.dump(geojson_data, file, indent=4)

    return {'update_status': 'OK'}




def update_notification(args: Dict[str, Any]) -> "json":
   
    # Extract todoItems, infoWarning, and isWarning from the provided arguments
    info_todo: list = args.get('todoItems', [])
    info_warning: str = args.get('infoWarning', '')
    is_warning: bool = args.get('isWarning', False)

    # Create a dictionary with the extracted data
    data: Dict[str, Any] = {
        "infoWarning": info_warning, 
        "todoItems": info_todo, 
        "isWarning": is_warning,
    }
    
    # Write the data to the notification file
    with open(NOTIF_PATH, 'w') as jf:
        json.dump(data, jf, indent=4)
    
    return jsonify(data)




