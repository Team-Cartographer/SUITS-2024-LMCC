from flask import Blueprint, jsonify, request
from flask_cors import CORS
from . import GET_helpers as gh
from . import POST_helpers as ph

api = Blueprint('api', __name__)
CORS(api)

class LMCCAPIError(Exception):
    def __init__(self, msg='There was an error with the LMCC API'):
        super().__init__(msg)


def get_arg(key, args_dict: dict):
    if key in args_dict.keys():
        return args_dict.get(key)
    else:
        return False


@api.route('/test_greeting', methods=["GET", "POST"])
def test():
    '''
    routed to localhost:3000/api/test_greeting, this function checks
    "Content-Type: application/json" headers and a request with a json
    data of "{ 'greeting': 'hey there' }"
    '''
    if request.method == 'GET':
        return jsonify({
            'message': 'please access this page through a HTTP POST request'
        })
    else:
        req = dict(request.get_json())
        if "greeting" in req.keys() and req["greeting"] == 'hey there':
            return jsonify({
                'response': 'request accepted'
            })
        else: 
            return jsonify({
                'rejected': 'request rejected'
            })
        


    
@api.route('/v0', methods=["GET", "POST"])
def api_v0():
    match request.method: 
        case "GET":
            # TODO: functions that are predefined and need API endpoints go here
            args = request.args.to_dict()
            if len(args) == 0: 
                return jsonify({
                    'message': 'nothing to see here!',
                    'docs': 'docs can be found at: https://tclmcc.gitbook.io/docs/'
                })
            else: 
                return handle_GET_args(args)
        case "POST":
            req_json = dict(request.get_json())
            if len(req_json) == 0: 
                raise LMCCAPIError('A POST Request was ran without a JSON of Arguments')
            else:
                return handle_POST_args(req_json)
        case _: 
            pass



def handle_GET_args(args: dict): 
    if get_arg('get', args) == 'map_img':
        return gh.send_map()
    elif get_arg('get', args) == 'map_info':
        return gh.send_map_info()
    elif get_arg('get', args) == 'astar':
        return gh.a_star()
    else: 
        return jsonify({
            'error': 'args were invalid'
        })
    


def handle_POST_args(args: dict):
    if get_arg('map', args) == 'add':
        return ph.update_geojson(args)
    elif get_arg('map', args) == 'rm':
        return ph.update_geojson(args, add=False)
    else:
        return jsonify({
            'error': 'args were invalid'
        })

