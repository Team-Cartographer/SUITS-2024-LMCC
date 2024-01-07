setlocal enabledelayedexpansion

REM Change directory to the location of the batch file
cd /d "%~dp0"

REM Create a Python virtual environment
python -m venv venv

REM Activate the virtual environment
CALL venv\Scripts\activate.bat

REM Upgrade pip
pip install --upgrade pip

REM Install dependencies
REM DEV: Please add all dependencies to this list
pip install flask
pip install flask-cors
pip install requests

python .\config\startup.py 

timeout /t 2s /nobreak

REM Execute the server script
python server.py

REM Deactivate the virtual environment
CALL venv\Scripts\deactivate.bat
