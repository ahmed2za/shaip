@echo off
:: Check for admin privileges
NET SESSION >nul 2>&1
if %errorLevel% == 0 (
    goto :run
) else (
    echo Running with administrator privileges...
    powershell -Command "Start-Process '%~dpnx0' -Verb RunAs"
    exit /b
)

:run
powershell -ExecutionPolicy Bypass -File "%~dp0manage-server.ps1"
pause
