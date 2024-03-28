from flask import Blueprint, jsonify, request
from flask_cors import CORS
from . import getters as gh
from . import posters as ph
from pathlib import Path 

api = Blueprint('api', __name__)
CORS(api)

class LMCCAPIError(Exception):
    """
    Raises an error for the LMCC API if something goes wrong that isn't intrinsic to Python3.12+
    """
    def __init__(self, msg='There was an error with the LMCC API'):
        super().__init__(msg)





def get_arg(key: str, args_dict: dict) -> bool:
    """
    Returns the value of `args_dict[key]` if found, else returns `False`
    """
    if key in args_dict.keys():
        return args_dict.get(key)
    else:
        return False





@api.route('/test_greeting', methods=["GET", "POST"])
def test():
    """
    Endpoint for testing greetings via GET and POST methods.

    GET: Returns a message advising to use POST.
    POST: Checks if the POST request contains 'greeting' key with value 'hey there', 
    and returns an appropriate response.

    Returns:
    - JSON response indicating whether the request was accepted or rejected.
    """
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
        


@api.route('/hololens/photo', methods=["GET"])
def take_hololens_photo():
    status = gh.take_holo_pic()
    return jsonify({
        'status': status
    })

    

@api.route('/v0', methods=["GET", "POST"])
def api_v0():
    """
    Handles API requests for the '/v0' endpoint with GET or POST methods.

    - GET: Returns a default message and documentation link if no arguments are passed, 
      otherwise forwards arguments to 'handle_GET_args' function.
    - POST: Raises an error if the request contains no JSON data, otherwise forwards 
      the JSON data to 'handle_POST_args' function.

    Returns:
    - For GET: A JSON response with a message and documentation link, or the output of 'handle_GET_args'.
    - For POST: The output of 'handle_POST_args' or raises an LMCCAPIError.
    """
    match request.method: 
        case "GET":
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





def handle_GET_args(args: dict) -> dict:
    """
    Processes GET request arguments for specific functionalities.

    Based on the value of the 'get' key in the 'args' dictionary, it calls different functions:
    - 'map_img': Returns a map image.
    - 'map_info': Returns map information.
    - 'astar': Executes the A* algorithm.
    - 'biodata': Returns biological data based on 'eva' key value ('one' or 'two').
    If 'eva' value is invalid or if 'get' key is not recognized, returns an error message.

    Parameters:
    - args (dict): Dictionary of arguments from the GET request.

    Returns:
    - A response depending on the argument values, either data or an error message in JSON format.
    """
    # Check the value of the 'get' key in the 'args' dictionary
    if get_arg('get', args) == 'map_img':
        return gh.send_map()            # Return a map image
    elif get_arg('get', args) == 'map_info':
        return gh.send_map_info()       # Return map information
    elif get_arg('get', args) == 'astar':
        return gh.a_star()              # Execute the A* algorithm
    elif get_arg('get', args) == 'warning':
        return gh.send_notification('WARNING')   # Return notification data
    elif get_arg('get', args) == 'todo':
        return gh.send_notification('TODO')
    elif get_arg('get', args) == 'rover_url':
        return gh.send_rover_url()
    elif get_arg('get', args) == "biodata":
        eva = get_arg('eva', args)
        if eva == "one" or eva == "two":    # Return biological data based on 'eva' key value ('1' or '2')
            return gh.send_biom_data(eva)   
        else: 
            return jsonify({'error': 'invalid eva'})
    elif get_arg('get', args) == 'chat': 
        return gh.send_chat()
    else:   # If 'get' key is not recognized, return an error message
        return jsonify({
            'error': 'args were invalid'
        })
    




def handle_POST_args(args: dict):
    """
    Processes POST request arguments for map updates.

    Depending on the value associated with the 'map' key in 'args', it performs different actions:
    - 'add': Calls function to add data to the geojson map.
    - 'rm': Calls function to remove data from the geojson map.
    If the 'map' key is not recognized or absent, returns an error message.

    Parameters:
    - args (dict): Dictionary of arguments from the POST request.

    Returns:
    - A response depending on the argument values, either performing an update or returning an error message in JSON format.
    """
    # Check the value associated with the 'map' key in 'args'
    if get_arg('map', args) == 'add':
        return ph.update_geojson(args)              # Call function to add data to the geojson map
    elif get_arg('map', args) == 'rm':
        return ph.update_geojson(args, add=False)   # Call function to remove data from the geojson map
    elif get_arg('notif', args) == 'update_warning':
        return ph.update_notification(args, 'WARNING')
    elif get_arg('notif', args) == 'update_todo': 
        return ph.update_notification(args, 'TODO')     
    elif get_arg('chat', args) == 'update': 
        return ph.update_chat(args)    
    else:
        return jsonify({
            'error': 'args were invalid'            # Return an error message for invalid arguments
        })
