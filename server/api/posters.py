# all POST request helpers go in here
from pathlib import Path
import json
from .utils import image_coords_to_lat_lon

SERVER_DIR = Path(__file__).parent.parent 



def get_arg(key, args_dict):
    if key in args_dict.keys():
        return args_dict.get(key)
    else:
        raise ValueError('Improper Args were Provided')



def update_geojson(args: dict, add: bool=True):
    geojson_path = SERVER_DIR / 'data' / 'rockyard.geojson'

    pins = args.get('pins', [])
    dims = args.get('dimensions', [])
    if dims: 
        height = dims[0]
        width = dims[1]
    else: 
        height = 1024
        width = 815

    with open(geojson_path, 'r') as file:
        geojson_data = json.load(file)

    history = []
    for feature in geojson_data['features']:
        history.append(feature['properties']['description'])
    
    if not add:
        for pin in pins: 
            history = [item for item in history if item != pin]
            with open('temp.txt', 'w') as f:
                f.writelines(history)

        updated_features = []
        for i, item in enumerate(history): 
            x, y = map(int, item.split('x'))
            lat, lon = image_coords_to_lat_lon(x, y, height, width)
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
            lat, lon = image_coords_to_lat_lon(x, y, height, width)

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

    return {'update_status': 'OK'}




    



