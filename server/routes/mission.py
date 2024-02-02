"""
Defines a Flask Blueprint for handling mission-related routes in a web application.

This module sets up routes for accessing various JSON data from a Traffic Signalling System (TSS). 
It reads the TSS configuration from 'config/tss_data.json' and initializes the Blueprint 'mission' 
with Cross-Origin Resource Sharing (CORS) enabled. Each route fetches specific JSON data from the 
TSS server using the GET method and returns it.

Routes:
- '/comm': Fetches and returns communication data from 'COMM.json'.
- '/dcu': Fetches and returns data control unit information from 'DCU.json'.
- '/error': Fetches and returns error information from 'ERROR.json'.
- '/imu': Fetches and returns inertial measurement unit data from 'IMU.json'.
- '/rover': Fetches and returns rover-related data from 'ROVER.json'.
- '/spec': Fetches and returns specification data from 'SPEC.json'.
- '/uia': Fetches and returns user interface activity data from 'UIA.json'.

The module relies on Flask's Blueprint to define these routes and the 'requests' library to make 
HTTP GET requests to the TSS server.
"""

from flask import Blueprint
from flask_cors import CORS
from requests import get
from json import load, loads

with open("config/tss_data.json", "r") as f:
    tss_data = load(f)
    f.close()

mission = Blueprint('mission', __name__)
CORS(mission)

TSS_ROOT = tss_data["TSS_URL"]
TSS_HOST = tss_data["TSS_HOST"]
TSS_PORT = tss_data["TSS_PORT"]

@mission.route('/comm', methods=["GET"])
def comm():
    req = get(f"http://{TSS_HOST}:{TSS_PORT}/json_data/COMM.json")
    return loads(req.text)

@mission.route('/dcu', methods=["GET"])
def dcu():
    req = get(f"http://{TSS_HOST}:{TSS_PORT}/json_data/DCU.json")
    return loads(req.text)

@mission.route('/error', methods=["GET"])
def error_route():
    req = get(f"http://{TSS_HOST}:{TSS_PORT}/json_data/ERROR.json")
    return loads(req.text)

@mission.route('/imu', methods=["GET"])
def imu():
    req = get(f"http://{TSS_HOST}:{TSS_PORT}/json_data/IMU.json")
    return loads(req.text)

@mission.route('/rover', methods=["GET"])
def rover():
    req = get(f"http://{TSS_HOST}:{TSS_PORT}/json_data/ROVER.json")
    return loads(req.text)

@mission.route('/spec', methods=["GET"])
def spec():
    req = get(f"http://{TSS_HOST}:{TSS_PORT}/json_data/SPEC.json")
    return loads(req.text)

@mission.route('/uia', methods=["GET"])
def uia():
    req = get(f"http://{TSS_HOST}:{TSS_PORT}/json_data/UIA.json")
    return loads(req.text)

