# File Imports
from io import BytesIO
import paths
from services.utils import request_utm_data, get_x_y_from_lat_lon
from services.database import JSONDatabase
from services.schema import GeoJSON, WarningItem, TodoItems, \
                            GeoJSONFeature, TodoItem

# Standard Imports 
from json import loads, load
from base64 import b64encode

# Third-Party Imports
from fastapi import FastAPI, status
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from requests import get, post
from requests.auth import HTTPBasicAuth
from PIL import Image, ImageDraw

####################################################################################
################################# CONFIGURATIONS ###################################
####################################################################################

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

todoDb: JSONDatabase[list[TodoItems]] = JSONDatabase(paths.TODO_PATH)
warningDb: JSONDatabase[WarningItem] = JSONDatabase(paths.WARNING_PATH)
geojsonDb: JSONDatabase[GeoJSON] = JSONDatabase(paths.GEOJSON_PATH)

with open(paths.CONFIG_PATH) as f:
    data = load(f)
    TSS_HOST = data["TSS_IP"]
    HOLO_IP = data["HOLOLENS_IP"]

####################################################################################
################################ SERVER EVENTS #####################################
####################################################################################


@app.on_event("startup")
def on_startup() -> None:
    if "todoItems" not in todoDb:
        todoDb["todoItems"] = []
    if "infoWarning" not in warningDb:
        warningDb["infoWarning"] = ""
    if "type" not in geojsonDb:
        geojsonDb["type"] = "FeatureCollection"
        geojsonDb["features"] = []


@app.on_event("shutdown")
def on_shutdown() -> None:
    """Close database when stopping API server."""
    todoDb.close()
    warningDb.close()
    geojsonDb.close()


@app.get('/')
def home() -> JSONResponse:
    return JSONResponse({
        "greeting": "Welcome to the Team Cartographer Gateway API",
        "code": "Code can be found at https://github.com/Team-Cartographer/SUITS-2024-LMCC"
    }, status.HTTP_200_OK)


####################################################################################
################################# GET REQUESTS #####################################
####################################################################################

@app.get('/test')
def post_message() -> JSONResponse:
    "Test the API with a simple GET request"
    return JSONResponse({
        "message": "Hello, world!"
    }, status.HTTP_200_OK)


@app.get('/takephoto')
def take_hololens_photo(): 
    user, password = 'auto-abhi_mbp', 'password'

    takephoto_response = post(f"https://{HOLO_IP}/api/holographic/mrc/photo?holo=true&pv=true", 
                             verify=False, 
                             auth=HTTPBasicAuth(user, password))
    filename = loads(takephoto_response.text)["PhotoFileName"]
    encoded = b64encode(filename.encode('utf')).decode('utf-8')

    response = get(f"https://{HOLO_IP}/api/holographic/mrc/file?filename={encoded}", 
                            verify=False, 
                            auth=HTTPBasicAuth(user, password))
    
    if response.ok:
        with open(paths.PHOTO_DPATH / filename, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192): 
                f.write(chunk)
        return "200"
    else:
        return "404"
 
########## DATABASE ROUTES ##################################

@app.get('/todo')
def get_todo() -> JSONResponse:
    return JSONResponse(todoDb, status.HTTP_200_OK)

@app.get('/warning')
def get_warning() -> JSONResponse:
    return JSONResponse(warningDb, status.HTTP_200_OK)

@app.get('/geojson')
def get_geojson() -> JSONResponse:
    return JSONResponse(geojsonDb, status.HTTP_200_OK)

########## MISSION ROUTES ###################################

@app.get('/mission/comm')
def comm():
    req = get(f"http://{TSS_HOST}:14141/json_data/COMM.json")
    return loads(req.text)

@app.get('/mission/dcu')
def dcu():
    req = get(f"http://{TSS_HOST}:14141/json_data/DCU.json")
    return loads(req.text)

@app.get('/mission/error')
def error_route():
    req = get(f"http://{TSS_HOST}:14141/json_data/ERROR.json")
    return loads(req.text)

@app.get('/mission/imu')
def imu():
    req = get(f"http://{TSS_HOST}:14141/json_data/IMU.json")
    return loads(req.text)

