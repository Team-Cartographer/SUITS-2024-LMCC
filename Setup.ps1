
# GET IP
$networkAdapters = Get-NetAdapter -Physical | Where-Object { $_.Status -eq "Up" } | Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "127.0.0.*" }
$mainAdapter = $networkAdapters | Where-Object { $_.InterfaceIndex -eq (Get-NetRoute -DestinationPrefix "0.0.0.0/0" | Sort-Object -Property RouteMetric | Select-Object -First 1).InterfaceIndex }

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
Write-Host "running on ip: $($mainAdapter.IPAddress)"

Write-Host "`nchecking platform dependencies"
Check-Program "node"
Check-Program "npm"
Check-Program "git"
Check-Program "python"
Write-Host "all dependencies are installed!`n"

Write-Host "`ports ready, starting config now`n"

$FILE_PATH = "./config/tss_data.json"

Set-Location server

python -m venv venv > $null

. .\venv\Scripts\Activate.ps1 > $null

python.exe -m pip install --upgrade pip > $null

Set-Location config 

pip install -r requirements.txt

Set-Location ..

Write-Host "`nrunning server startup config"

python config/startup.py
$exitCode = $LASTEXITCODE

deactivate

Set-Location ..

if ($exitCode -eq 1) {
    Write-Host "setup complete. open the external urls"
    Write-Host "`ngoodbye, world."
    exit 1
} elseif ($exitCode -eq 2) {
    Write-Host "please run the tss server and try again"
    Write-Host "`ngoodbye, world."
    exit 1
}

Write-Host "`nlmcc server setup complete`n"

Write-Host "setting up lmcc client"

Set-Location client 

npm install -g typescript > $null 2>&1
npm install > $null 2>&1

Set-Location ..

Write-Host "`nlmcc client setup complete"

Write-Host "`nlmcc application setup complete"

Write-Host "`nclient will run on http://$($mainAdapter.IPAddress):3000`nserver will be run on http://$($mainAdapter.IPAddress):3001`nshare these urls for testing on the same network"

Write-Host "`ngoodbye, world."