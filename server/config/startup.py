from re import match
from urllib.parse import urlparse
from json import dump
from pathlib import Path

TSS_PATH = Path(__file__).parent / 'tss_data.json'
LMCC_PATH = Path(__file__).parent.parent.parent / 'client' / 'lmcc_config.json'

def save_to_json(data: dict, path: Path):
    with open(path, "w") as file:
        dump(data, file, indent=4)

def save_tss_to_json(url: str):
    print(f"tss server url: {url}")
    parsed_url = urlparse(url)
    host = parsed_url.hostname
    port = parsed_url.port

    url_data = {
        "TSS_URL": url,
        "TSS_HOST": host,
        "TSS_PORT": port
    }

    save_to_json(url_data, TSS_PATH)
    print(f"saved tss config to {TSS_PATH}\nif you need to modify this, do so in that file\n")

def save_lmcc_to_client(url: str):
    url_data = {
        "lmcc_server_url": url
    }

    save_to_json(url_data, LMCC_PATH)
    print(f"\nsaved lmcc config to {LMCC_PATH}\nif you need to modify this, do so in that file\n")


def get_url(host: str, port: int):
    if port == 14141:
        if TSS_PATH.exists():
            save_lmcc_to_client('http://localhost:3001')
            print('done!')
            return 
        pattern = r'^http://(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):14141/?$'
    elif port == 3001:
        pattern = r'^http://(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):3001/?$'

    while True:
        url = input(f"\nenter {host} url: ")
        if not match(pattern, url):
            print(f'error: please enter a {host} url in the correct format (ex: http://123.456.78.9:1234)')
            continue
        else:
            if port == 14141:
                save_tss_to_json(url)
            if port == 3001:
                save_lmcc_to_client(url)
            break


def setup():
    while True: 
        check_local_tss = input('are you running the servers (TSS & LMCC) on your machine? (Y/n): ')
        if check_local_tss.strip().upper() == 'Y':
            get_url(host='tss', port=14141)
            exit(0)
        elif check_local_tss.strip().upper() == 'N':
            get_url(host='lmcc server', port=3001)
            exit(1)
        else:
            continue
            

if __name__ == "__main__":
    setup()
