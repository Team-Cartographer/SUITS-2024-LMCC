# Set Execution Policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Define dependencies
$DEPENDENCIES = @("flask", "flask-cors", "requests")

# Create and activate virtual environment
python -m venv venv
venv\Scripts\Activate.ps1

# Install dependencies
foreach ($package in $DEPENDENCIES) {
    pip install $package
}

# Run startup configuration
Write-Host "Running startup config"
python .\config\startup.py

# Wait for 1.25 seconds
Start-Sleep -Seconds 1.25

# Check if config file exists and start the server
$FILE_PATH = ".\config\tss_data.json"
if (Test-Path $FILE_PATH) {
    Write-Host "Found config/tss_data.json. Starting Server!"
    # Add your script's logic here
    python .\server.py
} else {
    Write-Host "config/tss_data.json does not exist. Server will not run."
    exit 1
}

# Deactivate virtual environment
venv\Scripts\Deactivate.ps1