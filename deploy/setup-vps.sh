#!/bin/bash
# ============================================
# Craponia Atelier - Zikra VPS Kurulum Scripti
# Ubuntu 22.04 - Docker'siz Kurulum
# ============================================
# Kullanim: sudo bash setup-vps.sh DOMAIN_ADI
# Ornek:    sudo bash setup-vps.sh craponiaatelier.com
# ============================================

set -e

DOMAIN=${1:-"example.com"}
APP_DIR="/var/www/zikra"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"

echo "============================================"
echo " Craponia Atelier - VPS Kurulum"
echo " Domain: $DOMAIN"
echo "============================================"

# 1. Sistem guncelleme
echo "[1/8] Sistem guncelleniyor..."
apt update && apt upgrade -y
apt install -y curl wget git nginx python3 python3-pip python3-venv nodejs npm certbot python3-certbot-nginx

# 2. Node.js 18 kurulumu
echo "[2/8] Node.js kurulumu..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
npm install -g yarn

# 3. MongoDB kurulumu
echo "[3/8] MongoDB kurulumu..."
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" > /etc/apt/sources.list.d/mongodb-org-7.0.list
apt update
apt install -y mongodb-org
systemctl start mongod
systemctl enable mongod
echo "MongoDB kuruldu ve basladi."

# 4. Uygulama dizinlerini olustur
echo "[4/8] Uygulama dizinleri olusturuluyor..."
mkdir -p $APP_DIR
mkdir -p $BACKEND_DIR/uploads

echo "============================================"
echo " ONEMLI: Simdi uygulama dosyalarini yukleyin"
echo ""
echo " Dosyalarinizi su dizinlere kopyalayin:"
echo "   Backend:  $BACKEND_DIR/"
echo "   Frontend: $FRONTEND_DIR/"
echo ""
echo " Emergent'ten kodu indirip SCP ile yukleyin:"
echo "   scp -r backend/* root@SUNUCU_IP:$BACKEND_DIR/"
echo "   scp -r frontend/* root@SUNUCU_IP:$FRONTEND_DIR/"
echo "============================================"
echo ""
echo "Dosyalari yukledikten sonra su komutu calistirin:"
echo "   sudo bash /var/www/zikra/deploy.sh $DOMAIN"
echo ""
