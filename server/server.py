# FLASK IMPORTS 
from flask import Flask, render_template
from flask_cors import CORS

# ROUTING IMPORTS
from routes.tss import tss
from routes.tests import tests
import sys

set_local = False
if len(sys.argv) > 1:
    set_local = (sys.argv[1] == "--local")

# server app instance
app = Flask(__name__)

# allows inter-process communications 
# (do this for all Blueprint Pages)
CORS(app) 
CORS(tss)
CORS(tests)

# register server subdirs
app.register_blueprint(tss, url_prefix="/tss")
app.register_blueprint(tests, url_prefix="/tests")

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
    if set_local: 
        app.run(debug=True, port=3001)
    else: 
        app.run(debug=True, host='0.0.0.0', port=3001)