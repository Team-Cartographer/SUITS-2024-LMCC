from flask import Blueprint, jsonify, request
from flask_cors import CORS

api = Blueprint('api', __name__)
CORS(api)

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
        


    
@api.route('/v0', methods=["GET", "POST", "PUT"])
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
            # TODO: the majority of our api-v0 functions will be in here
            pass
        case "PUT":
            # TODO: there will be a good amount of idempotent functions in here
            pass
        case _: 
            pass



def handle_GET_args(args: dict): 
    arg_keys = args.keys()
    if ('test' in arg_keys) and (args['test'] == 't1'):
        return jsonify({
            'recieved': 'arg t1'
        })
    elif ('test' in arg_keys) and (args['test'] == 't2'):
        return jsonify({
            'recieved': 'arg t2'
        })
    else: 
        return jsonify({
            'error': 'args were invalid'
        })
    


#TODO: handle POST args
def handle_POST_args(**kwargs):
    pass



#TODO: handle PUT args
def handle_PUT_args(**kwargs):
    pass
