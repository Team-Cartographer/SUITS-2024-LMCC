# all GET request helpers go in here
from PIL import Image, ImageDraw
from requests import get, post
from .utils import get_lat_lon_from_tif
from .functions import astar
from flask import send_file
from flask import jsonify
from pathlib import Path
import json
import random
from io import BytesIO
import urllib3
from requests.auth import HTTPBasicAuth
from base64 import b64encode

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

SERVER_DIR = Path(__file__).parent.parent 
TSS_DATA_PATH = SERVER_DIR / 'config' / 'tss_data.json'
DATA_DIR = SERVER_DIR / 'data'
TODO_PATH = DATA_DIR / 'todo.json'
WARNING_PATH = DATA_DIR / 'warning.json'
PHOTO_PATH = DATA_DIR / 'photos'

with open("config/tss_data.json", "r") as f:
    tss_data = json.load(f)
    f.close()

TSS_ROOT = tss_data["TSS_URL"]
TSS_HOST = tss_data["TSS_HOST"]
TSS_PORT = tss_data["TSS_PORT"]


def send_map_info() -> dict:
    # Define the path to the GeoJSON file
    mapping_json_path = SERVER_DIR / 'data' / 'rockyard.geojson'

    # Read the GeoJSON file and load its contents
    with open(mapping_json_path, 'r') as json_file:
        data = json.load(json_file)
    
    # Return the map information
    return data




def send_map() -> bytes:
    # Define the path to the map image and geojson file
    map_path: Path = SERVER_DIR / 'images' / 'rockyard_map_png.png'
    geojson_path: Path = SERVER_DIR / 'data' / 'rockyard.geojson'
    
    # Open the map image
    image: Image.Image = Image.open(map_path)
    draw: ImageDraw.ImageDraw = ImageDraw.Draw(image)

    # Open the geojson file and load its contents
    with open(geojson_path, 'r') as file:
        data: dict = json.load(file)

    req = get(f"http://{TSS_HOST}:{TSS_PORT}/json_data/IMU.json")
    req2 = get(f"http://{TSS_HOST}:{TSS_PORT}/json_data/ROVER.json")
    IMU_data = json.loads(req.text)
    ROVER_data = json.loads(req2.text)

    x_ev1, y_ev1 = 200, 300 #int(IMU_data["imu"]["eva1"]["posx"]), int(IMU_data["imu"]["eva1"]["posy"])
    x_ev2, y_ev2 = 300, 400 #int(IMU_data["imu"]["eva1"]["posx"]), int(IMU_data["imu"]["eva1"]["posy"])
    x_rov, y_rov = 400, 200 #int(ROVER_data["rover"]["posx"]),     int(ROVER_data["rover"]["posy"])

    # FIXME: Bring these back and save to GeoJSON 
    #lat_eva1, lon_eva1 = get_lat_lon_from_tif(x_ev1, y_ev1)
    #lat_eva2, lon_eva2 = get_lat_lon_from_tif(x_ev2, y_ev2)
    #lat_rover, lon_rover = get_lat_lon_from_tif(x_rov, y_rov)
    
    # Extract pin coordinates from the geojson data
    pins: list = []
    for feature in data['features']:
        pins.append(feature['properties']['description'])

    # Draw pins on the map image
    for pin in pins:
        x, y = map(int, pin.split('x'))
        x, y = x/5, y/5
        radius = 3
        draw.ellipse([(x - radius, y - radius), (x + radius, y + radius)], fill='red')

    radius = 5
    draw.ellipse([(x_ev1 - radius, y_ev1 - radius), (x_ev1 + radius, y_ev1 + radius)], fill='lawngreen')
    draw.ellipse([(x_ev2 - radius, y_ev2 - radius), (x_ev2 + radius, y_ev2 + radius)], fill='deeppink')
    draw.ellipse([(x_rov - radius, y_rov - radius), (x_rov + radius, y_rov + radius)], fill='aqua')

    # Save the modified map image to an in-memory buffer
    img_io = BytesIO()
    image.save(img_io, 'PNG')
    img_io.seek(0)

    return send_file(img_io, mimetype='image/png')




def a_star(grid: list[list[int]], start: tuple[int, int], end: tuple[int, int]) -> str | None:
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
    path = astar(grid, start, end)

    # If a path is found, convert it to JSON format and return it
    if path:
        path_json = json.dumps({'path': path})
        return path_json
    else:
        return None
    


    
def send_biom_data(eva: str) -> dict:
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
    heart_rate = random.randint(70,104)
    systolic_pressure = random.randint(90,140)
    diastolic_pressure = random.randint(60,90)
    breathing_rate = random.randint(12,20)
    body_temperature = random.uniform(97.7,99.5)

    # Construct a JSON response containing the biometric data with units
    biometric_data = {
        'eva': eva,
        'data': {   
        }
    }
    
    biometric_data['data']['heart_rate'] = {'value': str(heart_rate), 'unit': 'bpm'}
    biometric_data['data']['blood_pressure'] = {'value': (str(systolic_pressure), str(diastolic_pressure)), 'unit': 'mm Hg'}
    biometric_data['data']['breathing_rate'] = {'value': str(breathing_rate), 'unit': 'breaths/min'}
    biometric_data['data']['body_temperature'] = {'value': str(round(body_temperature, 1)), 'unit': 'F'}

    return biometric_data



def send_notification(_type: str) -> dict:
    if _type == 'TODO':
        with open(TODO_PATH, 'r') as f: 
            return json.load(f) 
    elif _type == 'WARNING':
        try: 
            with open(WARNING_PATH, 'r') as f:
                return json.load(f)
        except json.JSONDecodeError: 
            return send_notification(_type)
        


def send_rover_url() -> str: 
    with open(TSS_DATA_PATH, 'r') as jf: 
        data = json.load(jf)
    
    rover_url = f'{data["TSS_URL"]}/stream?topic=/camera/image_raw&type=ros_compressed"'

    return jsonify({
        "rover_url": rover_url
    })





def send_chat():
    with open(DATA_DIR / 'chat.json', 'r') as jf: 
        return json.load(jf)
    




def take_holo_pic(): 
    with open(TSS_DATA_PATH, 'r') as jf: 
        holo_ip = json.load(jf)["HOLOLENS_IP"]

    user, password = 'auto-abhi_mbp', 'password'

    takephoto_response = post(f"https://{holo_ip}/api/holographic/mrc/photo?holo=true&pv=true", 
                             verify=False, 
                             auth=HTTPBasicAuth(user, password))
    filename = json.loads(takephoto_response.text)["PhotoFileName"]
    encoded = b64encode(filename.encode('utf')).decode('utf-8')

    response = get(f"https://{holo_ip}/api/holographic/mrc/file?filename={encoded}", 
                            verify=False, 
                            auth=HTTPBasicAuth(user, password))
    
    if response.ok:
        with open(PHOTO_PATH / filename, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192): 
                f.write(chunk)
        return "200"
    else:
        return "404"