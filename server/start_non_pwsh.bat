@echo off

REM Define dependencies
set DEPENDENCIES=flask flask-cors requests

REM Create and activate virtual environment
python -m venv venv
call venv\Scripts\activate.bat

REM Install dependencies
FOR %%P IN (%DEPENDENCIES%) DO pip install %%P

REM Run startup configuration
echo Running startup config
python .\config\startup.py

REM Wait for 1.25 seconds
ping 127.0.0.1 -n 2 > nul

REM Check if config file exists and start the server
set FILE_PATH=.\config\tss_data.json
if exist "%FILE_PATH%" (
    echo Found config/tss_data.json. Starting Server!
    python .\server.py
) else (
    echo config/tss_data.json does not exist. Server will not run.
    exit /b 1
)

REM Deactivate virtual environment
call venv\Scripts\deactivate.bat
