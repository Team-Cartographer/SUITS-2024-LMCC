#!/bin/bash

user_ip=$(ifconfig en0 | grep 'inet ' | awk '{print $2}')

# CHECK SCRIPT ARGUMENTS AND DEFINE THEM FOR LATER
open_provided=false
local_provided=false
for arg in "$@"
do
    if [ "$arg" == "--open" ]; then
        open_provided=true
    fi
    if [ "$arg" == "--local" ]; then
        local_provided=true
    fi
done

# CHECK SYSTEM PREREQUISITES FUNCTION
check_program() {
    if ! command -v $1 &> /dev/null
    then
        echo "$1 could not be found, please install it."
        exit 1
    fi
}

# BEGIN SCRIPT AND CHECK DEPENDENCIES 
echo "hello, world!"
echo -e "running on ip: $user_ip\n"

echo "checking platform dependencies"
check_program node
check_program npm
check_program git
check_program python3
echo -e "all dependencies are installed!\n"

# CHECK PORTS
echo "checking port 3000 and 3001"

# KILL OPEN PORTS FUNCTION
kill_port() {
    local port=$1
    local pid=$(lsof -t -i:$port)

    if [ ! -z "$pid" ]; then
        echo "ending process on port $port"
        kill $pid 
    else
        echo "port $port is clear and ready to start"
    fi
}

# CLEANUP ON SCRIPT END FUNCTION
cleanup() {
    echo "stopping processes..."
    kill $server $client
    kill_port 3000
    kill_port 3001
    cd server && deactivate && cd ..
    echo -e "cleanup complete!\n"
}

kill_port 3000
kill_port 3001

echo -e "ports ready, starting python config now\n"

FILE_PATH="./config/tss_data.json"

cd server

python3 -m venv venv >/dev/null

source venv/bin/activate >/dev/null

pip install --upgrade pip >/dev/null

cd config 

pip install -r requirements.txt >/dev/null

cd ..

echo "python config complete, running server startup config"

python config/startup.py

sleep 1.5

if [ -f "$FILE_PATH" ]; then
    echo -e "found config/tss_data.json.\nchecking tss server status."
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

echo "tss server found."

python config/build_config.py
echo "lmcc server setup complete"

cd ..
echo -e "\nsetting up lmcc client"

cd client 

npm install -g typescript >/dev/null 2>&1
npm install >/dev/null 2>&1

echo -e "lmcc client setup complete\n"

cd ..

cd server && python server.py $( [ "$local_provided" = true ] && echo "--local" ) && cd .. &
server=$!

cd client && npm run dev && cd .. &
client=$!

sleep 1 && echo -e "\nrunning ./client on: http://localhost:3000\nrunning ./server on: $( [ "$local_provided" = false ] && echo http://$user_ip:3001 ) $( [ "$local_provided" = true ] && echo http://localhost:3001 )" &
echo_run=$!

if [ "$open_provided" = true ]; then
    sleep 4 && python3 ./server/config/open_app.py &
    opener=$!
fi

trap 'cleanup' SIGINT

wait $server
wait $client
wait $opener
wait $echo_run

echo -e "\ngoodbye, world."