@app.get('/mission/rover')
def rover():
    req = get(f"http://{TSS_HOST}:14141/json_data/ROVER.json")
    return loads(req.text)

@app.get('/mission/spec')
def spec():
    req = get(f"http://{TSS_HOST}:14141/json_data/SPEC.json")
    return loads(req.text)

@app.get('/mission/uia')
def uia():
    req = get(f"http://{TSS_HOST}:14141/json_data/UIA.json")
    return loads(req.text)

########## TSS ROUTES #####################################

@app.get('/tss/info')
def tss_info():
    return {
        "TSS_HOST": TSS_HOST
    }

@app.get('/tss/telemetry')
def telemetry():
    req = get(f"http://{TSS_HOST}:14141/json_data/teams/1/TELEMETRY.json")
    return loads(req.text)

@app.get('/tss/completed_telemetry')
def comp_telemetry():
    req = get(f"http://{TSS_HOST}:14141/json_data/teams/1/Completed_TELEMETRY.json")
    return loads(req.text)

@app.get('/tss/eva_info')
def eva_info():
    req = get(f"http://{TSS_HOST}:14141/json_data/teams/1/EVA.json")
    return loads(req.text)

@app.get('/tss/completed_eva')
def comp_eva():
    req = get(f"http://{TSS_HOST}:14141/json_data/teams/1/Completed_EVA.json")
    return loads(req.text)

@app.get('/tss/rockdata')
def rockdata():
    req = get(f"http://{TSS_HOST}:14141/json_data/rocks/RockData.json")
    return loads(req.text)

@app.get('/map')
def getmap(): 
    image: Image.Image = Image.open(paths.PNG_PATH)
    draw: ImageDraw.ImageDraw = ImageDraw.Draw(image)

    ll1, ll2, ll3 = request_utm_data(TSS_HOST)
    x_ev1, y_ev1 = get_x_y_from_lat_lon(ll1.lat, ll1.lon)
    x_ev2, y_ev2 = get_x_y_from_lat_lon(ll2.lat, ll2.lon)
    x_rov, y_rov = get_x_y_from_lat_lon(ll3.lat, ll3.lon)

    pins: list = []
    for feature in geojsonDb["features"]:
        pins.append(feature["properties"]["description"])

    for pin in pins:
        x, y = map(int, pin.split('x'))
        x, y = x/5, y/5
        radius = 3
        draw.ellipse([(x - radius, y - radius), (x + radius, y + radius)], fill='red')

    radius = 5
    draw.ellipse([(x_ev1/5 - radius, y_ev1/5 - radius), (x_ev1/5 + radius, y_ev1/5 + radius)], fill='lawngreen')
    draw.ellipse([(x_ev2/5 - radius, y_ev2/5 - radius), (x_ev2/5 + radius, y_ev2/5 + radius)], fill='deeppink')
    draw.ellipse([(x_rov/5 - radius, y_rov/5 - radius), (x_rov/5 + radius, y_rov/5 + radius)], fill='aqua')

    img_io = BytesIO()
    image.save(img_io, 'PNG')
    img_io.seek(0)
    return StreamingResponse(content=iter([img_io.read()]))
    

####################################################################################
################################# POST REQUESTS ####################################
####################################################################################


@app.post('/settodo')
def update_todo(todoData: TodoItem) -> JSONResponse:
    todoDb["todoItems"] = todoData.todoItems
    return JSONResponse(todoDb, status.HTTP_200_OK)


@app.post('/setwarning')
def update_warning(warningData: WarningItem) -> JSONResponse:
    warningDb["infoWarning"] = warningData.infoWarning
    return JSONResponse(warningDb, status.HTTP_200_OK)


@app.post('/addfeature')
def update_features(feature: GeoJSONFeature) -> JSONResponse:
    geojsonDb["features"].append(feature.feature)
    return JSONResponse(geojsonDb, status.HTTP_200_OK)


@app.post('/removefeature')
def remove_feature(feature: GeoJSONFeature) -> JSONResponse:
    geojsonDb["features"].remove(feature.feature)
    return JSONResponse(geojsonDb, status.HTTP_200_OK)
