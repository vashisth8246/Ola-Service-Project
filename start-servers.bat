@echo off
echo Starting Ola Service Tracking System...

echo Starting Backend Server on port 3002...
start "Backend Server" cmd /k "cd /d "d:\NUV ACD\All SEM\5th Sem\Project\Ola\backend" && npm start"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server on port 3000...
start "Frontend Server" cmd /k "cd /d "d:\NUV ACD\All SEM\5th Sem\Project\Ola\frontend" && set PORT=3000 && npm start"

echo Both servers are starting...
echo Backend: http://localhost:3002
echo Frontend: http://localhost:3000
echo Live Tracking: http://localhost:3000/live-tracking

pause