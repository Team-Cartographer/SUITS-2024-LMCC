"""
This module has a sole purpose of opening the 3 pages (TSS, LMCC Server, LMCC Frontend) 
in the User's Default Web Browser. Nothing else. 
"""

import webbrowser
from pathlib import Path
from json import load

DATA_PATH = Path(__file__).parent / 'tss_data.json'

with open(DATA_PATH, "r") as json_file:
    data = load(json_file)

if __name__ == "__main__":
    webbrowser.open('http://localhost:3000')
    webbrowser.open('http://localhost:3001')
    webbrowser.open(data["TSS_URL"])