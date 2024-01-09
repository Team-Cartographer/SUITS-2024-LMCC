from re import match
from urllib.parse import urlparse
from json import dump
from pathlib import Path

TSS_PATH = Path(__file__).parent / 'tss_data.json'

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

    with open(TSS_PATH, "w") as file:
        dump(url_data, file, indent=4)
    print(f"saved tss config to {TSS_PATH}\nif you need to modify this, do so in that file\n")


def get_url():
    if TSS_PATH.exists():
        print('done!')
        return 
    pattern = r'^http://(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):14141/?$'

    while True:
        url = input(f"\nenter tss url: ")
        if not match(pattern, url):
            print(f'error: please enter a tss url in the correct format (ex: http://123.456.78.9:1234)')
            continue
        else:
            save_tss_to_json(url)
            print('done!')
           


def setup():
    while True: 
        check_local_tss = input('do you want to run the app (frontend, server, TSS) on your machine? (Y/n): ')
        if check_local_tss.strip().upper() == 'Y':
            get_url(host='tss', port=14141)
            exit(0)
        elif check_local_tss.strip().upper() == 'N':
            print('done!')
            exit(1)
        else:
            continue
            

if __name__ == "__main__":
    setup()
