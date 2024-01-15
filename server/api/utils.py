import json
from pathlib import Path

SERVER_DIR =  Path(__file__).parent.parent


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
