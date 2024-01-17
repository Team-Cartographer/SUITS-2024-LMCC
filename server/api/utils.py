from pathlib import Path
import math

SERVER_DIR: Path =  Path(__file__).parent.parent

TOP_L_LAT: float = 29.565376
TOP_L_LON: float = -95.082001
BOT_R_LAT: float = 29.564423
BOT_R_LON: float = -95.080691


def distance_between_points(p1: str, p2: str) -> float:
    x1, y1 = [int(i) for i in p1.split('x')]
    x2, y2 = [int(i) for i in p2.split('x')]
    return math.sqrt((x2 - x1)**2 + (y2 - y1)**2)



def is_within_radius(check: str, existing_pins: list[str], radius=5) -> bool:
    for pin in existing_pins:
        if distance_between_points(check, pin) <= radius:
            return True
    return False



def image_coords_to_lat_lon(x: str, y: str, height: int, width: int) -> tuple[float, float]:
    lat_deg_per_pixel = (TOP_L_LAT - BOT_R_LAT) / height
    lon_deg_per_pixel = (BOT_R_LON - TOP_L_LON) / width

    lat = TOP_L_LAT - (y * lat_deg_per_pixel)
    lon = TOP_L_LON + (x * lon_deg_per_pixel)
    
    return lat, lon



def lat_lon_to_image_coords(lat: float, lon: float, height: int, width: int) -> tuple[int, int]:
    lat_deg_per_pixel = (TOP_L_LAT - BOT_R_LAT) / height
    lon_deg_per_pixel = (BOT_R_LON - TOP_L_LON) / width
    
    x = (lon - TOP_L_LON) / lon_deg_per_pixel
    y = (TOP_L_LAT - lat) / lat_deg_per_pixel
    
    return int(x), int(y)
