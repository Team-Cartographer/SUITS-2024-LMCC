# all GET request helpers go in here
from PIL import Image, ImageDraw
from typing import Any, Dict, Union, List, Tuple
from .functions import astar
from flask import send_file
from flask import jsonify
from pathlib import Path
import json
import io
import random
from io import BytesIO

SERVER_DIR = Path(__file__).parent.parent 
DATA_DIR = SERVER_DIR / 'data'
NOTIF_PATH = DATA_DIR / 'notification.json'



def send_map_info() -> Union[Dict[str, Any], None]:
    # Define the path to the GeoJSON file
    mapping_json_path: Path = SERVER_DIR / 'data' / 'rockyard.geojson'

    # Read the GeoJSON file and load its contents
    with open(mapping_json_path, 'r') as json_file:
        data: Union[Dict[str, Any], None] = json.load(json_file)
    
    # Return the map information
    return data




def send_map() -> Any:
    # Define the path to the map image and geojson file
    map_path: Path = SERVER_DIR / 'images' / 'rockyard_map_png.png'
    geojson_path: Path = SERVER_DIR / 'data' / 'rockyard.geojson'
    
    # Open the map image
    image: Image.Image = Image.open(map_path)
    draw: ImageDraw.ImageDraw = ImageDraw.Draw(image)

    # Open the geojson file and load its contents
    with open(geojson_path, 'r') as file:
        data: dict = json.load(file)
    
    # Extract pin coordinates from the geojson data
    pins: list = []
    for feature in data['features']:
        pins.append(feature['properties']['description'])

    # Draw pins on the map image
    for pin in pins:
        x, y = map(int, pin.split('x'))
        x, y = x/5, y/5.
        radius: int = 3
        draw.ellipse([(x - radius, y - radius), (x + radius, y + radius)], fill='red')

    # Save the modified map image to an in-memory buffer
    img_io: BytesIO = BytesIO()
    image.save(img_io, 'PNG')
    img_io.seek(0)

    return send_file(img_io, mimetype='image/png')




def a_star(grid: Any, start: Tuple[int, int], end: Tuple[int, int]) -> Union[str, None]:
    """
    Executes the A* algorithm on a grid to find the optimal path from the start point to the end point.

    Parameters:
    - grid: The grid on which the algorithm will be executed.
    - start: The starting point for the path.
    - end: The ending point for the path.

    Returns:
    - A JSON string containing the optimal path if found, or None if no path is found.
    """
    # Execute the A* algorithm to find the optimal path
    path: List[Tuple[int, int]] = astar(grid, start, end)

    # If a path is found, convert it to JSON format and return it
    if path:
        path_json: str = json.dumps({'path': path})
        return path_json
    


    
def send_biom_data(eva: str) -> Dict[str, Any]:
    """
    Generates and returns random biometric data.

    Generates random values for heart rate, blood pressure, breathing rate, and body temperature.
    Constructs a JSON response containing the biometric data with units.

    Parameters:
    - eva: The identifier for the biological data source.

    Returns:
    - JSON response containing randomly generated biometric data.
    """
    # Generate random values for heart rate, blood pressure, breathing rate, and body temperature
    heart_rate: int = random.randint(70,104)
    systolic_pressure: int = random.randint(90,140)
    diastolic_pressure: int = random.randint(60,90)
    breathing_rate: int = random.randint(12,20)
    body_temperature: float = random.uniform(97.7,99.5)

    # Construct a JSON response containing the biometric data with units
    biometric_data: Dict[str, Any] = {
        'eva': eva,
        'data': {   
        }
    }
    
    biometric_data['data']['heart_rate'] = {'value': heart_rate, 'unit': 'bpm'}
    biometric_data['data']['blood_pressure'] = {'value': str(systolic_pressure) + '/' + str(diastolic_pressure), 'unit': 'mm Hg'}
    biometric_data['data']['breathing_rate'] = {'value': breathing_rate, 'unit': 'breaths/min'}
    biometric_data['data']['body_temperature'] = {'value': body_temperature, 'unit': 'F'}

    return biometric_data



def send_notification() -> Union[Dict[str, Any], None]:
    # Open the 'notifications.json' file and load its contents
    with open(NOTIF_PATH, 'r') as f:
        return json.load(f)