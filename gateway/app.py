# File Imports
import paths
from services.utils import process_geojson_request, request_utm_data, get_x_y_from_lat_lon, \
                    extend_eva_to_geojson, extend_cache_to_geojson, get_lat_lon_from_utm
from services.database import JSONDatabase, ListCache
from services.schema import GeoJSON, WarningItem, TodoItems, \
                            GeoJSONFeature, TodoItem

# Standard Imports 
from json import loads, load, dumps
from base64 import b64encode
from time import time 
from io import BytesIO
from concurrent.futures import ProcessPoolExecutor
from threading import Thread 
import asyncio 

# Third-Party Imports
from fastapi import FastAPI, status, WebSocketDisconnect, WebSocket, Request
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

eva1_poscache = ListCache(5000)
eva2_poscache = ListCache(5000)
rover_poscache = ListCache(5000)

app.curr_telemetry = dict() 
app.get_reqs = 0 
app.post_reqs = 0
app.start_time = time() 

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
    app.get_reqs += 1
    return JSONResponse({
        "greeting": "Welcome to the Team Cartographer Gateway API",
        "code": "Code can be found at https://github.com/Team-Cartographer/SUITS-2024-LMCC"
    }, status.HTTP_200_OK)


####################################################################################
################################# GET REQUESTS #####################################
####################################################################################

@app.get('/test')
def post_message() -> JSONResponse:
    app.get_reqs += 1
    "Test the API with a simple GET request"
    return JSONResponse({
        "message": "Hello, world!"
    }, status.HTTP_200_OK)


@app.get('/apimonitor')
def api_monitor() -> JSONResponse: 
    app.get_reqs += 1
    uptime = round(time() - app.start_time, 3)
    total_reqs = app.get_reqs + app.post_reqs
    return JSONResponse({
        "message": "Gateway API Monitoring Service",
        "uptime": uptime,
        "get_requests": app.get_reqs,
        "post_requests": app.post_reqs,
        "total_requests": total_reqs,
        "avg_requests_per_min": round(total_reqs / (uptime / 60), 3)
    }, status.HTTP_200_OK)


@app.get('/takephoto')
def take_hololens_photo(): 
    app.get_reqs += 1
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
    app.get_reqs += 1
    return JSONResponse(todoDb, status.HTTP_200_OK)

@app.get('/warning')
def get_warning() -> JSONResponse:
    app.get_reqs += 1
    return JSONResponse(warningDb, status.HTTP_200_OK)

@app.get('/geojson')
def get_geojson() -> JSONResponse:
    app.get_reqs += 1
    return JSONResponse(geojsonDb, status.HTTP_200_OK)

@app.get('/geojson_hmd')
def get_geojson_hmd() -> JSONResponse:
    app.get_reqs += 1
    data = {
        "features": []
    }
    for feature in geojsonDb["features"]:
        data["features"].append({
            "name": feature["properties"]["name"],
            "description": feature["properties"]["description"],
            "utm": feature["properties"]["utm"],
            "latlon": feature["geometry"]["coordinates"]
        })
    return JSONResponse(data, status.HTTP_200_OK)

########## MISSION ROUTES ###################################

@app.get('/mission/comm')
def comm():
    app.get_reqs += 1
    req = get(f"http://{TSS_HOST}:14141/json_data/COMM.json")
    return loads(req.text)

@app.get('/mission/dcu')
def dcu():
    app.get_reqs += 1
    req = get(f"http://{TSS_HOST}:14141/json_data/DCU.json")
    return loads(req.text)

@app.get('/mission/error')
def error_route():
    app.get_reqs += 1
    req = get(f"http://{TSS_HOST}:14141/json_data/ERROR.json")
    return loads(req.text)

@app.get('/mission/imu')
def imu():
    app.get_reqs += 1
    req = get(f"http://{TSS_HOST}:14141/json_data/IMU.json")
    return loads(req.text)

