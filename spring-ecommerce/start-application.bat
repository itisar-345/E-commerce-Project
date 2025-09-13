@echo off
echo Starting E-Commerce Application...
echo.

echo Step 1: Starting Spring Boot Backend...
start "Spring Boot Backend" cmd /k "cd /d %~dp0 && mvn spring-boot:run"

echo Waiting for backend to start...
timeout /t 10 /nobreak > nul

echo Step 2: Starting React Frontend...
start "React Frontend" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo Both applications are starting...
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this script (applications will continue running)
pause > nul