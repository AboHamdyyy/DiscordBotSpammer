@echo off
title Discord Bot Spammer
color 04

if not exist "index.js" (
    echo [X] Error: index.js not found !
    pause
    exit
)

if not exist "node_modules" (
    echo Installing modules, please wait...
    call npm install >nul 2>&1
    if errorlevel 1 (
        echo [X] Error: Failed to install modules. Make sure Node.js is installed!
        pause
        exit
    )
)

node index.js

pause