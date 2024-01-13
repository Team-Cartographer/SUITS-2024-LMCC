from flask import Blueprint, jsonify, request
from flask_cors import CORS

api = Blueprint('api', __name__)
CORS(api)

@api.route('/test', methods=["GET", "POST"])
def test():
    req = request.get_json()
    print(req.keys())

    if req["test"] == 'hey there':
        return jsonify({
            'greeting': 'request accepted'
        })
    else: 
        return jsonify({
            'rejected': 'request rejected'
        })