#!/bin/bash
# ============================================
# Guncelleme Scripti
# Yeni kod degisikliklerini deploy etmek icin
# Kullanim: sudo bash update.sh
# ============================================

APP_DIR="/var/www/zikra"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"

echo "Guncelleme basliyor..."

# Backend guncelle
echo "[1/3] Backend guncelleniyor..."
cd $BACKEND_DIR
source venv/bin/activate
pip install -r requirements.txt 2>/dev/null
deactivate
sudo systemctl restart zikra-backend
echo "Backend guncellendi."

# Frontend guncelle
echo "[2/3] Frontend build ediliyor..."
cd $FRONTEND_DIR
yarn install
yarn build
echo "Frontend guncellendi."

# Nginx reload
echo "[3/3] Nginx yeniden yukleniyor..."
sudo systemctl reload nginx

echo "============================================"
echo " Guncelleme tamamlandi!"
echo "============================================"
