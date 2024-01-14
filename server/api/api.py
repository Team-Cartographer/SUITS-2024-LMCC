from flask import Blueprint, jsonify, request
from flask_cors import CORS
from . import GET_helpers as gh
from . import POST_helpers as ph

api = Blueprint('api', __name__)
CORS(api)

class LMCCAPIError(Exception):
    def __init__(self, msg='There was an error with the LMCC API'):
        super().__init__(message=msg)


def get_arg(key, args_dict):
    if key in args_dict.keys():
        return args_dict.get(key)
    else:
        raise LMCCAPIError('Improper Args were Provided')


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
                    'message': 'coming soon!'
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
    if get_arg('test', args) == 't1':
        return jsonify({
            'recieved': 'arg t1'
        })
    elif get_arg('test', args) == 't2':
        return jsonify({
            'recieved': 'arg t2'
        })
    else: 
        return jsonify({
            'error': 'args were invalid'
        })
    


def handle_POST_args(args: dict):
    if get_arg('test', args) == 'true':
        return jsonify({
            'woah': 'you found me' 
        })
    else:
        return jsonify({
            'error': 'args were invalid'
        })

