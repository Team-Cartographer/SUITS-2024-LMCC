# all POST request helpers go in here
from PIL import Image, ImageDraw
from flask import send_file
from pathlib import Path
import json
import io
from .utils import image_coords_to_lat_lon, is_within_radius

SERVER_DIR = Path(__file__).parent.parent 



def get_arg(key, args_dict):
    if key in args_dict.keys():
        return args_dict.get(key)
    else:
        raise ValueError('Improper Args were Provided')



def update_pin_history(new_pin, pin_history):
    pin_history = [pin for pin in pin_history if not is_within_radius(new_pin, pin_history)]
    pin_history.append(new_pin)
    return pin_history



def update_geojson(args: dict, add: bool=True):
    map_path = SERVER_DIR / 'images' / 'rockYardMap.png'
    geojson_path = SERVER_DIR / 'data' / 'rockyard.geojson'

    pins = args.get('pins', [])

    image = Image.open(map_path)
    draw = ImageDraw.Draw(image)

    with open(geojson_path, 'r') as file:
        geojson_data = json.load(file)

    history = []
    for feature in geojson_data['features']:
        history.append(feature['properties']['description'])
    
    if not add:
        for pin in pins: 
            if is_within_radius(pin, history):
                history = [item for item in history if item != pin]

        updated_features = []
        for i, item in enumerate(history): 
            x, y = map(int, item.split('x'))
            lat, lon = image_coords_to_lat_lon(x, y)
            radius = 5
            draw.ellipse([(x - radius, y - radius), (x + radius, y + radius)], fill='red')

            item_data = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [lat, lon]  
                },
                "properties": {
                    "name": f"Pin_{i}",
                    "description": pin
                }
            }
            updated_features.append(item_data)
        
        geojson_data['features'] = updated_features

    
    if add:
        pins.extend(history) 
        for pin in pins:
            x, y = map(int, pin.split('x'))
            radius = 5
            draw.ellipse([(x - radius, y - radius), (x + radius, y + radius)], fill='red')

            lat, lon = image_coords_to_lat_lon(x, y)

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

    img_io = io.BytesIO()
    image.save(img_io, 'PNG')
    img_io.seek(0)

    return send_file(img_io, mimetype='image/png')




    



