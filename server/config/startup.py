from os import mkdir
from re import match
from urllib.parse import urlparse
from json import dump, load
from pathlib import Path
from requests import get, ConnectionError, Timeout
from time import sleep
import numpy as np
import rasterio 
import sys




SERVER_PATH = Path(__file__).parent.parent
DATA_PATH = SERVER_PATH / 'data'
PHOTO_PATH = DATA_PATH / 'photos'

TSS_PATH = SERVER_PATH / 'config' / 'tss_data.json'
LMCC_PATH = SERVER_PATH.parent / 'client' / 'lmcc_config.json'
TIFF_PATH = SERVER_PATH / 'images' / 'rockyard_map_geo.tif'
TIFF_DATA_PATH = DATA_PATH / 'geodata.npy'
ROCKYARD_PATH = DATA_PATH / 'rockyard.geojson'
TODO_PATH = DATA_PATH / 'todo.json'
WARNING_PATH = DATA_PATH / 'warning.json'
CHAT_PATH = DATA_PATH / 'chat.json'

PROCEDURES_PATH = Path(__file__).parent / 'procedures' 
EGRESS = PROCEDURES_PATH / 'egress.txt'
INGRESS = PROCEDURES_PATH / 'ingress.txt'
GEOLOGICAL_SAMPLING = PROCEDURES_PATH / 'geological_sampling.txt'
EMERGENCY = PROCEDURES_PATH / 'emergency.txt'
REPAIRS = PROCEDURES_PATH / 'repairs.txt'



def save_lmcc_to_json(holo_ip) -> None:
    """
    Saves the URL of the LMCC Server into `LMCC_PATH` to be used by the Client
    """
    ip = sys.argv[1]
    data = { "lmcc_url": f'http://{ip}:3001', "tickspeed": 100, "scale_factor": 5, "eva1_ip": holo_ip }
    with open(LMCC_PATH, "w") as file:
        dump(data, file, indent=4)





def save_tss_to_json(url: str, holo_ip: str) -> None:
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
        "TSS_PORT": port,
        "HOLOLENS_IP": holo_ip
    }

    with open(TSS_PATH, "w") as file:
        dump(url_data, file, indent=4)
    print(f"saved tss/holo config to {TSS_PATH}\nif you need to modify this, do so in that file\n")
    sleep(1)





def check_url(url: str) -> bool:
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
        return True 
    except (ConnectionError, Timeout, Exception):
        return False





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
    pattern = r'^http://(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):14141/?$'
    check_failed = False

    while True:
        tss_url = None
        if TSS_PATH.exists() and not check_failed:
            with open(TSS_PATH, "r") as json_file:
                tss_data = load(json_file)
            tss_url = tss_data.get("TSS_URL")

        if not tss_url:
            tss_url = input(f"\nenter tss url: ")

        if not match(pattern, tss_url):
            print(f'error: please enter a tss url in the correct format (ex: http://123.456.78.9:14141)')
            check_failed = True
            continue

        if not check_url(tss_url):
            print(f'error: your tss url may have changed, please enter it here (ex: http://123.456.78.9:14141)')
            check_failed = True
            continue
        else:
            break

    
    pattern = r'^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$'
    check_failed = False

    while True:
        holo_ip = None
        if TSS_PATH.exists() and not check_failed:
            with open(TSS_PATH, "r") as json_file:
                tss_data = load(json_file)
            holo_ip = tss_data.get("HOLO_URL")

        if not holo_ip:
            print('\nif not developing with hololens, enter 1.1.1.1')
            holo_ip = input(f"enter hololens ip: ")

        if not match(pattern, holo_ip):
            print(f'error: please enter a hololens ip in the correct format (ex: 123.456.78.9)')
            check_failed = True
            continue
        else:
            print('done!')
            break

    save_tss_to_json(tss_url, holo_ip)
    return tss_url, holo_ip





