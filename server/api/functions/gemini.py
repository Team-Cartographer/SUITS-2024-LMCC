import google.generativeai as genai 
from dotenv import load_dotenv
from os import getenv
from json import load 
from pathlib import Path 

CONFIG_PATH = Path(__file__).parent / 'gem_config.json'

load_dotenv() 
genai.configure(api_key=getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-pro')

with open(CONFIG_PATH, 'r') as jf: 
    data = load(jf)
    history = data["history"][0]

chat = model.start_chat(history=history)

response = chat.send_message('Hello, how are you?')

print(response.text)
print(chat.history)


