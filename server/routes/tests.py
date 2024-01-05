from flask import Blueprint, jsonify

tests = Blueprint('tests', __name__)

@tests.route('/test_hello', methods=["GET"])
def test_server():
    return jsonify({
        "message": "Hello from Flask"
    })