"""
Sets up a Flask Blueprint for a test route in a web application.

This module creates a Flask Blueprint named 'tests' with Cross-Origin Resource Sharing (CORS) enabled. 
It defines a single test route:

- '/hello': A GET route that returns a JSON response with a greeting message.

The '/hello' route is a simple test endpoint to verify that the Flask application and the 'tests' 
Blueprint are working correctly. It returns a JSON response containing a friendly message.

The module leverages Flask's Blueprint to organize the route and uses the jsonify function to 
return JSON responses.
"""

from flask import Blueprint, jsonify
from flask_cors import CORS

tests = Blueprint('tests', __name__)
CORS(tests)

@tests.route('/hello', methods=["GET"])
def test_hello():
    return jsonify({
        "message": "Hello from Flask"
    })