#!/bin/bash
echo "================================"
echo "🔥 SETUP PROJECT nhomud 🔥"
echo "================================"

# Backend
echo "[1/3] Cài đặt môi trường Backend..."
cd Backend || exit
if [ ! -d ".venv" ]; then
    echo "Tạo virtual environment..."
    py -m venv .venv
fi
. .venv/Scripts/activate
echo "Cài đặt thư viện Python..."
pip install -r requirements.txt
cd ..

# Frontend
echo "[2/3] Cài đặt môi trường Frontend..."
cd Frontend || exit
npm install
cd ..

echo "✅ Hoàn tất cài đặt!"