def create_data_endpoints():
    """
    Configures data directories and files for the server.

    Creates a 'data' directory and a 'rockyard.geojson' file in the server path 
    if they don't exist. Initializes 'rockyard.geojson' with an empty GeoJSON 
    feature collection.
    """
    # Create 'data' directory if it doesn't exist
    if not DATA_PATH.exists():
        mkdir(DATA_PATH)

    if not PHOTO_PATH.exists():
        mkdir(PHOTO_PATH)
    

    # Create 'rockyard.geojson' if it doesn't exist    
    with open(ROCKYARD_PATH, 'w') as rockyard:
        dump({"type": "FeatureCollection", "features": []}, rockyard, indent=4)


    # Create 'geodata.npy' if it doesn't exist
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


    with open(TODO_PATH, 'w') as todo:
        dump({
            "todoItems": [], 
        }, todo, indent=4)


    with open(WARNING_PATH, 'w') as warn:
        dump({
            'infoWarning': ''
        }, warn, indent=4)


    with open(EGRESS, 'r') as egress, \
        open(INGRESS, 'r') as ingress, \
        open(GEOLOGICAL_SAMPLING, 'r') as geological_sampling, \
        open(EMERGENCY, 'r') as emergency, \
        open(REPAIRS, 'r') as repairs:

        egress_prod = list(egress.readlines())
        ingress_prod = list(ingress.readlines())
        geological_sampling_prod = list(geological_sampling.readlines())
        emergency_prod = list(emergency.readlines())
        repairs_prod = list(repairs.readlines())
    


    with open(CHAT_PATH, 'w') as chat: 
        dump({
            "history": [
                {
                    "role": "user",
                    "parts": [f"""
                        Hello, you are an AI model trained specifically to help run a Local Mission Control Console for the 
                        NASA SUITS project. I am a human operator who will be interacting with you to run the console. 
                              
                        The NASA SUITS project is a simulated design challenge taking place at NASA's Johnson Space Center Rockyard, 
                        where we are testing the design of a new spacesuit heads-up-display for future missions to the Moon and Mars.
                        You are on the "frontend" Local Mission Control Console, and there is an operator controlling the spacesuit 
                        recieving data from this display. We will go through multiple phases detailed below within a certain time limit, 
                        with the goal of being as efficient as possible. 

                        In each input, you will be given a JSON list of "todo items" as well as a potential "warning" message, that will be an empty string 
                        if there is no warning, all in Text format that you will have to parse and respond to, but you will only 
                        incorporate the todo list in your decision making abilities if I say "todo" at any point in my input. 
                        The warning and todo messages will always be included as part of the input, in a section called *TODO* and *WARNING* respectively. 
                        If any item in the Todo List has its second attribute set to "True", that means that it has been completed!
                            - For example, if the Todo List was [["Test Communications", "True"]], then that means that the "Test Communications" task has been done. 
                              
                        There are multiple dimensions to what we are planning to do, split up across 5 "categories" with their procedures below: 
                            1. Egress 
                                {egress_prod}
                            2. Ingress 
                                {ingress_prod}
                            3. Geological Sampling 
                                {geological_sampling_prod}
                            4. Equipment Repair 
                                {repairs_prod}
                            5. Emergency Situation Handling
                                {emergency_prod}

                        If asked about any of these procedures with provided information about the current state of the mission, 
                        you must use these to provide the next steps in the procedure in the best course of action possible, as you 
                        deem fit. 

                        If prompted with "give me the next item" or some variation of "give me a todo item", you must 
                        provide one section in your output that begins with *TODO ITEM* and then the next item that you deem fit,
                        so that we can parse it out and send it to the list. This will be the only time you provide a todo item, when you 
                        deem that we are asking something *task* related from you. 

                        You must also never include the *WARNING* section in your output. That is *strictly* for me to give you information!

                        Regardless of this, you must ALWAYS AND FOREVER provide a couple sentences to prove justification for ANY ACTIONS 
                        you recommend, but the *TODO ITEM* must always be the last thing you tell us, and you should never doubt yourself. Be a confident AI!

                        In the *TODO ITEM*, you must tell us what procedure this is for. For example, if the step was to "Shut down Comm Tower (EV1)" 
                        such as in the Cable Repair procedure, you would say "1. Shut down Comm Tower (EVA1) for Cable Repair".
                        You will also never repeat a todo item that I have given to you. You should either provide beneficial instructions or 
                        ask for more information if you need it, but never copy what I say verbatim. 
                            - If you ever have N/A or no todo item, please DO NOT include *TODO ITEM* in your response or it will mess us up!
                            - If you told me a task and you see that its set to "False", i.e. Incomplete in the Todo List, repeat it and tell me to complete it first, since steps must BE IN STRICT ORDER THAT IVE PROVIDED!
                                - An incomplete item will look like: "["Todo item", "False"]"
                                - What this means is that if you suggested Step "1", and I ask for step "2" before completing step 1, or if its not in the list, then tell me to do it again!
                                    - This must be done REGARDLESS OF WHETHER I INSIST. Remember, BE CONFIDENT!
                            - Exclude the ":" after *TODO ITEM*, we will parse it out ourselves. THIS WILL CAUSE ERROR, SO LISTEN TO US!
                            - Remember, *TODO ITEM* and its subsequent item ONLY must be the VERY last thing in your response. JUSTIFY FIRST, ITEM LATER, LISTEN TO THIS!

                        One more thing, if the prompt says "Who are you?", you must respond with "I am the Team Cartographer LMCC Assistant" and NOTHING ELSE.

                        Make sure to replace "EV" with "EVA" and "MCC" with "LMCC" in your responses. 
                              
                        You will respond in Markdown without using any code block syntax. The most markdown you will
                        ever use is bold and italics. 
                              
                        You will not use any images or links in your responses, and will respond with either text or text
                        that looks like a JSON *only*. You will also not use any Latex or HTML tags in your responses. 
                        You will not run code, and will try to be the most efficient and helpful you can be. 

                        Thank you for your help, and let's get started. Await my next steps. 
                        """]
                },
                {
                    "role": "model",
                    "parts": ["Team Cartographer LMCC Assistant standing by."]
                }
            ]
        }, chat, indent=4)




def setup():
    """
    Sets up the application environment based on user input.

    Prompts the user to decide if they want to run the app components on their 
    machine. If 'Yes', it proceeds to configure the TSS URL, save LMCC data, 
    and configure data files. Exits with code 0 on success. If 'No', exits with 
    code 1. Continues to prompt until a valid response is provided.
    """
    while True: 
        check_local_tss = input('do you want to run the app (frontend, server, TSS, HoloLens) on your machine? (Y/n): ')
        if check_local_tss.strip().upper() == 'Y':
            _, holo_ip = get_tss_url()
            save_lmcc_to_json(holo_ip)
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
