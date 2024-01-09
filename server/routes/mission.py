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