@app.get('/mission/rover')
def rover():
    app.get_reqs += 1
    req = get(f"http://{TSS_HOST}:14141/json_data/ROVER.json")
    ret = req.json() 
    east_rover, north_rover = int(ret["rover"]["posx"]), int(ret["rover"]["posy"])
    llr = get_lat_lon_from_utm(east_rover, north_rover)
    return { 
        "rover": {
            "posx": llr.lon,
            "posy": llr.lat,
            "qr_id": ret["rover"]["qr_id"]
        }
    }

@app.get('/mission/spec')
def spec():
    app.get_reqs += 1
    req = get(f"http://{TSS_HOST}:14141/json_data/SPEC.json")
    return loads(req.text) 

@app.get('/mission/uia')
def uia():
    app.get_reqs += 1
    req = get(f"http://{TSS_HOST}:14141/json_data/UIA.json")
    return loads(req.text)

########## TSS ROUTES #####################################

@app.get('/tss/info')
def tss_info():
    app.get_reqs += 1
    return {
        "TSS_HOST": TSS_HOST
    }

@app.get('/tss/telemetry')
def telemetry():
    app.get_reqs += 1
    req = get(f"http://{TSS_HOST}:14141/json_data/teams/1/TELEMETRY.json")
    app.curr_telemetry = loads(req.text)
    return app.curr_telemetry

@app.get('/tss/completed_telemetry')
def comp_telemetry():
    app.get_reqs += 1
    req = get(f"http://{TSS_HOST}:14141/json_data/teams/1/Completed_TELEMETRY.json")
    return loads(req.text)

@app.get('/tss/eva_info')
def eva_info():
    app.get_reqs += 1
    req = get(f"http://{TSS_HOST}:14141/json_data/teams/1/EVA.json")
    return loads(req.text)

@app.get('/tss/completed_eva')
def comp_eva():
    app.get_reqs += 1
    req = get(f"http://{TSS_HOST}:14141/json_data/teams/1/Completed_EVA.json")
    return loads(req.text)

@app.get('/tss/rockdata')
def rockdata():
    app.get_reqs += 1
    req = get(f"http://{TSS_HOST}:14141/json_data/rocks/RockData.json")
    return loads(req.text)

@app.get('/map')
def getmap():
    app.get_reqs += 1
    image = Image.open(paths.PNG_PATH)
    draw = ImageDraw.Draw(image)
    
    geojsonDb["features"] = [feature for feature in geojsonDb["features"] if feature["properties"]["name"] not in ["EVA 1", "EVA 2", "Rover"]]    

    ll1, ll2, ll3 = request_utm_data(TSS_HOST)
    with ProcessPoolExecutor() as executor:
        future1 = executor.submit(get_x_y_from_lat_lon, ll1.lat, ll1.lon)
        future2 = executor.submit(get_x_y_from_lat_lon, ll2.lat, ll2.lon)
        future3 = executor.submit(get_x_y_from_lat_lon, ll3.lat, ll3.lon)
    
    x_ev1, y_ev1 = future1.result()
    x_ev2, y_ev2 = future2.result()
    x_rov, y_rov = future3.result()

    geojsonDb["features"].extend(extend_eva_to_geojson(ll1.lat, ll1.lon, ll2.lat, ll2.lon, ll3.lat, ll3.lon, x_ev1, y_ev1, x_ev2, y_ev2, x_rov, y_rov))


    if app.curr_telemetry.get("telemetry", {"eva_time": 0}).get("eva_time", 0) >= 1: 
        geojsonDb["features"].extend(extend_cache_to_geojson(ll1.lat, ll1.lon, ll2.lat, ll2.lon, ll3.lat, ll3.lon, x_ev1, y_ev1, x_ev2, y_ev2, x_rov, y_rov))
        eva1_poscache.append((x_ev1, y_ev1))
        eva2_poscache.append((x_ev2, y_ev2))
        rover_poscache.append((x_rov, y_rov))

        def draw_lines(cache, color):
            for i in range(1, len(cache)):
                x1, y1 = cache[i-1]
                x2, y2 = cache[i]
                draw.line([(x1/5, y1/5), (x2/5, y2/5)], fill=color, width=2)

        thread1 = Thread(target=draw_lines, args=(eva1_poscache, 'lawngreen'))
        thread2 = Thread(target=draw_lines, args=(eva2_poscache, 'deeppink'))
        thread3 = Thread(target=draw_lines, args=(rover_poscache, 'aqua'))

        thread1.start()
        thread2.start()
        thread3.start()
        thread1.join()
        thread2.join()
        thread3.join()


    for feature in geojsonDb["features"]:
        description = feature["properties"]["description"]
        name = feature["properties"]["name"]

        if name in ["EVA 1 Cache Point", "EVA 2 Cache Point", "Rover Cache Point"]:
            continue

        x, y = map(int, description.split('x'))
        x, y = x/5, y/5

        if name in ["EVA 1", "EVA 2", "Rover"]:
            radius = 5
            draw.ellipse([(x - radius, y - radius), (x + radius, y + radius)], fill=('lawngreen' if name == 'EVA 1' else 'deeppink' if name == 'EVA 2' else 'aqua'), outline="black", width=2)
        else: 
            radius = 3
            draw.ellipse([(x - radius, y - radius), (x + radius, y + radius)], fill='red')
        
        if name != "":
            text_offset_x = 10
            text_offset_y = -5
            draw.text((x + text_offset_x, y + text_offset_y), name, fill='white', stroke_fill='black', stroke_width=2)


    img_io = BytesIO()
    image.save(img_io, 'PNG')
    img_io.seek(0)
    return StreamingResponse(content=iter([img_io.read()]), media_type="image/png")

    

