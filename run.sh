#!/bin/bash

echo "================================"
echo "🔥 RUNNING BACKEND & FRONTEND 🔥"
echo "================================"

# Lấy thư mục gốc tuyệt đối của script
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Chạy Backend
echo "[1/2] Starting Backend (Flask)..."
cd "$ROOT_DIR/Backend" || {
    echo "❌ Không tìm thấy thư mục Backend"
    exit 1
}

# Phát hiện hệ điều hành và activate venv
if [ -d ".venv" ]; then
    if [ -f ".venv/Scripts/activate" ]; then
        # Windows
        . .venv/Scripts/activate
    elif [ -f ".venv/bin/activate" ]; then
        # macOS/Linux
        . .venv/bin/activate
    else
        echo "❌ Không tìm thấy file activate trong .venv"
        exit 1
    fi
    echo "✅ Virtual environment activated."
else
    echo "❌ Không tìm thấy virtual environment (.venv). Vui lòng chạy setup.sh trước!"
    exit 1
fi

# Chạy Flask server ở background
python ./src/app.py &
BACKEND_PID=$!

# Chạy Frontend (bỏ comment nếu muốn chạy luôn)
echo "[2/2] Starting Frontend (Vite)..."
cd "$ROOT_DIR/Frontend" || {
    echo "❌ Không tìm thấy thư mục Frontend"
    kill $BACKEND_PID
    exit 1
}
npm run dev &
FRONTEND_PID=$!

echo "✅ Backend (PID: $BACKEND_PID) đang chạy."
echo "Nhấn CTRL+C để dừng tất cả."

# Giữ tiến trình cho đến khi nhấn Ctrl+C
wait
