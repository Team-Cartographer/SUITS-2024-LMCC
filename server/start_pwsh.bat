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
REM DEV: Please add all dependencies to this list
pip install flask
pip install flask-cors
pip install requests

python .\config\startup.py

Start-Sleep -Seconds 2

REM Execute the server script
python server.py

REM Deactivate the virtual environment
deactivate
