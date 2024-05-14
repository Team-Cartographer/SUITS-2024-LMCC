from pathlib import Path 
from trimesh import load as meshload
from pyproj import Proj, transform
from collections import namedtuple
import numpy as np 
from requests import get
from json import loads 


GEODATA_PATH = Path(__file__).parent / 'geodata.npy'
SPATIAL_HEIGHTMAP_PATH = Path(__file__).parent.parent / 'data' / 'grid.npy'
BREADCRUMBS_PATH = Path(__file__).parent / 'breadcrumbs.npy'

utm_proj = Proj(proj='utm', zone=15, ellps='WGS84', datum='WGS84', units='m', north=True)
lat_lon_proj = Proj(proj='latlong', datum='WGS84')
round_8 = lambda x: round(x, 8)

LATLON = namedtuple('LATLON', ['lat', 'lon'])
TIFF_DATASET = np.load(GEODATA_PATH)


def request_utm_data(tss_host: str) -> tuple[LATLON, LATLON, LATLON]: 
    req = get(f"http://{tss_host}:14141/json_data/IMU.json")
    req2 = get(f"http://{tss_host}:14141/json_data/ROVER.json")
    imu_data = loads(req.text)
    rover_data = loads(req2.text)

    east_eva1, north_eva1 = int(imu_data["imu"]["eva1"]["posx"]), int(imu_data["imu"]["eva1"]["posy"])
    east_eva2, north_eva2 = int(imu_data["imu"]["eva2"]["posx"]), int(imu_data["imu"]["eva2"]["posy"])
    east_rover, north_rover = int(rover_data["rover"]["posx"]), int(rover_data["rover"]["posy"])

    lon_eva_1, lat_eva_1 = map(round_8, transform(utm_proj, lat_lon_proj, east_eva1, north_eva1))
    lon_eva_2, lat_eva_2 = map(round_8, transform(utm_proj, lat_lon_proj, east_eva2, north_eva2))
    lon_rover, lat_rover = map(round_8, transform(utm_proj, lat_lon_proj, east_rover, north_rover))

    return LATLON(lat_eva_1, lon_eva_1), LATLON(lat_eva_2, lon_eva_2), LATLON(lat_rover, lon_rover)



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
                "description": f"{x_ev1}x{y_ev1}"
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
                "description": f"{x_ev2}x{y_ev2}"
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
                "description": f"{x_rov}x{y_rov}"
            }
        }
    ]



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
