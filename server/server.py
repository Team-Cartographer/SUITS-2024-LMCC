"""
A Flask web server application for handling various routes and APIs.

This module sets up a Flask application with Cross-Origin Resource Sharing (CORS) enabled. 
It imports and registers multiple Blueprints for different routes, each handling specific 
functionalities:

- 'tss': Routes for accessing Traffic Signalling System (TSS) data.
- 'tests': Routes for basic testing of the server.
- 'mission': Routes for mission-related data.
- 'api': General API routes.

Additionally, the application is configured to serve a directory page at the root ('/') 
and a custom 404 error page.

Key Features:
- Flask application instance creation.
- CORS enabled for inter-process communication.
- Blueprint registration with specific URL prefixes.
- Default and error routing with HTML templates.
- Running the app on localhost at port 3001.

Logging for HTTP requests is configurable and can be disabled for cleaner output during development.

The application is intended to be run from the command line, where it listens on '0.0.0.0' at port 3001.
"""

# FLASK IMPORTS 
from flask import Flask, render_template
from flask_cors import CORS

# ROUTING IMPORTS
from routes.tss import tss
from routes.tests import tests
from routes.mission import mission
from api.api import api

# OTHER IMPORTS
import logging

# server app instance
app = Flask(__name__)
log = logging.getLogger('werkzeug')

# allows inter-process communications 
# (do this for all Blueprint Pages)
CORS(app) 
CORS(tss)
CORS(tests)
CORS(mission)
CORS(api)

# register server subdirs
app.register_blueprint(tss, url_prefix="/tss")
app.register_blueprint(tests, url_prefix="/tests")
app.register_blueprint(mission, url_prefix='/mission')
app.register_blueprint(api, url_prefix='/api')

# default routing 
@app.route('/')
def home():
    return render_template('directory.html')

# error routing
@app.errorhandler(404)
def page_not_found(_):
    return render_template('404.html'), 404


# run app at http://localhost:3001/
if __name__ == "__main__":
    # set to "False" and restart server to see all HTTP requests 
    log.disabled = False

    app.run(
        debug=False, 
        host='0.0.0.0', 
        port=3001
    )
