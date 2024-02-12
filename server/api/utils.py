from pathlib import Path
import math
import numpy as np

SERVER_DIR: Path =  Path(__file__).parent.parent
TIFF_DATA_PATH = SERVER_DIR / 'data' / 'geodata.npy'
TIFF_DATASET = np.load(TIFF_DATA_PATH)


def distance_between_points(p1: str, p2: str) -> float:
    x1, y1 = [int(i) for i in p1.split('x')]
    x2, y2 = [int(i) for i in p2.split('x')]
    return math.sqrt((x2 - x1)**2 + (y2 - y1)**2)



def is_within_radius(check: str, existing_pins: list[str], radius=5) -> bool:
    for pin in existing_pins:
        if distance_between_points(check, pin) <= radius:
            return True
    return False


def get_lat_lon_from_tif(x: int, y: int) -> tuple[float, float]:
    lon, lat = TIFF_DATASET[x, y]
    return lat, lon