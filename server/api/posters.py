# all POST request helpers go in here
from flask import jsonify
from pathlib import Path
import json
from .utils import get_lat_lon_from_tif

# Path to the `./server` Directory
SERVER_DIR: Path = Path(__file__).parent.parent 


def update_geojson(args: dict, add: bool=True) -> "json":
    """
    Updates a GeoJSON file based on the provided arguments to either add or remove pins.

    This function takes a dictionary of arguments and a boolean flag. It modifies a GeoJSON 
    file located at a predefined server directory. The function supports adding or removing 
    pins based on the boolean flag 'add'. When 'add' is True, pins are added; otherwise, pins 
    are removed.

    Parameters:
    - args (dict): A dictionary containing the following keys:
        - 'pins' (list of str): A list of pins to add or remove. Each pin is a string in 
          the format 'x_coordx y_coord'.
        - 'dimensions' (list of int): Optional. A list containing two integers [height, width] 
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

    geojson_path = SERVER_DIR / 'data' / 'rockyard.geojson'

    pins = args.get('pins', [])
    # DEPRECATED
    # dims = args.get('dimensions', [])
    # height = dims[0]
    # width = dims[1]

    with open(geojson_path, 'r') as file:
        geojson_data = json.load(file)

    history = []
    for feature in geojson_data['features']:
        history.append(feature['properties']['description'])
    
    if not add:
        for pin in pins: 
            history = [item for item in history if item != pin]

        updated_features = []
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

            if not pin in history:
                geojson_data['features'].append(item_data)


    with open(geojson_path, 'w') as file:
        json.dump(geojson_data, file, indent=4)

    return jsonify({
        'update_status': 'OK'
        })




    



