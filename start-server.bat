@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
    echo Node.js was not found. Install Node.js, then run this file again.
    echo.
    pause
    exit /b 1
)

set "HOST=0.0.0.0"
if not defined PORT set "PORT=4173"

echo Starting the DLCE Wiki preview server...
node scripts\dev-server.mjs
set "EXIT_CODE=%ERRORLEVEL%"

echo.
echo The preview server stopped with exit code %EXIT_CODE%.
pause
exit /b %EXIT_CODE%
