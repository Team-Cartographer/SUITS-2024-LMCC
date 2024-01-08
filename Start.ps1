# CHECK SCRIPT ARGUMENTS AND DEFINE THEM FOR LATER
$open_provided = $false
foreach ($arg in $args) {
    if ($arg -eq "--open") {
        $open_provided = $true
        break
    }
}

# CHECK SYSTEM PREREQUISITES FUNCTION
function Check-Program {
    param (
        [string]$program
    )
    if (-not (Get-Command $program -ErrorAction SilentlyContinue)) {
        Write-Host "$program could not be found, please install it."
        exit 1
    }
}

# BEGIN SCRIPT AND CHECK DEPENDENCIES 
Write-Host "hello, world!"
Write-Host "`n"

Write-Host "checking platform dependencies"
Check-Program "node"
Check-Program "npm"
Check-Program "git"
Check-Program "python3"
Write-Host "`nall dependencies are installed!`n"

# CHECK PORTS
Write-Host "checking port 3000 and 3001"

# KILL OPEN PORTS FUNCTION
function Kill-Port {
    param (
        [int]$port
    )
    $pid = (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue).OwningProcess
    if ($pid) {
        Write-Host "ending process on port $port"
        Stop-Process -Id $pid -Force
    }
    else {
        Write-Host "port $port is clear and ready to start"
    }
}

# CLEANUP ON SCRIPT END FUNCTION
function Cleanup {
    Write-Host "stopping processes..."
    Stop-Process -Id $server, $client -Force
    Kill-Port 3000
    Kill-Port 3001
    Set-Location server
    deactivate
    Set-Location ..
    Write-Host "`ncleanup complete!`n"
}

Kill-Port 3000
Kill-Port 3001

Write-Host "`nports ready, starting config now`n"

$FILE_PATH = "./config/tss_data.json"

Set-Location server

python3 -m venv venv > $null

. .\venv\Scripts\Activate.ps1 > $null

pip install --upgrade pip > $null

Set-Location config 

pip install -r requirements.txt

Set-Location ..

Write-Host "running server startup config"

python config/startup.py

Start-Sleep -Seconds 1.5

if (Test-Path $FILE_PATH) {
    Write-Host "`nfound config/tss_data.json.`nchecking tss server status."
}
else {
    Write-Host "config/tss_data.json does not exist. server will not run."
    exit 1
}

python config/check_tss.py
$exit_code = $LASTEXITCODE

if ($exit_code -ne 0) {
    Write-Host "tss server could not be pinged. deactivating server"
    exit 1
}
Write-Host "`ntss server found. lmcc server setup complete`n"

Write-Host "setting up lmcc client"

Set-Location ..

Set-Location client 

npm install -g typescript > $null 2>&1
npm install > $null 2>&1

Write-Host "`nlmcc client setup complete`n"

Set-Location ..

# Set location to server directory and start the server process as a background job
Set-Location server
$serverJob = Start-Job -ScriptBlock { python server.py }
Write-Host "server started."

# Return to the root directory and then move to the client directory
Set-Location ..
Set-Location client

# Start the client process as a background job
$clientJob = Start-Job -ScriptBlock { npm run dev }
Write-Host "client started."

Stop-Job -Job $serverJob
Remove-Job -Job $serverJob
Write-Host "server stopped."

Stop-Job -Job $clientJob
Remove-Job -Job $clientJob
Write-Host "client stopped."


if ($open_provided) {
    Start-Sleep -Seconds 4
    python3 ./server/config/open_app.py &
    $opener = $!
}

trap {
    Cleanup
    exit
}

Start-Sleep -Seconds 1
Write-Host "`nrunning ./client on: http://localhost:3000`nrunning ./server on: http://localhost:3001`n" 

Wait-Job -Job $serverJob
Wait-Job -Job $clientJob

Write-Host "`ngoodbye, world."
