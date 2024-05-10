from pathlib import Path


PARENT = Path(__file__).parent
DATA_D = PARENT / 'data'

CONFIG_PATH = PARENT / 'tss.config.json'

PHOTO_DPATH = DATA_D / 'photos'
GEOJSON_PATH = DATA_D / 'rockyard.geojson'
TODO_PATH = DATA_D / 'todo.json'
WARNING_PATH = DATA_D / 'warning.json'
TIFF_PATH = PARENT / 'services' / 'rockyard.tif'
PNG_PATH = PARENT / 'services' / 'rockyardimg.png'
GEODATA_PATH = PARENT / 'services' / 'geodata.npy'
SPATIAL_PATH = DATA_D / 'SpatialMapping.obj'
SPATIAL_HEIGHTMAP_PATH = DATA_D / 'grid.npy' 