from os import mkdir
from re import match
from urllib.parse import urlparse
from json import dump, load
from pathlib import Path
from requests import get, ConnectionError, Timeout
from time import sleep

SERVER_PATH = Path(__file__).parent.parent
TSS_PATH = SERVER_PATH / 'config' / 'tss_data.json'
LMCC_PATH = SERVER_PATH.parent / 'client' / 'lmcc_config.json'


def save_lmcc_to_json():
    import socket
    ip = socket.gethostbyname(socket.gethostname())
    data = { "lmcc_url": f'http://{ip}:3001', "tickspeed": 100 }
    with open(LMCC_PATH, "w") as file:
        dump(data, file, indent=4)


def save_tss_to_json(url: str):
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


def get_tss_url():
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


def check_tss_url(url: str):
    try:
        response = get(url, timeout=1)
        if response.status_code == 200:
            print('\ntss server connection successful!')
    except (ConnectionError, Timeout):
        print(f'\ncould not connect to tss server at {url}. please make sure it is active')
        print(f'if you need to change the url, do so in {TSS_PATH}\n')
        exit(2)

def configure_data():
    data_path = SERVER_PATH / 'data'
    rockyard_path = data_path / 'rockyard.geojson'
    if not data_path.exists():
        mkdir(data_path)
    
    with open(rockyard_path, 'w') as rockyard:
        dump({"type": "FeatureCollection", "features": []}, rockyard, indent=4)
           

def setup():
    while True: 
        check_local_tss = input('do you want to run the app (frontend, server, TSS) on your machine? (Y/n): ')
        if check_local_tss.strip().upper() == 'Y':
            get_tss_url()
            save_lmcc_to_json()
            configure_data()
            exit(0)
        elif check_local_tss.strip().upper() == 'N':
            print('done!')
            exit(1)
        else:
            continue
            

if __name__ == "__main__":
    setup()
