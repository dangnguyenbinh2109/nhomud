#!/bin/bash
echo "================================"
echo "🔥 SETUP PROJECT nhomud 🔥"
echo "================================"

# Backend
echo "[1/3] Cài đặt môi trường Backend..."
cd Backend || exit

if [ ! -d ".venv" ]; then
    echo "Tạo virtual environment..."
    if command -v py &> /dev/null; then
        # Windows có lệnh py
        py -m venv .venv
    else
        # macOS/Linux
        python3 -m venv .venv
    fi
fi

# Kích hoạt venv
if [ -f ".venv/Scripts/activate" ]; then
    . .venv/Scripts/activate
elif [ -f ".venv/bin/activate" ]; then
    . .venv/bin/activate
else
    echo "❌ Không tìm thấy file activate trong .venv"
    exit 1
fi

echo "Cài đặt thư viện Python..."
pip install -r requirements.txt
cd ..

# Frontend
echo "[2/3] Cài đặt môi trường Frontend..."
cd Frontend || exit
npm install
cd ..

echo "✅ Hoàn tất cài đặt!"
