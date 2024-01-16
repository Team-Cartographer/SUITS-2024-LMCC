# all GET request helpers go in here
from PIL import Image, ImageDraw
from .functions import astar
from flask import send_file
from pathlib import Path
import json
import io

SERVER_DIR = Path(__file__).parent.parent 

def get_arg(key, args_dict):
    if key in args_dict.keys():
        return args_dict.get(key)
    else:
        raise ValueError('Improper Args were Provided')
    
def send_map_info():
    mapping_json_path = SERVER_DIR / 'data' / 'rockyard.geojson'
    with open(mapping_json_path, 'r') as json_file:
        data = json.load(json_file)
    return data 

def send_map():
    map_path = SERVER_DIR / 'images' / 'rockYardMap.png'
    geojson_path = SERVER_DIR / 'data' / 'rockyard.geojson'
    
    image = Image.open(map_path)
    draw = ImageDraw.Draw(image)

    with open(geojson_path, 'r') as file:
        data = json.load(file)
    
    pins = []
    for feature in data['features']:
        pins.append(feature['properties']['description'])

    for pin in pins:
        x, y = map(int, pin.split('x'))
        radius = 5
        draw.ellipse([(x - radius, y - radius), (x + radius, y + radius)], fill='red')

    img_io = io.BytesIO()
    image.save(img_io, 'PNG')
    img_io.seek(0)

    return send_file(img_io, mimetype='image/png')

def a_star(grid, start, end):
    path = astar(grid, start, end)
    if path:
        path_json = json.dumps({'path': path})
        return path_json
    
def send_heart_rate():
    pass

def send_blood_pressure():
    pass

def send_breathing_rate():
    pass

def send_body_temperature():
    pass