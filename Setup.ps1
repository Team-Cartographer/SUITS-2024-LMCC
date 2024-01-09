
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

Write-Host "`nchecking platform dependencies"
Check-Program "node"
Check-Program "npm"
Check-Program "git"
Check-Program "python3"
Write-Host "all dependencies are installed!`n"

Write-Host "`ports ready, starting config now`n"

$FILE_PATH = "./config/tss_data.json"

Set-Location server

python3 -m venv venv > $null

. .\venv\Scripts\Activate.ps1 > $null

pip install --upgrade pip > $null

Set-Location config 

pip install -r requirements.txt

Set-Location ..

Write-Host "`nrunning server startup config"

python config/startup.py

Write-Host "`nlmcc server setup complete`n"

Write-Host "setting up lmcc client"

Set-Location ..

Set-Location client 

npm install -g typescript > $null 2>&1
npm install > $null 2>&1

Write-Host "`nlmcc client setup complete`n"

Write-Host "`nlmcc application setup complete"
Write-Host "`ngoodbye, world."