# FLASK IMPORTS 
from flask import Flask, render_template
from flask_cors import CORS

# ROUTING IMPORTS
from routes.tss import tss
from routes.tests import tests
from routes.mission import mission

# server app instance
app = Flask(__name__)

# allows inter-process communications 
# (do this for all Blueprint Pages)
CORS(app) 
CORS(tss)
CORS(tests)
CORS(mission)


# register server subdirs
app.register_blueprint(tss, url_prefix="/tss")
app.register_blueprint(tests, url_prefix="/tests")
app.register_blueprint(mission, url_prefix='/mission')

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
    app.run(debug=True, host='0.0.0.0', port=3001)