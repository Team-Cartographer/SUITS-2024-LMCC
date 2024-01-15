# all POST request helpers go in here
from PIL import Image, ImageDraw
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

def update_map(args):
    map_path = SERVER_DIR / 'images' / 'rockYardMap.png'
    mapping_json_path = SERVER_DIR / 'data' / 'mapping.json'
    pins = args.get('pins', [])

    image = Image.open(map_path)
    draw = ImageDraw.Draw(image)

    with open(mapping_json_path, 'r') as file:
        data = json.load(file)

    try:
        if data['pins']:
            pins.extend(data['pins'])
    except KeyError:
        data['pins'] = []

    for pin in pins:
        x, y = map(int, pin.split('x'))
        radius = 5
        draw.ellipse([(x - radius, y - radius), (x + radius, y + radius)], fill='red')
    
        if pin not in data['pins']:
            data['pins'].append(pin)
            

    with open(mapping_json_path, 'w') as file:
        json.dump(data, file, indent=4)

    img_io = io.BytesIO()
    image.save(img_io, 'PNG')
    img_io.seek(0)

    return send_file(img_io, mimetype='image/png')




    



