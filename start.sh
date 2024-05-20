#!/bin/bash

user_ip=$(ifconfig en0 | grep 'inet ' | awk '{print $2}')

ulimit -Sn 50000

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
    cd gateway && deactivate && cd ..
    echo -e "cleanup complete!\n"
}

kill_port 3000
kill_port 3001

echo -e "ports ready, starting python config now\n"

cd gateway

python3 -m venv .venv 

source .venv/bin/activate 

# pip install --upgrade pip 
# pip install -r requirements.txt 

cd ..

echo "gateway setup complete."

echo -e "\nsetting up lmcc client"

cd client 

# npm install -g typescript 
# npm install 

echo -e "lmcc client setup complete\n"

cd ..


cd gateway && python main.py && cd .. &
server=$!
cd client && npm run dev && cd .. &
client=$!
sleep 1.5 && echo -e "\nrunning client on http://$user_ip:3000\nrunning server on http://$user_ip:3001\n" &
echo_run=$!

trap 'cleanup' SIGINT

wait $server
wait $client
wait $echo_run

echo -e "\ngoodbye, world."
