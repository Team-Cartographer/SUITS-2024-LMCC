
REM CHECK SCRIPT ARGUMENTS AND DEFINE THEM FOR LATER
set open_provided=false
:arg_loop
if "%1"=="" goto end_arg_loop
if "%1"=="--open" set open_provided=true & goto end_arg_loop
shift
goto arg_loop
:end_arg_loop

REM CHECK SYSTEM PREREQUISITES FUNCTION
:check_program
where %1 >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo %1 could not be found, please install it.
    exit /b 1
)
goto :eof

REM BEGIN SCRIPT AND CHECK DEPENDENCIES 
echo hello, world!
echo.

echo checking platform dependencies
call :check_program node
call :check_program npm
call :check_program git
call :check_program python

echo all dependencies are installed!
echo.

REM CHECK PORTS
echo checking port 3000 and 3001

REM KILL OPEN PORTS FUNCTION
:kill_port
for /f "tokens=5" %%i in ('netstat -aon ^| findstr :%1') do (
    echo ending process on port %1
    taskkill /F /PID %%i
)
goto :eof

call :kill_port 3000
call :kill_port 3001

echo ports ready, starting config now
echo.

set FILE_PATH=./config/tss_data.json

cd server

python -m venv venv
call venv\Scripts\activate.bat

pip install --upgrade pip

cd config 

pip install -r requirements.txt 

cd ..

echo running server startup config

python config/startup.py

timeout /t 2 /nobreak >nul

if exist "%FILE_PATH%" (
    echo found config/tss_data.json.
    echo checking tss server status.
) else (
    echo config/tss_data.json does not exist. server will not run.
    exit /b 1
)

python config/check_tss.py
set exit_code=%ERRORLEVEL%

if %exit_code% NEQ 0 (
    echo tss server could not be pinged. deactivating server
    exit /b 1
)
echo tss server found. lmcc server setup complete
echo.

echo setting up lmcc client

cd ..

cd client 

npm install -g typescript
npm install

echo lmcc client setup complete
echo.

cd ..

cd server
start /b python server.py
set server_pid=%!

cd ../client
start /b npm run dev
set client_pid=%!

timeout /t 2 /nobreak >nul
echo running ./client on: http://localhost:3000
echo running ./server on: http://localhost:3001
echo.

if "%open_provided%"=="true" (
    timeout /t 5 /nobreak >nul
    start python3 ./server/config/open_app.py
    set opener_pid=%!
)

:wait_loop
tasklist /fi "PID eq %server_pid%" |find ":" > nul
if errorlevel 1 (
    tasklist /fi "PID eq %client_pid%" |find ":" > nul
    if errorlevel 1 (
        goto :cleanup
    )
)
timeout /t 1 /nobreak >nul
goto wait_loop

:cleanup
echo stopping processes...
taskkill /F /PID %server_pid%
taskkill /F /PID %client_pid%
call :kill_port 3000
call :kill_port 3001
cd server && call venv\Scripts\deactivate.bat && cd ..
echo cleanup complete!
echo.

echo goodbye, world.

exit /b