####################################################################################
################################# POST REQUESTS ####################################
####################################################################################


@app.post('/settodo')
def update_todo(todoData: TodoItem) -> JSONResponse:
    app.post_reqs += 1
    todoDb["todoItems"] = todoData.todoItems
    return JSONResponse(todoDb, status.HTTP_201_CREATED)


@app.post('/setwarning')
def update_warning(warningData: WarningItem) -> JSONResponse:
    app.post_reqs += 1
    warningDb["infoWarning"] = warningData.infoWarning
    return JSONResponse(warningDb, status.HTTP_201_CREATED)


@app.post('/addfeature')
def update_features(feature: GeoJSONFeature) -> JSONResponse:
    app.post_reqs += 1
    
    feature = process_geojson_request(feature)
    print(feature) 

    geojsonDb["features"].append(feature.feature)
    return JSONResponse(geojsonDb, status_code=201)


@app.post('/removefeature')
def remove_feature(feature: GeoJSONFeature) -> JSONResponse:
    app.post_reqs += 1

    feature = process_geojson_request(feature)
    print(feature) 

    geojsonDb["features"].remove(feature.feature)
    return JSONResponse(geojsonDb, status.HTTP_201_CREATED)


####################################################################################
################################# WEBSOCKETS #######################################
####################################################################################

# # DATA POLLING WEBSOCKET (UNSTABLE, DO NOT USE)
# @app.websocket("/ws")
# async def websocket_endpoint(websocket: WebSocket):
#     await websocket.accept()
#     try:
#         while True:
#             message = await websocket.receive_text()
#             request = loads(message)
#             request_type = request.get("type")

#             if request_type == "test":
#                 await websocket.send_text(dumps({"message": "Hello, world!"}))

#             elif request_type == "apimonitor":
#                 uptime = round(time() - app.start_time, 3)
#                 total_reqs = app.get_reqs + app.post_reqs
#                 await websocket.send_text(dumps({
#                     "message": "Gateway API Monitoring Service",
#                     "uptime": uptime,
#                     "get_requests": app.get_reqs,
#                     "post_requests": app.post_reqs,
#                     "total_requests": total_reqs,
#                     "avg_requests_per_min": round(total_reqs / (uptime / 60), 3)
#                 }))

#             elif request_type == "todo":
#                 await websocket.send_text(dumps(todoDb))

#             elif request_type == "warning":
#                 await websocket.send_text(dumps(warningDb))

