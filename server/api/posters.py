# all POST request helpers go in here
from flask import jsonify
from pathlib import Path
import json
from .utils import get_lat_lon_from_tif
from .functions.gemini import send_message

# Path to the `./server` Directory
SERVER_DIR: Path = Path(__file__).parent.parent 
WARNING_PATH = SERVER_DIR / 'data' / 'warning.json'
TODO_PATH = SERVER_DIR / 'data' / 'todo.json'


def update_geojson(args: dict[str, list[str] | list[int]], add: bool = True) -> dict[str, str]:
    """
    Updates a GeoJSON file based on the provided arguments to either add or remove pins.

    This function takes a dictionary of arguments and a boolean flag. It modifies a GeoJSON 
    file located at a predefined server directory. The function supports adding or removing 
    pins based on the boolean flag 'add'. When 'add' is True, pins are added; otherwise, pins 
    are removed.

    Parameters:
    - args: A dictionary containing the following keys:
        - 'pins': A list of pins to add or remove. Each pin is a string in 
          the format 'x_coordx y_coord'.
        - 'dimensions' (optional): A list containing two integers [height, width] 
          representing the dimensions of the image associated with the GeoJSON file. If not 
          provided, default values of 1024 for height and 815 for width are used.
    - add (optional): A flag to determine if pins are to be added (True) or removed (False). 
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
    pins: list[str] = args.get('pins', [])

    with open(geojson_path, 'r') as file:
        geojson_data: dict[str, any] = json.load(file)

    # Create a history of existing pins
    history: list[str] = []
    for feature in geojson_data['features']:
        history.append(feature['properties']['description'])
    
    # If add is False, remove pins from the history
    if not add:
        for pin in pins: 
            history = [item for item in history if item != pin]

        # Update the GeoJSON data with the modified pin list
        updated_features: list[dict[str, str | dict[str, str | list[float]]]] = []
        for i, item in enumerate(history): 
            x, y = map(int, item.split('x'))
            lat, lon = get_lat_lon_from_tif(x, y)
            item_data = {
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

            item_data = {
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




def update_notification(args: dict[str, list[str] | str | bool], _type: str) -> dict[str, str | list[str] | bool]:
    if _type == 'WARNING': 
        info_warning: str = args.get('infoWarning', '')
        data = { "infoWarning": info_warning }
        with open(WARNING_PATH, 'w') as jf:
            json.dump(data, jf, indent=4)
    elif _type == "TODO": 
        todo_items = args.get("todoItems", [])
        data = { "todoItems": todo_items }
        with open(TODO_PATH, 'w') as jf:
            json.dump(data, jf, indent=4)
    
    return jsonify(data)




def update_chat(args: dict[str, str]) -> dict[str, str]:
    message = args.get('message', 'Please say "You did not provide a proper message, try again" verbatim.')
    history, todoItem  = send_message(message)
    return jsonify({
        "history": history, 
        "todoItem": todoItem
    })

