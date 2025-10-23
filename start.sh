#!/bin/bash

echo "🚀 Starting Heart Disease Prediction System..."

# Kill any existing processes
pkill -f "app_new.py" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true

# Start backend
echo "📡 Starting Flask backend on port 5001..."
cd backend
python app_new.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Starting React frontend on port 3000..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo "✅ System started successfully!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop both services"

# Wait for user to stop
wait
