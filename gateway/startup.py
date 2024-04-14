import rasterio 
import numpy as np 
from os import mkdir
from json import dump
from paths import GEODATA_PATH, GEOJSON_PATH, TODO_PATH, WARNING_PATH, PHOTO_DPATH, DATA_D, TIFF_PATH

def create_data_endpoints():
    """
    Configures data directories and files for the server.

    Creates a 'data' directory and a 'rockyard.geojson' file in the server path 
    if they don't exist. Initializes 'rockyard.geojson' with an empty GeoJSON 
    feature collection.
    """
    if not DATA_D.exists():
        mkdir(DATA_D)
        
    if not PHOTO_DPATH.exists(): 
        mkdir(PHOTO_DPATH)

    # Create 'rockyard.geojson' if it doesn't exist    
    with open(GEOJSON_PATH, 'w') as rockyard:
        dump({"type": "FeatureCollection", "features": []}, rockyard, indent=4)


    # Create 'geodata.npy' if it doesn't exist
    if not GEODATA_PATH.exists():
        with rasterio.open(TIFF_PATH) as src:
            width, height = src.width, src.height
            transform = src.transform
            coordinates = np.zeros((height, width), dtype=[('x', np.float64), ('y', np.float64)])

            rows, cols = np.arange(src.height), np.arange(src.width)
            col_indices, row_indices = np.meshgrid(cols, rows)
            xs, ys = transform * (col_indices, row_indices)
            coordinates = np.stack((xs, ys), axis=-1)

            np.save(GEODATA_PATH, coordinates)


    with open(TODO_PATH, 'w') as todo:
        dump({
            "todoItems": [], 
        }, todo, indent=4)


    with open(WARNING_PATH, 'w') as warn:
        dump({
            'infoWarning': ''
        }, warn, indent=4)

            