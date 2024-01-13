# LEAVE THIS FILE FOR "POST" TESTING
# FIXME: DELETE BEFORE MAKING PULL REQUEST

import requests

url = 'http://localhost:3001/api/test_greeting'
data = {'greeting': 'hey there'}
headers = {'Content-Type': 'application/json', 'Accept':'application/json'}

response = requests.post(url, json=data, headers=headers)
print(response.text)