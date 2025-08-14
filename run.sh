#!/bin/bash

echo "================================"
echo "🔥 RUNNING BACKEND & FRONTEND 🔥"
echo "================================"

# Lấy thư mục gốc tuyệt đối của script
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Chạy Backend
echo "[1/2] Starting Backend (Flask)..."
cd "$ROOT_DIR/Backend/src" || {
    echo "❌ Không tìm thấy thư mục Backend/src"
    exit 1
}

if [ -d ".venv" ]; then
    . .venv/Scripts/activate
    echo "✅ Virtual environment activated."
else
    echo "❌ Không tìm thấy virtual environment (.venv). Vui lòng chạy setup.sh trước!"
    exit 1
fi

# Chạy Flask server ở background
python app.py &
BACKEND_PID=$!

# Chạy Frontend
echo "[2/2] Starting Frontend (Vite)..."
cd "$ROOT_DIR/Frontend" || {
    echo "❌ Không tìm thấy thư mục Frontend"
    kill $BACKEND_PID
    exit 1
}
npm run dev &
FRONTEND_PID=$!

echo "✅ Backend (PID: $BACKEND_PID) và Frontend (PID: $FRONTEND_PID) đang chạy."
echo "Nhấn CTRL+C để dừng tất cả."

# Giữ tiến trình cho đến khi nhấn Ctrl+C
wait
