from flask import Blueprint, jsonify
from flask_cors import CORS

tests = Blueprint('tests', __name__)
CORS(tests)

@tests.route('/hello', methods=["GET"])
def test_hello():
    return jsonify({
        "message": "Hello from Flask"
    })