from pathlib import Path
import math

SERVER_DIR =  Path(__file__).parent.parent

TOP_L_LAT = 29.565376
TOP_L_LON = -95.082001
BOT_R_LAT = 29.564423
BOT_R_LON = -95.080691


def distance_between_points(p1, p2):
    x1, y1 = [int(i) for i in p1.split('x')]
    x2, y2 = [int(i) for i in p2.split('x')]
    return math.sqrt((x2 - x1)**2 + (y2 - y1)**2)



def is_within_radius(check, existing_pins, radius=5):
    for pin in existing_pins:
        if distance_between_points(check, pin) <= radius:
            return True
    return False



def image_coords_to_lat_lon(x, y, height, width):
    lat_deg_per_pixel = (TOP_L_LAT - BOT_R_LAT) / height
    lon_deg_per_pixel = (BOT_R_LON - TOP_L_LON) / width

    lat = TOP_L_LAT - (y * lat_deg_per_pixel)
    lon = TOP_L_LON + (x * lon_deg_per_pixel)
    
    return lat, lon



def lat_lon_to_image_coords(lat, lon, height, width):
    lat_deg_per_pixel = (TOP_L_LAT - BOT_R_LAT) / height
    lon_deg_per_pixel = (BOT_R_LON - TOP_L_LON) / width
    
    x = (lon - TOP_L_LON) / lon_deg_per_pixel
    y = (TOP_L_LAT - lat) / lat_deg_per_pixel
    
    return int(x), int(y)
