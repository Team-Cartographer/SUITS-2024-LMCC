from flask import Blueprint, jsonify
from flask_cors import CORS

# this is for memory optimization. edit as necessary.
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

