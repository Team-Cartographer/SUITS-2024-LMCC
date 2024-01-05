from flask import Flask, jsonify
from flask_cors import CORS

# server app instance
app = Flask(__name__)
CORS(app) # allows inter-process communications

@app.route("/api/home", methods=["GET"])
def return_home():
    return jsonify({
        "message": "Hello World from Flask"
    })

if __name__ == "__main__": 
    app.run(debug=True, port=8080)