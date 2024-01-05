REM Ensure any errors stop the script
$ErrorActionPreference = "Stop"

REM Change directory to the location of the script
cd $PSScriptRoot

REM Create a Python virtual environment
python -m venv venv

REM Activate the virtual environment
. .\venv\Scripts\Activate.ps1

REM Upgrade pip
pip install --upgrade pip

REM Install dependencies
pip install flask
pip install flask-cors
pip install requests

REM Execute the server script
python server.py

REM Deactivate the virtual environment
deactivate
