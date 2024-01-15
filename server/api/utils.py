import json
from pathlib import Path
import math

SERVER_DIR =  Path(__file__).parent.parent

def distance_between_points(p1, p2):
    x1, y1 = [int(i) for i in p1.split('x')]
    x2, y2 = [int(i) for i in p2.split('x')]
    return math.sqrt((x2 - x1)**2 + (y2 - y1)**2)

def is_within_radius(check, existing_pins, radius=5):
    for pin in existing_pins:
        if distance_between_points(check, pin) <= radius:
            return True
    return False

def image_coords_to_lat_lon(x, y):
    with open((SERVER_DIR / 'images' / 'mapping.json'), 'r') as file:
        data = json.load(file)

    top_left_lat, top_left_lon = data["top_left_lat"], data["top_left_lon"]
    bottom_right_lat, bottom_right_lon = data["bottom_right_lat"], data["bottom_right_lon"]
    image_height, image_width = data["size"][0], data["size"][1]
    
    lat_deg_per_pixel = (top_left_lat - bottom_right_lat) / image_height
    lon_deg_per_pixel = (bottom_right_lon - top_left_lon) / image_width
    
    lat = top_left_lat - (y * lat_deg_per_pixel)
    lon = top_left_lon + (x * lon_deg_per_pixel)
    
    return lat, lon


def lat_lon_to_image_coords(lat, lon):
    with open((SERVER_DIR / 'images' / 'mapping.json'), 'r') as file:
        data = json.load(file)

    top_left_lat, top_left_lon = data["top_left_lat"], data["top_left_lon"]
    bottom_right_lat, bottom_right_lon = data["bottom_right_lat"], data["bottom_right_lon"]
    image_height, image_width = data["size"][0], data["size"][1]

    lat_deg_per_pixel = (top_left_lat - bottom_right_lat) / image_height
    lon_deg_per_pixel = (bottom_right_lon - top_left_lon) / image_width
    
    x = (lon - top_left_lon) / lon_deg_per_pixel
    y = (top_left_lat - lat) / lat_deg_per_pixel
    
    return int(x), int(y)
