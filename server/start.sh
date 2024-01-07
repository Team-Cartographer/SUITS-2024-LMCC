# for mac users, please begin by running the command 
# "chmod +x start.sh"
# then, you can run 
# "./start.sh" 
# to begin the Python server

FILE_PATH="./config/tss_data.json"

# DEV: please add dependencies to this array and save the script
DEPENDENCIES=("flask" "flask-cors" "requests")

python3 -m venv venv 

source venv/bin/activate 

pip install --upgrade pip

for package in "${DEPENDENCIES[@]}"; do
    pip install $package
done

echo "running startup config"

python config/startup.py

sleep 1.25

if [ -f "$FILE_PATH" ]; then
    echo "found config/tss_data.json. checking tss server status."
    # Add your script's logic here
else
    echo "config/tss_data.json does not exist. server will not run."
    exit 1
fi

python config/check_tss.py
exit_code=$?
if [ $exit_code -ne 0 ]; then
    echo "tss server could not be pinged. deactivating server"
    exit 1
fi
echo "tss server found. starting LMCC server"

python server.py

deactivate