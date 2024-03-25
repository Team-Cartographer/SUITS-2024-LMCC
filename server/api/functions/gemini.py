from flask import jsonify
import google.generativeai as genai 
from dotenv import load_dotenv
from os import getenv
from json import load, dump 
from pathlib import Path

DATA_PATH = Path(__file__).parent.parent.parent / 'data'
CHAT_PATH = DATA_PATH / 'chat.json'
TODO_PATH = DATA_PATH / 'todo.json'
WARNING_PATH = DATA_PATH / 'warning.json'

load_dotenv() 
genai.configure(api_key=getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-pro')

with open(CHAT_PATH, 'r') as jf: 
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
            "parts": [response]
        })
    with open(CHAT_PATH, 'w') as jf: 
        data["history"] = history
        dump(data, jf, indent=4)



def send_message(message) -> tuple[list[dict], str]: 
    with open(TODO_PATH) as todo, open(WARNING_PATH) as warning: 
        todoItems = load(todo)["todoItems"]
        warningMessage = load(warning)["infoWarning"]

    try: 
        message_to_send = f"{message}\n*TODO*:\n{todoItems}\n*WARNING*:\n{warningMessage}"
        response = chat.send_message(message_to_send)

        try: 
            todo_idx = response.text.index("*TODO ITEM*")
            todo_item = response.text[todo_idx+12:]
            new_text = response.text[:todo_idx]
        except ValueError: 
            todo_item = ''
            new_text = response.text

        add_to_history(message, new_text)
    except Exception:
        add_to_history(message, "An error occurred while processing your request, try again.")
        todo_item = ''

    return history, todo_item



if __name__ == "__main__": 
    response = chat.send_message('Hello, how are you?')
    print(response.text)
    print(chat.history)


