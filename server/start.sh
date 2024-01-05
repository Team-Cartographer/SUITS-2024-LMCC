# for mac users, please begin by running the command 
# "chmod +x start.sh"
# then, you can run 
# "./start.sh" 
# to begin the Python server

# DEV: please add dependencies to this array and save the script
DEPENDENCIES=("flask" "flask-cors" "requests")

python3 -m venv venv 

source venv/bin/activate 

for package in "${DEPENDENCIES[@]}"; do
    pip install $package
done

python server.py

deactivate