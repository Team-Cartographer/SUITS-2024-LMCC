# LEAVE THIS FILE FOR "POST" TESTING
# FIXME: DELETE BEFORE MAKING PULL REQUEST

import requests
from PIL import Image
from io import BytesIO

url = 'http://localhost:3001/api/v0'
data = {'map': 'add', 'pins': ["500x800"]}

response = requests.post(url, json=data)
img = Image.open(BytesIO(response.content))
img.show()