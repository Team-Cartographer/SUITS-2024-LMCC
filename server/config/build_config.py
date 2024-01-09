from json import dump
from pathlib import Path
from re import match

config_path = Path(__file__).parent.parent.parent / 'client' / 'lmcc_config.json'

print('\nthis part of the setup will setup the console with server variables...')

pattern = r'^http://(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):3001/?$'

while True:
    server_url = input('input external server url or enter \"l\" (for localhost) (exactly as written): ')
    if not match(pattern, server_url):
        if not server_url == 'l':
            print('error: please enter \"l\" or a url in the correct format (ex: http://123.456.78.9:3001)')
            continue
        else:
            break
    else:
        break

if server_url == "l":
    data = { "lmcc_server_url": "http://localhost:3001" }
else: 
    if server_url[-1] == '/':
        server_url = server_url[:-1]
    data = { "lmcc_server_url": server_url }

with open(config_path, "w") as json_file:
        dump(data, json_file, indent=4)

print('client config complete\n')

exit(0)