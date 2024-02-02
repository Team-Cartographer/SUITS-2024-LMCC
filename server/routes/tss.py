"""
Establishes a Flask Blueprint 'tss' for accessing data from a Traffic Signalling System (TSS).

This module creates a Flask Blueprint named 'tss', enabling Cross-Origin Resource Sharing (CORS). 
It reads TSS configuration from 'config/tss_data.json' and defines several routes to fetch different 
types of data from the TSS server:

Routes:
- '/info': Returns TSS configuration data.
- '/telemetry': Fetches and returns telemetry data for team 1 from 'TELEMETRY.json'.
- '/completed_telemetry': Fetches and returns completed telemetry data for team 1 from 'Completed_TELEMETRY.json'.
- '/eva_info': Fetches and returns EVA (Extravehicular Activity) information for team 1 from 'EVA.json'.
- '/completed_eva': Fetches and returns completed EVA data for team 1 from 'Completed_EVA.json'.
- '/rockdata': Fetches and returns rock data from 'RockData.json'.

Each route makes a GET request to the specified TSS server endpoint and returns the data in JSON format.

The module uses the 'requests' library for HTTP requests and Flask's Blueprint to define the routes.
"""

from flask import Blueprint
from flask_cors import CORS
from requests import get
from json import load, loads

with open("config/tss_data.json", "r") as f:
    tss_data = load(f)
    f.close()

tss = Blueprint('tss', __name__)
CORS(tss)

TSS_ROOT = tss_data["TSS_URL"]
TSS_HOST = tss_data["TSS_HOST"]
TSS_PORT = tss_data["TSS_PORT"]

@tss.route('/info', methods=["GET"])
def tss_info():
    return tss_data

@tss.route('/telemetry', methods=["GET"])
def telemetry():
    req = get(f"http://{TSS_HOST}:{TSS_PORT}/json_data/teams/1/TELEMETRY.json")
    return loads(req.text)

@tss.route('/completed_telemetry', methods=["GET"])
def comp_telemetry():
    req = get(f"http://{TSS_HOST}:{TSS_PORT}/json_data/teams/1/Completed_TELEMETRY.json")
    return loads(req.text)

@tss.route('/eva_info', methods=["GET"])
def eva_info():
    req = get(f"http://{TSS_HOST}:{TSS_PORT}/json_data/teams/1/EVA.json")
    return loads(req.text)

@tss.route('/completed_eva', methods=["GET"])
def comp_eva():
    req = get(f"http://{TSS_HOST}:{TSS_PORT}/json_data/teams/1/Completed_EVA.json")
    return loads(req.text)

@tss.route('/rockdata', methods=["GET"])
def rockdata():
    req = get(f"http://{TSS_HOST}:{TSS_PORT}/json_data/rocks/RockData.json")
    return loads(req.text)

