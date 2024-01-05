# for mac users, please begin by running the command 
# "chmod +x start.sh"
# then, you can run 
# "./start.sh" 
# to begin the Python server

python3 -m venv venv 

pip3 install flask flask-cors

source venv/bin/activate && python3 server.py