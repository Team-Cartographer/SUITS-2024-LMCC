from re import match
from urllib.parse import urlparse
from json import dump
from pathlib import Path

DATA_PATH = Path(__file__).parent / 'tss_data.json'

def save_to_json(data):
    with open(DATA_PATH, "w") as file:
        dump(data, file, indent=4)

def get_tss_url():
    pattern = r'^http://(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):14141/?$'
    while True:
        url = input("enter your TSS server URL: ")
        if not match(pattern, url):
            print('please enter a URL in the correct format')
            continue
        else:
            break

    print(f"tss server url: {url}")
    parsed_url = urlparse(url)
    host = parsed_url.hostname
    port = parsed_url.port

    url_data = {
        "TSS_URL": url,
        "TSS_HOST": host,
        "TSS_PORT": port
    }

    save_to_json(url_data)
    print(f"saved tss config to {DATA_PATH}\nif you need to modify this, do so in that file\n")


if __name__ == "__main__":
    if DATA_PATH.exists():
        exit(0)
    else:
        get_tss_url()
