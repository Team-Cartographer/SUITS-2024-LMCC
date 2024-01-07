REM Set Execution Policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

REM Define dependencies
$DEPENDENCIES = @("flask", "flask-cors", "requests")

REM Create and activate virtual environment
python -m venv venv
venv\Scripts\Activate.ps1

REM Install dependencies
foreach ($package in $DEPENDENCIES) {
    pip install $package
}

REM Run startup configuration
Write-Host "Running startup config"
python .\config\startup.py

REM Wait for 1.25 seconds
Start-Sleep -Seconds 1.25

REM Check if config file exists and start the server
$FILE_PATH = ".\config\tss_data.json"
if (Test-Path $FILE_PATH) {
    Write-Host "Found config/tss_data.json. Starting Server!"
    # Add your script's logic here
    python .\server.py
} else {
    Write-Host "config/tss_data.json does not exist. Server will not run."
    exit 1
}

REM Deactivate virtual environment
venv\Scripts\Deactivate.ps1