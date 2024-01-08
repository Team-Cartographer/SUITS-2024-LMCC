
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

# CLEANUP ON SCRIPT END FUNCTION
# function Cleanup {
#     Write-Host "stopping processes..."

#     Stop-Job -Job $serverJob
#     Remove-Job -Job $serverJob
#     Write-Host "server stopped."

#     Stop-Job -Job $clientJob
#     Remove-Job -Job $clientJob
#     Write-Host "client stopped."

#     Set-Location server
#     deactivate
#     Set-Location ..

#     Write-Host "`ncleanup complete!`n"
# }

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

function Cleanup {
    param (
        [System.Diagnostics.Process]$clientProcess,
        [System.Diagnostics.Process]$serverProcess
    )
    
    Write-Host "Running cleanup operations..."

    if ($clientProcess -and !$clientProcess.HasExited) {
        Write-Host "Stopping client process..."
        Stop-Process -Id $clientProcess.Id -Force
    }

    if ($serverProcess -and !$serverProcess.HasExited) {
        Write-Host "Stopping server process..."
        Stop-Process -Id $serverProcess.Id -Force
    }

    Set-Location server
    deactivate
    Set-Location ..
}

try {
    # Start the server process
    Set-Location server
    $serverProcess = Start-Process -FilePath "python" -ArgumentList "server.py" -PassThru
    Write-Host "Server process started with ID: $($serverProcess.Id)"
    Set-Location ..
    Set-Location client

    # Start the client process
    $clientProcess = Start-Process -FilePath "npm" -ArgumentList "run dev" -PassThru
    Write-Host "Client process started with ID: $($clientProcess.Id)"
    Set-Location ..

}
catch {
    Write-Host "An error occurred: $_"
    Cleanup -clientProcess $clientProcess -serverProcess $serverProcess
    exit
}
finally {
    Cleanup -clientProcess $clientProcess -serverProcess $serverProcess
}


Wait-Process -Id $serverProcess.Id
Wait-Process -Id $clientProcess.Id


Write-Host "`ngoodbye, world."
