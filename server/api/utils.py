from pathlib import Path
import math
from re import T
import numpy as np

SERVER_DIR: Path =  Path(__file__).parent.parent
TIFF_DATA_PATH = SERVER_DIR / 'data' / 'geodata.npy'
TIFF_DATASET = np.load(TIFF_DATA_PATH)


def distance_between_points(p1: str, p2: str) -> float:
    # Extract x and y coordinates from the input strings
    x1, y1 = [int(i) for i in p1.split('x')]
    x2, y2 = [int(i) for i in p2.split('x')]
    # Calculate the distance between the two points
    return math.sqrt((x2 - x1)**2 + (y2 - y1)**2)



def is_within_radius(check: str, existing_pins: list[str], radius=5) -> bool:
    # Iterate through each existing pin
    for pin in existing_pins:
        # Check if the distance between the check point and the current pin is within the specified radius
        if distance_between_points(check, pin) <= radius:
            return True
    return False


def get_lat_lon_from_tif(x: int, y: int) -> tuple[float, float]:
    #Retrieve the latitude and longitude from the TIFF dataset
    lon, lat = TIFF_DATASET[y, x]
    return lat, lon


def get_x_y(lat: float, lon: float, lat_margin: float=0.00009, lon_margin: float=0.00009) -> tuple[int, int]:
    lat_diff = np.abs(TIFF_DATASET[..., 1] - lat)
    lon_diff = np.abs(TIFF_DATASET[..., 0] - lon)

    within_margin = np.where((lat_diff <= lat_margin) & (lon_diff <= lon_margin))

    if within_margin[0].size > 0:
        y_index, x_index = within_margin[0][0], within_margin[1][0]
        print(x_index, y_index)
        return(x_index, y_index)
    else:
        return TIFF_DATASET.shape[1]//2, TIFF_DATASET.shape[0]//2