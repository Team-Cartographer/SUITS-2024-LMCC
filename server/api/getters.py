# all GET request helpers go in here
from PIL import Image, ImageDraw
from .functions import astar
from flask import send_file
from flask import jsonify
from pathlib import Path
import json
import io
import random

SERVER_DIR = Path(__file__).parent.parent 
DATA_DIR = SERVER_DIR / 'data'
NOTIF_PATH = DATA_DIR / 'notification.json'



def send_map_info():
    mapping_json_path = SERVER_DIR / 'data' / 'rockyard.geojson'
    with open(mapping_json_path, 'r') as json_file:
        data = json.load(json_file)
    return data 




def send_map():
    map_path = SERVER_DIR / 'images' / 'rockyard_map_png.png'
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
        x, y = x/5, y/5.
        radius = 3
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
    


    
def send_biom_data(eva):
    heart_rate = random.randint(70,104)
    systolic_pressure = random.randint(90,140)
    diastolic_pressure = random.randint(60,90)
    breathing_rate = random.randint(12,20)
    body_temperature = random.uniform(97.7,99.5)

    biometric_data = {
        'eva': eva,
        'data': {   
        }
    }
    
    biometric_data['data']['heart_rate'] = {'value': heart_rate, 'unit': 'bpm'}
    biometric_data['data']['blood_pressure'] = {'value': str(systolic_pressure) + '/' + str(diastolic_pressure), 'unit': 'mm Hg'}
    biometric_data['data']['breathing_rate'] = {'value': breathing_rate, 'unit': 'breaths/min'}
    biometric_data['data']['body_temperature'] = {'value': body_temperature, 'unit': 'F'}

    return jsonify(biometric_data)




def send_notification(args: dict):
    info_todo = args.get('infoTodo', None)
    info_warning = args.get('infoWarning', None)
    is_warning = args.get('isWarning', None)

    if info_todo or info_warning or is_warning:
        data = {
            "infoWarning": info_warning, 
            "infoTodo": info_todo, 
            "isWarning": is_warning,
        }
        with open(NOTIF_PATH, 'w') as jf:
            json.dump(data, jf, indent=4)
        return jsonify(data)
    else: 
        with open(NOTIF_PATH, 'r') as f:
            return json.load(f)