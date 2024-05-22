# File Imports
import paths
from services.utils import process_geojson_request, request_utm_data, get_x_y_from_lat_lon, \
                    extend_eva_to_geojson, extend_cache_to_geojson, get_lat_lon_from_utm, get_lat_lon_from_x_y, \
                    latlon_to_utm
from services.database import JSONDatabase, ListCache
from services.astar import run_astar
from services.schema import GeoJSON, WarningItem, TodoItems, TodoItem, GeoJSONFeature

# Standard Imports 
import os
import math 
from copy import deepcopy
from json import loads, load, dumps
from base64 import b64encode
from time import time 
from io import BytesIO
from concurrent.futures import ProcessPoolExecutor
from threading import Thread 
import asyncio 

# Third-Party Imports
from fastapi import FastAPI, HTTPException, status, WebSocketDisconnect, WebSocket
from fastapi.responses import FileResponse, JSONResponse, StreamingResponse
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

eva1_poscache  = ListCache(360)
eva2_poscache  = ListCache(360)
rover_poscache = ListCache(360)

app.curr_telemetry = dict() 
app.last_qr_id = 0
app.get_reqs = 0 
app.post_reqs = 0
app.start_time = time() 
app.astar_path = []
app.prev_breadcrumb = 1

with open(paths.CONFIG_PATH) as f:
    data = load(f)
    TSS_HOST = data["TSS_IP"]
    EVA1_IP = data["EVA1_IP"]
    EVA2_IP = data["EVA2_IP"]

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
        geojsonDb["features"] = [
                    {
                        "type": "Feature",
                        "properties": {
                            "name": "UIA",
                            "description": "1970x2680",
                            "utm": [
                                298379.8067379597,
                                3272376.272166174
                            ]
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                29.564851812958292,
                                -95.08120434522316
                            ]
                        }
                    },
                    {
                        "type": "Feature",
                        "properties": {
                            "name": "GeoA",
                            "description": "810x2575",
                            "utm": [
                                298377.3016336306,
                                3272417.2618119475
                            ]
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                29.565221102815265,
                                -95.08123777232228
                            ]
                        }
                    },

                    {
                        "type": "Feature",
                        "properties": {
                            "name": "GeoB",
                            "description": "1265x2315",
                            "utm": [
                                298368.99328193004,
                                3272401.350574164
                            ]
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                29.5650762520524,
                                -95.08132054418678
                            ]
                        }
                    },
                    {
                        "type": "Feature",
                        "properties": {
                            "name": "GeoC",
                            "description": "1035x2100",
                            "utm": [
                                298362.5065035918,
                                3272409.585246472
                            ]
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                29.565149473317145,
                                -95.08138899015165
                            ]
                        }
                    },
                    {
                        "type": "Feature",
                        "properties": {
                            "name": "GeoD",
                            "description": "1270x1865",
                            "utm": [
                                298355.10853550996,
                                3272401.423072609
                            ]
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                29.565074660285777,
                                -95.08146380318301
                            ]
                        }
                    },
                    {
                        "type": "Feature",
                        "properties": {
                            "name": "GeoE",
                            "description": "1860x1980",
                            "utm": [
                                298358.28272142727,
                                3272380.540812802
                            ]
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                29.56488683182404,
                                -95.08142719255065
                            ]
                        }
                    },
                    {
                        "type": "Feature",
                        "properties": {
                            "name": "GeoF",
                            "description": "2425x1505",
                            "utm": [
                                298343.2723772615,
                                3272360.867084749
                            ]
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                29.564706962195427,
                                -95.08157841038
                            ]
                        }
                    },
                    {
                        "type": "Feature",
                        "properties": {
                            "name": "RovGeoG",
                            "description": "1840x1505",
                            "utm": [
                                298343.64256805787,
                                3272381.5092994412
                            ]
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                29.564893198890537,
                                -95.08157841038
                            ]
                        }
                    },
                    {
                        "type": "Feature",
                        "properties": {
                            "name": "Comm Tower",
                            "description": "2565x1770",
                            "utm": [
                                298351.35852840694,
                                3272355.780468023
                            ]
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                29.56466239272993,
                                -95.08149404674889
                            ]
                        }
                    }
                ]


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


ROCK_IMAGES_DIR = "rock_graphs"

@app.get("/rock_img")
def get_rock_img(id_number: int):
    try:
        file_path = os.path.join(ROCK_IMAGES_DIR, f"{id_number}.png")
        if os.path.exists(file_path):
            return FileResponse(file_path)
        else:
            raise HTTPException(status_code=404, detail="Rock image not found")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid rock id")


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



