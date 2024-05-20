from pathlib import Path 
from trimesh import load as meshload
import utm 
from collections import namedtuple
from collections import Counter
import numpy as np 
from requests import get
from json import loads, dumps

GEODATA_PATH = Path(__file__).parent / 'geodata.npy'
SPATIAL_HEIGHTMAP_PATH = Path(__file__).parent.parent / 'data' / 'grid.npy'
BREADCRUMBS_PATH = Path(__file__).parent / 'breadcrumbs.npy'

LATLON = namedtuple('LATLON', ['lat', 'lon'])
TIFF_DATASET = np.load(GEODATA_PATH)

    
def is_subset(features_a, features_b):
    normalize_feature = lambda feature: dumps(feature, sort_keys=True)
    features_to_set = lambda features: set(normalize_feature(feature) for feature in features)
    return features_to_set(features_a).issubset(features_to_set(features_b))


def latlon_to_utm(lat, lon):
    easting, northing, _, _ = utm.from_latlon(lat, lon)
    return [easting, northing]


def request_utm_data(tss_host: str) -> tuple[LATLON, LATLON, LATLON]: 
    req = get(f"http://{tss_host}:14141/json_data/IMU.json")
    req2 = get(f"http://{tss_host}:14141/json_data/ROVER.json")
    imu_data = loads(req.text)
    rover_data = loads(req2.text)

    east_eva1, north_eva1 = int(imu_data["imu"]["eva1"]["posx"]), int(imu_data["imu"]["eva1"]["posy"])
    east_eva2, north_eva2 = int(imu_data["imu"]["eva2"]["posx"]), int(imu_data["imu"]["eva2"]["posy"])
    heading_eva1, heading_eva2 = int(imu_data["imu"]["eva1"]["heading"]), int(imu_data["imu"]["eva2"]["heading"])
    east_rover, north_rover = int(rover_data["rover"]["posx"]), int(rover_data["rover"]["posy"])

    lat_eva_1, lon_eva_1 = get_lat_lon_from_utm(east_eva1, north_eva1, 15, 'R')
    lat_eva_2, lon_eva_2 = get_lat_lon_from_utm(east_eva2, north_eva2, 15, 'R')
    lat_rover, lon_rover = get_lat_lon_from_utm(east_rover, north_rover, 15, 'R')

    return LATLON(lat_eva_1, lon_eva_1), LATLON(lat_eva_2, lon_eva_2), LATLON(lat_rover, lon_rover), heading_eva1, heading_eva2



def get_lat_lon_from_utm(easting: int, northing: int, *_): 
    if(easting == northing == 0): 
        return LATLON(0, 0)
    lat, lon = utm.to_latlon(easting, northing, 15, 'R')
    return LATLON(lat, lon)



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
    


def get_lat_lon_from_x_y(x: int, y: int): 
    lat = TIFF_DATASET[x, y, 1]
    lon = TIFF_DATASET[x, y, 0]
    return lat, lon
    

def extend_cache_to_geojson(lat1, lon1, lat2, lon2, latrov, lonrov, x_ev1, y_ev1, x_ev2, y_ev2, x_rov, y_rov):
    return [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [lat1, lon1]
            },
            "properties": {
                "name": "EVA 1 Cache Point",
                "description": f"{x_ev1}x{y_ev1}",
                "utm": latlon_to_utm(lat1, lon1)
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [lat2, lon2]
            },
            "properties": {
                "name": "EVA 2 Cache Point",
                "description": f"{x_ev2}x{y_ev2}",
                "utm": latlon_to_utm(lat2, lon2)
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [latrov, lonrov]
            },
            "properties": {
                "name": "Rover Cache Point",
                "description": f"{x_rov}x{y_rov}",
                "utm": latlon_to_utm(latrov, lonrov)
            }
        }
    ]

        

def extend_eva_to_geojson(lat1, lon1, lat2, lon2, latrov, lonrov, x_ev1, y_ev1, x_ev2, y_ev2, x_rov, y_rov):
    return [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [lat1, lon1]
            },
            "properties": {
                "name": "EVA 1",
                "description": f"{x_ev1}x{y_ev1}",
                "utm": latlon_to_utm(lat1, lon1)                
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [lat2, lon2]
            },
            "properties": {
                "name": "EVA 2",
                "description": f"{x_ev2}x{y_ev2}",
                "utm": latlon_to_utm(lat2, lon2)
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [latrov, lonrov]
            },
            "properties": {
                "name": "Rover",
                "description": f"{x_rov}x{y_rov}",
                "utm": latlon_to_utm(latrov, lonrov)
            }
        }
    ]




def process_geojson_request(feature): 
    coordinates = feature.feature["geometry"].get("coordinates", [0, 0])
    utm = feature.feature["properties"].get("utm", [0, 0])

    if(coordinates[0] > 0 and coordinates[1] > 0):
        lat, lon = get_lat_lon_from_x_y(coordinates[0], coordinates[1])
        feature.feature["geometry"]["coordinates"] = [lat, lon]

    lat, lon = feature.feature["geometry"]["coordinates"]

    if(utm[0] == 0 and utm[1] == 0):
        feature.feature["properties"]["utm"] = latlon_to_utm(lat, lon)
    
    return feature 



def load_mesh(resolution=1500): 
    if SPATIAL_HEIGHTMAP_PATH.exists():
        return np.load(SPATIAL_HEIGHTMAP_PATH)

    mesh = meshload('SpatialMapping-3.obj', force='mesh')

    vertices = mesh.vertices
    vertices = vertices[:, [0, 2, 1]]  

    vertices[:, 0] += abs(vertices[:, 0].min())
    vertices[:, 1] += abs(vertices[:, 1].min())
    vertices[:, 2] += abs(vertices[:, 2].min())

    resolution = (resolution, resolution)
    grid = np.zeros(resolution)

    min_coords = vertices.min(axis=0)
    max_coords = vertices.max(axis=0)

    scale_x = resolution[0] / (max_coords[0] - min_coords[0])
    scale_y = resolution[1] / (max_coords[1] - min_coords[1])

    for vertex in vertices:
        x, y, z = vertex
        grid_x = int((x - min_coords[0]) * scale_x)
        grid_y = int((y - min_coords[1]) * scale_y)
        grid[grid_x-1, grid_y-1] = z

    np.save(SPATIAL_HEIGHTMAP_PATH, grid)
    return grid 



if __name__ == '__main__':
    import matplotlib.pyplot as plt 

    data = load_mesh(760)

    plt.figure(figsize=(10, 8))
    plt.imshow(data, cmap='hot', interpolation='nearest')
    plt.colorbar(label='Height')
    plt.title('Heatmap of 3D Mesh')
    plt.xlabel('X index')
    plt.ylabel('Y index')
    plt.show()
