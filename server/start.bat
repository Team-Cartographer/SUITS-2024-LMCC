REM: for windows users, start by double-clicking this batch file

@echo off
cd /d %~dp0
python -m venv venv

REM: if this command doesn't work, then please activate it manually
source venv/bin/Activate.ps1
pip install flask flask-cors

python server.py
