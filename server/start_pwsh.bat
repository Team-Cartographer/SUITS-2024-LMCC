# Ensure any errors stop the script
$ErrorActionPreference = "Stop"

# Change directory to the location of the script
cd $PSScriptRoot

# Create a Python virtual environment
python -m venv venv

# Activate the virtual environment
. .\venv\Scripts\Activate.ps1

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install flask
pip install flask-cors
pip install requests

# Execute the server script
python server.py

# Deactivate the virtual environment
deactivate
