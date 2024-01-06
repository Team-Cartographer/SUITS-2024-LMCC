# FLASK IMPORTS 
from flask import Flask, render_template
from flask_cors import CORS

# ROUTING IMPORTS
from routes.tss import tss
from routes.tests import tests

# OTHER IMPORTS
pass


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
    app.run(debug=True, port=3001)