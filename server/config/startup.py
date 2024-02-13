from os import mkdir
from re import match
from urllib.parse import urlparse
from json import dump, load
from pathlib import Path
from requests import get, ConnectionError, Timeout
from time import sleep
import numpy as np
import rasterio 




SERVER_PATH = Path(__file__).parent.parent
DATA_PATH = SERVER_PATH / 'data'

TSS_PATH = SERVER_PATH / 'config' / 'tss_data.json'
LMCC_PATH = SERVER_PATH.parent / 'client' / 'lmcc_config.json'
TIFF_PATH = SERVER_PATH / 'images' / 'rockyard_map_geo.tif'
TIFF_DATA_PATH = DATA_PATH / 'geodata.npy'
ROCKYARD_PATH = DATA_PATH / 'rockyard.geojson'
NOTIF_PATH = DATA_PATH / 'notification.json'





def save_lmcc_to_json() -> None:
    """
    Saves the URL of the LMCC Server into `LMCC_PATH` to be used by the Client
    """
    import socket
    ip = socket.gethostbyname(socket.gethostname())
    data = { "lmcc_url": f'http://{ip}:3001', "tickspeed": 100, "scale_factor": 5 }
    with open(LMCC_PATH, "w") as file:
        dump(data, file, indent=4)





def save_tss_to_json(url: str) -> None:
    """
    Saves the URL, HOST, and PORT of the `TSS` Server to be used by the Server 
    into a file at `TSS_PATH`
    """
    parsed_url = urlparse(url)
    host = parsed_url.hostname
    port = parsed_url.port

    url_data = {
        "TSS_URL": url,
        "TSS_HOST": host,
        "TSS_PORT": port
    }

    with open(TSS_PATH, "w") as file:
        dump(url_data, file, indent=4)
    print(f"saved tss config to {TSS_PATH}\nif you need to modify this, do so in that file\n")
    sleep(1)





def check_tss_url(url: str):
    """
    Checks the connectivity to the TSS server using the provided URL.

    Tries to connect to the TSS server. If successful, prints a success message. 
    If it fails due to connection errors or timeouts, it prints an error message 
    and advises on how to change the URL in TSS_PATH.

    Parameters:
    - url (str): The URL of the TSS server to test.

    Note:
    - Exits the program with exit code 2 on failure to connect.
    """
    try:
        response = get(url, timeout=1)
        if response.status_code == 200:
            print('\ntss server connection successful!')
    except (ConnectionError, Timeout):
        print(f'\ncould not connect to tss server at {url}. please make sure it is active')
        print(f'if you need to change the url, do so in {TSS_PATH}\n')
        exit(2)





def get_tss_url() -> None:
    """
    The function first checks if the TSS_PATH exists and reads the TSS URL from it. It then 
    validates the URL using 'check_tss_url'. If TSS_PATH doesn't exist or is invalid, it prompts 
    the user to enter the TSS URL in a specific format (http://<ip>:<port>) and validates it. 
    Upon successful validation, the URL is saved and the function completes.

    The URL format is validated against a pattern to ensure it follows the format:
    'http://<ip_address>:14141/'. The IP address should be a valid IPv4 address.

    Returns None.
    """
    if TSS_PATH.exists():
        with open(TSS_PATH, "r") as json_file:
            tss_data = load(json_file)
        check_tss_url(tss_data["TSS_URL"])
        print('done!')
        return 
    pattern = r'^http://(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):14141/?$'

    while True:
        url = input(f"\nenter tss url: ")
        if not match(pattern, url):
            print(f'error: please enter a tss url in the correct format (ex: http://123.456.78.9:1234)')
            continue
        else:
            check_tss_url(url)
            save_tss_to_json(url)
            print('done!')
            break





def create_data_endpoints():
    """
    Configures data directories and files for the server.

    Creates a 'data' directory and a 'rockyard.geojson' file in the server path 
    if they don't exist. Initializes 'rockyard.geojson' with an empty GeoJSON 
    feature collection.
    """
    if not DATA_PATH.exists():
        mkdir(DATA_PATH)
    

    with open(ROCKYARD_PATH, 'w') as rockyard:
        dump({"type": "FeatureCollection", "features": []}, rockyard, indent=4)


    if not TIFF_DATA_PATH.exists():
        with rasterio.open(TIFF_PATH) as src:
            width, height = src.width, src.height
            transform = src.transform
            coordinates = np.zeros((height, width), dtype=[('x', np.float64), ('y', np.float64)])

            rows, cols = np.arange(src.height), np.arange(src.width)
            col_indices, row_indices = np.meshgrid(cols, rows)
            xs, ys = transform * (col_indices, row_indices)
            coordinates = np.stack((xs, ys), axis=-1)

            np.save(TIFF_DATA_PATH, coordinates)


    with open(NOTIF_PATH, 'w') as notif: 
        dump({
            "infoWarning": '', 
            "infoTodo": '', 
            "isWarning": False,
        }, notif, indent=4)



def setup():
    """
    Sets up the application environment based on user input.

    Prompts the user to decide if they want to run the app components on their 
    machine. If 'Yes', it proceeds to configure the TSS URL, save LMCC data, 
    and configure data files. Exits with code 0 on success. If 'No', exits with 
    code 1. Continues to prompt until a valid response is provided.
    """
    while True: 
        check_local_tss = input('do you want to run the app (frontend, server, TSS) on your machine? (Y/n): ')
        if check_local_tss.strip().upper() == 'Y':
            get_tss_url()
            save_lmcc_to_json()
            create_data_endpoints()
            exit(0)
        elif check_local_tss.strip().upper() == 'N':
            print('done!')
            exit(1)
        else:
            continue
            




# Run the Program
if __name__ == "__main__":
    setup()
