from pathlib import Path 
from requests import get
from json import loads
from pyproj import Proj, transform
from collections import namedtuple
import numpy as np 


GEODATA_PATH = Path(__file__).parent / 'geodata.npy'
BREADCRUMBS_PATH = Path(__file__).parent / 'breadcrumbs.npy'

utm_proj = Proj(proj='utm', zone=15, ellps='WGS84', datum='WGS84', units='m', north=True)
lat_lon_proj = Proj(proj='latlong', datum='WGS84')
round_8 = lambda x: round(x, 8)

LATLON = namedtuple('LATLON', ['lat', 'lon'])
TIFF_DATASET = np.load(GEODATA_PATH)


def request_utm_data(tss_host: str) -> tuple[LATLON, LATLON, LATLON]: 
    #req = get(f"http://{tss_host}:14141/json_data/IMU.json")
    #req2 = get(f"http://{tss_host}:14141/json_data/ROVER.json")
    #imu_data = loads(req.text)
    #rover_data = loads(req2.text)

    east_eva1, north_eva1 = 298354.07, 3272377.20 #int(imu_data["imu"]["eva1"]["posx"]), int(imu_data["imu"]["eva1"]["posy"])
    east_eva2, north_eva2 = 0, 0 #int(imu_data["imu"]["eva1"]["posx"]), int(imu_data["imu"]["eva1"]["posy"])
    east_rover, north_rover = 0, 0 #int(rover_data["rover"]["posx"]), int(rover_data["rover"]["posy"])

    lon_eva_1, lat_eva_1 = map(round_8, transform(utm_proj, lat_lon_proj, east_eva1, north_eva1))
    lon_eva_2, lat_eva_2 = map(round_8, transform(utm_proj, lat_lon_proj, east_eva2, north_eva2))
    lon_rover, lat_rover = map(round_8, transform(utm_proj, lat_lon_proj, east_rover, north_rover))

    return LATLON(lat_eva_1, lon_eva_1), LATLON(lon_eva_2, lat_eva_2), LATLON(lon_rover, lat_rover)



def get_x_y_from_lat_lon(lat: float, lon: float): 
    lat_diff = np.abs(TIFF_DATASET[..., 1] - lat)
    lon_diff = np.abs(TIFF_DATASET[..., 0] - lon)

    margin = 0.000008
    mask = (lat_diff <= margin) & (lon_diff <= margin)

    within_margin = np.where(mask)

    if within_margin[0].size > 0:
        y_index, x_index = within_margin[0][0], within_margin[1][0]
        return(x_index, y_index)
    else:
        return TIFF_DATASET.shape[1]//2, TIFF_DATASET.shape[0]//2
