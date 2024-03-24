from flask import jsonify
import google.generativeai as genai 
from dotenv import load_dotenv
from os import getenv
from json import load, dump 
from pathlib import Path 

CONFIG_PATH = Path(__file__).parent / 'chat.json'

load_dotenv() 
genai.configure(api_key=getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-pro')

with open(CONFIG_PATH, 'r') as jf: 
    data = load(jf)
    history = data["history"]

chat = model.start_chat(history=history)



def add_to_history(message, response):
    history.append({
            "role": "user",
            "parts": [message]
        })
    history.append(
        {
            "role": "model",
            "parts": [response.text]
        })
    with open(CONFIG_PATH, 'w') as jf: 
        data["history"] = history
        dump(data, jf, indent=4)



def send_message(message): 
    try: 
        response = chat.send_message(message)
        add_to_history(message, response)
    except Exception:
        add_to_history(message, "An error occurred while processing your request, try again.")

    return jsonify({
            "history": history
        })



if __name__ == "__main__": 
    response = chat.send_message('Hello, how are you?')
    print(response.text)
    print(chat.history)


