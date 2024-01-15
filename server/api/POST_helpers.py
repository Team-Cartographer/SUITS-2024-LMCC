# all POST request helpers go in here
from PIL import Image, ImageDraw
from flask import send_file
from pathlib import Path
import json
import io
from .utils import image_coords_to_lat_lon

SERVER_DIR = Path(__file__).parent.parent 

def get_arg(key, args_dict):
    if key in args_dict.keys():
        return args_dict.get(key)
    else:
        raise ValueError('Improper Args were Provided')

def add_to_map(args):
    map_path = SERVER_DIR / 'images' / 'rockYardMap.png'
    geojson_path = SERVER_DIR / 'data' / 'rockyard.geojson'
    history_path = SERVER_DIR / 'data' / 'history.json'

    pins = args.get('pins', [])

    image = Image.open(map_path)
    draw = ImageDraw.Draw(image)

    with open(geojson_path, 'r') as file:
        geojson_data = json.load(file)
    with open(history_path, 'r') as history:
        history = json.load(history)

    pins.extend(history['pinHistory'])
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
                "name": f"Pin_{len(geojson_data['features'])}"
            }
        }

        if not pin in history['pinHistory']:
            history['pinHistory'].append(pin)
            geojson_data['features'].append(item_data)


    with open(geojson_path, 'w') as file:
        json.dump(geojson_data, file, indent=4)
    with open(history_path, 'w') as file:
        json.dump(history, file, indent=4)

    img_io = io.BytesIO()
    image.save(img_io, 'PNG')
    img_io.seek(0)

    return send_file(img_io, mimetype='image/png')




    



