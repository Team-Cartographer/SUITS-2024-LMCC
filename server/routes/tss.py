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