@app.get('/navigate')
def navigate() -> JSONResponse:
    points = []

    geojsonDb["features"] = [feature for feature in geojsonDb["features"] if feature["properties"]["name"] != "A* Path"]

    for feature in geojsonDb["features"]:
        description = feature["properties"]["description"]
        name = feature["properties"]["name"]

        if name in [
                "EVA 1", "EVA 2", "Rover", "EVA 1 Cache Point", "EVA 2 Cache Point", "Rover Cache Point",
                "GeoA", "GeoB", "GeoC", "GeoD", "GeoE", "GeoF", "UIA", "Comm Tower", "RovGeoG"
            ]:
            continue

        x, y = map(int, description.split('x'))
        points.append((int(x), int(y)))

    if not points: 
        return JSONResponse({
            "error": "No points to navigate"
        })
    
    a_st_path = []
    # sorted_points = sorted(points, key=lambda point: (point[1], point[0]))
    sorted_points = points 

    if len(sorted_points) >= 2: 
        start_x, start_y = sorted_points[-2]
        end_x, end_y = sorted_points[-1]
        try: 
            a_st_path.extend(run_astar(start_x, start_y, end_x, end_y))
        except Exception as e: 
            return JSONResponse({
                "error": str(e)
            })
    else: 
        return JSONResponse({
            "error": "Not enough points to navigate"
        })

    if a_st_path: 
        a_st_path = map(lambda x: (x[0] / 5, x[1] / 5), a_st_path)
        app.astar_path = list(a_st_path)
    else: 
        app.astar_path = []

    return JSONResponse({
        "final_path": str(app.astar_path)
    })




