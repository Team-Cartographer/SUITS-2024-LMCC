import base64
import websocket 
import threading 
import time 
import json 

global lines
lines = []

def on_message(ws, message):
    global lines
    print(json.loads(message))
    lines.append(json.loads(message))

def on_error(ws, error):
    print(error)

def on_close(ws, close_status_code, close_msg):
    global lines 
    print("### closed ###")
    with open('output.json', 'w') as f:
        json.dump({
            'lines': lines
        }, f, indent=4)

def on_open(ws):
    def run(*args):
        time.sleep(1)
        print("sending 'getsrdata'")
        ws.send("getsrdata")
        time.sleep(1)
        ws.close()
        print("thread terminating...")
    threading.Thread(target=run).start()

def make_obj(): 
    import json
import numpy as np

def parse_json_to_obj(_data):
    for data in _data: 
        try:
            vertices = np.array(data['Surface']['Vertices'])
            normals = np.array(data['Surface']['Normals'])
            indices = np.array(data['Surface']['Indices'])
        except KeyError:
            continue

        obj_string = "# Exported from JSON\n"

        # Vertices
        for v in vertices:
            obj_string += f"v {v['x']} {v['y']} {v['z']}\n"

        # Normals
        for n in normals:
            obj_string += f"vn {n['x']} {n['y']} {n['z']}\n"

        # Faces (assuming triangle mesh)
        for i in range(0, len(indices), 3):
            # OBJ indices start from 1
            v1 = indices[i] + 1
            v2 = indices[i+1] + 1
            v3 = indices[i+2] + 1
            obj_string += f"f {v1}//{v1} {v2}//{v2} {v3}//{v3}\n"

    with open('test.obj', 'wb') as f: 
        f.write(obj_string.encode('utf-8'))

if __name__ == '__main__':
    websocket.enableTrace(True)
    username = 'abhi_mbp'
    password = 'password'
    basic_auth = base64.b64encode(f'{username}:{password}'.encode('utf-8')).decode('utf-8')
    headers = {"Authorization": f"Basic {basic_auth}"}
    ws = websocket.WebSocketApp("ws://192.168.4.62/ext/perception/client?clientmode=passive",
                                header = headers,
                                on_message = on_message,
                                on_error = on_error,
                                on_close = on_close)
    ws.on_open = on_open
    ws.run_forever()

    parse_json_to_obj(lines)
