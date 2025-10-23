@echo off
echo 🚀 Starting Heart Disease Prediction System...

REM Kill any existing processes
taskkill /f /im python.exe 2>nul
taskkill /f /im node.exe 2>nul

REM Start backend
echo 📡 Starting Flask backend on port 5001...
cd backend
start "Backend" python app_new.py
cd ..

REM Wait for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo 🎨 Starting React frontend on port 3000...
cd frontend
start "Frontend" npm start
cd ..

echo ✅ System started successfully!
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:5001
echo.
echo Press any key to exit...
pause >nul
