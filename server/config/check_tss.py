import requests
from json import load
from pathlib import Path

DATA_PATH = Path(__file__).parent / 'tss_data.json'

with open(DATA_PATH, "r") as json_file:
    data = load(json_file)

print(f"pinging {data['TSS_URL']}")
try:
    response = requests.get(data["TSS_URL"], timeout=2)
    if response.status_code == 200:
        exit(0)
except requests.ConnectionError:
    exit(1)
