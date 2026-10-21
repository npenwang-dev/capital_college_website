#!/bin/bash
echo "Starting Capital College Kohima Backend & Frontend..."

# Kill previous node processes on port 5001 or 5173 if any
lsof -ti:5001 | xargs kill -9 2>/dev/null
lsof -ti:5173 | xargs kill -9 2>/dev/null

# Start Backend
cd "capital_colleg_backend"
npm start &
BACKEND_PID=$!
cd ..

# Start Frontend
cd "capital_college_frontend"
npm run dev &
FRONTEND_PID=$!
cd ..

echo "Backend PID: $BACKEND_PID (http://localhost:5001)"
echo "Frontend PID: $FRONTEND_PID (http://localhost:5173)"
echo "Press Ctrl+C to stop both servers."

trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
