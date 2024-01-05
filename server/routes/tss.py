from flask import Blueprint, jsonify

# this is for memory optimization. edit as necessary.
from requests import get
from json import loads
import os

tss = Blueprint('tss', __name__)

TSS_ROOT = 'http://192.168.64.3:14141/'
TSS_HOST = '192.168.64.3'
TSS_PORT = 14141

@tss.route('/tss_info', methods=["GET"])
def tss_info():
    return jsonify({
        "host": TSS_HOST,
        "port": TSS_PORT,
        "url_root": f'http://{TSS_HOST}:{TSS_PORT}/',
        "url_telemetry": f'http://{TSS_HOST}:{TSS_PORT}/telemetry.html',
    })

@tss.route('/telemetry', methods=["GET"])
def telemetry():
    req = get(f"http://{TSS_HOST}:{TSS_PORT}/json_data/teams/1/TELEMETRY.json")
    return loads(req.text)