@app.get('/takephoto')
def take_hololens_photo(eva: int = 1): 
    app.get_reqs += 1
    user, password = 'auto-abhi_mbp', 'password'
    EVA_IP = EVA1_IP
    if eva == 1: 
        EVA_IP = EVA1_IP
    else: 
        EVA_IP = EVA2_IP 

    takephoto_response = post(f"https://{EVA_IP}/api/holographic/mrc/photo?holo=true&pv=true", 
                             verify=False, 
                             auth=HTTPBasicAuth(user, password))
    filename = loads(takephoto_response.text)["PhotoFileName"]
    encoded = b64encode(filename.encode('utf')).decode('utf-8')

    response = get(f"https://{EVA_IP}/api/holographic/mrc/file?filename={encoded}", 
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
    copied = deepcopy(geojsonDb)

    copied["features"].extend(eva1_poscache)
    copied["features"].extend(eva2_poscache)
    copied["features"].extend(rover_poscache)

    return JSONResponse(geojsonDb, status.HTTP_200_OK)

@app.get('/geojson_hmd')
def get_geojson_hmd() -> JSONResponse:
    app.get_reqs += 1
    temp_data = {
        "features": []
    }
    temp_data["features"].extend(geojsonDb["features"])
    temp_data["features"].extend(eva1_poscache)
    temp_data["features"].extend(eva2_poscache)
    temp_data["features"].extend(rover_poscache)

    data = { 
        "features": []
    }

    for feature in temp_data["features"]:
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
    qr_id = ret["rover"]["qr_id"]
    east_rover, north_rover = int(ret["rover"]["posx"]), int(ret["rover"]["posy"])
    llr = get_lat_lon_from_utm(east_rover, north_rover)

    if qr_id != 0 and qr_id != app.last_qr_id: 
        app.last_qr_id = qr_id
        todoDb["todoItems"].append("Place pin at rover location, and scan sample with ID " + str(qr_id))
        
    return { 
        "rover": {
            "posx": llr.lat,
            "posy": llr.lon,
            "qr_id": qr_id
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

    ll1, ll2, llr = request_utm_data(TSS_HOST)
    x_ev1, y_ev1 = get_x_y_from_lat_lon(ll1.lat, ll1.lon)
    x_ev2, y_ev2 = get_x_y_from_lat_lon(ll2.lat, ll2.lon)
    x_rov, y_rov = get_x_y_from_lat_lon(llr.lat, llr.lon)

    geojsonDb["features"].extend(extend_eva_to_geojson(ll1.lat, ll1.lon, ll2.lat, ll2.lon, llr.lat, llr.lon, x_ev1, y_ev1, x_ev2, y_ev2, x_rov, y_rov))
    cur_time = app.curr_telemetry.get("telemetry", {"eva_time": 0}).get("eva_time", 0)

    if cur_time >= 0.1: 
        if cur_time - app.prev_breadcrumb > 12:
            ev1, ev2, rover = extend_cache_to_geojson(ll1.lat, ll1.lon, ll2.lat, ll2.lon, llr.lat, llr.lon, x_ev1, y_ev1, x_ev2, y_ev2, x_rov, y_rov)

            eva1_poscache.append(ev1)
            eva2_poscache.append(ev2)
            rover_poscache.append(rover)

            def draw_dots(cache, color):
                for i in range(0, len(cache)):
                    x, y = map(int, cache[i]["properties"]["description"].split('x'))
                    radius = 2
                    draw.ellipse([(x - radius, y - radius), (x + radius, y + radius)], fill=color)

            thread1 = Thread(target=draw_dots, args=(eva1_poscache, 'lawngreen'))
            thread2 = Thread(target=draw_dots, args=(eva2_poscache, 'deeppink'))
            thread3 = Thread(target=draw_dots, args=(rover_poscache, 'aqua'))

            thread1.start()
            thread2.start()
            thread3.start()
            thread1.join()
            thread2.join()
            thread3.join()

            app.prev_breadcrumb = cur_time


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
    geojsonDb["features"].append(feature.feature)

    return JSONResponse(geojsonDb, status_code=201)


@app.post('/removefeature')
def remove_feature(feature: GeoJSONFeature) -> JSONResponse:
    app.post_reqs += 1

    feature = process_geojson_request(feature)
    geojsonDb["features"].remove(feature.feature)

    app.astar_path = []

    return JSONResponse(geojsonDb, status.HTTP_201_CREATED)


####################################################################################
################################# WEBSOCKETS #######################################
####################################################################################


@app.websocket("/map")
async def map_socket(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            image = Image.open(paths.PNG_PATH)
            draw = ImageDraw.Draw(image)
            
            geojsonDb["features"] = [feature for feature in geojsonDb["features"] if feature["properties"]["name"] not in ["EVA 1", "EVA 2", "Rover"]]    

            ll1, ll2, ll3, heading_eva1, heading_eva2 = request_utm_data(TSS_HOST)
            with ProcessPoolExecutor() as executor:
                future1 = executor.submit(get_x_y_from_lat_lon, ll1.lat, ll1.lon)
                future2 = executor.submit(get_x_y_from_lat_lon, ll2.lat, ll2.lon)
                future3 = executor.submit(get_x_y_from_lat_lon, ll3.lat, ll3.lon)
            
            x_ev1, y_ev1 = future1.result()
            x_ev2, y_ev2 = future2.result()
            x_rov, y_rov = future3.result()

            geojsonDb["features"].extend(extend_eva_to_geojson(ll1.lat, ll1.lon, ll2.lat, ll2.lon, ll3.lat, ll3.lon, x_ev1, y_ev1, x_ev2, y_ev2, x_rov, y_rov))

            cur_time = app.curr_telemetry.get("telemetry", {"eva_time": 0}).get("eva_time", 0)

            if cur_time >= 1: 
                if cur_time - app.prev_breadcrumb > 10:
                    ev1, ev2, rover = extend_cache_to_geojson(ll1.lat, ll1.lon, ll2.lat, ll2.lon, ll3.lat, ll3.lon, x_ev1, y_ev1, x_ev2, y_ev2, x_rov, y_rov)

                    eva1_poscache.append(ev1)
                    eva2_poscache.append(ev2)
                    rover_poscache.append(rover)
                    
                    app.prev_breadcrumb = cur_time

                def draw_dots(cache, color):
                    for i in range(0, len(cache)):
                        x, y = map(int, cache[i]["properties"]["description"].split('x'))
                        radius = 2
                        draw.ellipse([(x/5 - radius, y/5 - radius), (x/5 + radius, y/5 + radius)], fill=color)

                thread1 = Thread(target=draw_dots, args=(eva1_poscache, 'lawngreen'))
                thread2 = Thread(target=draw_dots, args=(eva2_poscache, 'deeppink'))
                thread3 = Thread(target=draw_dots, args=(rover_poscache, 'aqua'))

                thread1.start()
                thread2.start()
                thread3.start()
                thread1.join()
                thread2.join()
                thread3.join()

            if app.astar_path: 
                for i in range(len(app.astar_path) - 1):

                    draw.line([(app.astar_path[i][0], app.astar_path[i][1]), (app.astar_path[i+1][0], app.astar_path[i+1][1])], fill='blue', width=2)

            heading_eva1, heading_eva2 = abs(heading_eva1), abs(heading_eva2)

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
                elif name in ["UIA", "GeoA", "GeoB", "GeoC", "GeoD", "GeoE", "GeoF", "Comm Tower", "RovGeoG"]: 
                    radius = 3
                    draw.ellipse([(x - radius, y - radius), (x + radius, y + radius)], fill='slateblue', outline="black", width=1)
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