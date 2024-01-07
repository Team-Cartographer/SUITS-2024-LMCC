#!/bin/bash

echo "Hello, World!"

kill_port() {
    local port=$1
    local pid=$(lsof -t -i:$port)

    if [ ! -z "$pid" ]; then
        echo "ending process on port $port"
        kill $pid
    else
        echo "no process on port $port"
    fi
}

kill_port 3000
kill_port 3001

cleanup() {
    echo "stopping processes..."
    kill $process1_pid $process2_pid
    kill_port 3000
    kill_port 3001
    echo "cleanup complete!"
}

cd server && ./start.sh && cd .. &
server=$!

cd client && ./start.sh && cd .. &
client=$!

sleep 4 && python3 ./server/config/open_app.py &
opener=$!

trap 'cleanup' SIGINT

wait $server
wait $client
wait $opener

echo "Goodbye, World."