#             elif request_type == "geojson":
#                 await websocket.send_text(dumps(geojsonDb))

#             await asyncio.sleep(0.5)
#     except WebSocketDisconnect:
#         print("WebSocket disconnected")
#     except Exception as e:
#         print(f"Error: {e}")
#         await websocket.close()



@app.websocket("/map")
async def map_socket(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            image = Image.open(paths.PNG_PATH)
            draw = ImageDraw.Draw(image)
            
            geojsonDb["features"] = [feature for feature in geojsonDb["features"] if feature["properties"]["name"] not in ["EVA 1", "EVA 2", "Rover"]]    

            ll1, ll2, ll3 = request_utm_data(TSS_HOST)
            with ProcessPoolExecutor() as executor:
                future1 = executor.submit(get_x_y_from_lat_lon, ll1.lat, ll1.lon)
                future2 = executor.submit(get_x_y_from_lat_lon, ll2.lat, ll2.lon)
                future3 = executor.submit(get_x_y_from_lat_lon, ll3.lat, ll3.lon)
            
            x_ev1, y_ev1 = future1.result()
            x_ev2, y_ev2 = future2.result()
            x_rov, y_rov = future3.result()

            geojsonDb["features"].extend(extend_eva_to_geojson(ll1.lat, ll1.lon, ll2.lat, ll2.lon, ll3.lat, ll3.lon, x_ev1, y_ev1, x_ev2, y_ev2, x_rov, y_rov))


            if app.curr_telemetry.get("telemetry", {"eva_time": 0}).get("eva_time", 0) >= 1: 
                geojsonDb["features"].extend(extend_cache_to_geojson(ll1.lat, ll1.lon, ll2.lat, ll2.lon, ll3.lat, ll3.lon, x_ev1, y_ev1, x_ev2, y_ev2, x_rov, y_rov))
                eva1_poscache.append((x_ev1, y_ev1))
                eva2_poscache.append((x_ev2, y_ev2))
                rover_poscache.append((x_rov, y_rov))

                def draw_lines(cache, color):
                    for i in range(1, len(cache)):
                        x1, y1 = cache[i-1]
                        x2, y2 = cache[i]
                        draw.line([(x1/5, y1/5), (x2/5, y2/5)], fill=color, width=2)

                thread1 = Thread(target=draw_lines, args=(eva1_poscache, 'lawngreen'))
                thread2 = Thread(target=draw_lines, args=(eva2_poscache, 'deeppink'))
                thread3 = Thread(target=draw_lines, args=(rover_poscache, 'aqua'))

                thread1.start()
                thread2.start()
                thread3.start()
                thread1.join()
                thread2.join()
                thread3.join()


            for feature in geojsonDb["features"]:
                description = feature["properties"]["description"]
                name = feature["properties"]["name"]

                if name in ["EVA 1 Cache Point", "EVA 2 Cache Point", "Rover Cache Point"]:
                    continue

                x, y = map(int, description.split('x'))
                x, y = x/5, y/5

                if name in ["EVA 1", "EVA 2", "Rover"]:
                    radius = 5
                    draw.ellipse([(x - radius, y - radius), (x + radius, y + radius)], fill=('lawngreen' if name == 'EVA 1' else 'deeppink' if name == 'EVA 2' else 'aqua'), outline="black", width=2)
                else: 
                    radius = 3
                    draw.ellipse([(x - radius, y - radius), (x + radius, y + radius)], fill='red', outline="black", width=1)
                
                if name != "":
                    text_offset_x = 10
                    text_offset_y = -5
                    draw.text((x + text_offset_x, y + text_offset_y), name, fill='white', stroke_fill='black', stroke_width=2)


            img_io = BytesIO()
            image.save(img_io, 'PNG')
            img_io.seek(0)
            await websocket.send_bytes(img_io.read())
            await asyncio.sleep(0.5)
    except WebSocketDisconnect:
        print("WebSocket disconnected")
    except Exception as e:
        print(f"Error: {e}")
        await websocket.close()