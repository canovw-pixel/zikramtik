#!/bin/bash
# ============================================
# Craponia Atelier - Deploy Scripti
# Dosyalar yuklendikten sonra calistirilir
# Kullanim: sudo bash deploy.sh DOMAIN_ADI
# ============================================

set -e

DOMAIN=${1:-"example.com"}
APP_DIR="/var/www/zikra"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"

echo "============================================"
echo " Deploy basliyor - Domain: $DOMAIN"
echo "============================================"

# 1. Backend kurulumu
echo "[1/5] Backend kurulumu..."
cd $BACKEND_DIR

# Virtual environment olustur
python3 -m venv venv
source venv/bin/activate

# Gereksinimleri kur
pip install --upgrade pip
pip install fastapi uvicorn motor python-dotenv python-jose passlib bcrypt python-multipart Pillow aiofiles pydantic email-validator

# .env dosyasi olustur
cat > $BACKEND_DIR/.env << EOF
MONGO_URL=mongodb://localhost:27017
DB_NAME=zikra_production
CORS_ORIGINS=https://$DOMAIN
JWT_SECRET=$(openssl rand -hex 32)
EOF

deactivate
echo "Backend kuruldu."

# 2. Frontend build
echo "[2/5] Frontend build ediliyor..."
cd $FRONTEND_DIR

# .env dosyasi
cat > $FRONTEND_DIR/.env << EOF
REACT_APP_BACKEND_URL=https://$DOMAIN
EOF

yarn install
yarn build
echo "Frontend build tamamlandi."

# 3. Systemd servisi olustur (Backend)
echo "[3/5] Backend servisi olusturuluyor..."
cat > /etc/systemd/system/zikra-backend.service << EOF
[Unit]
Description=Zikra Backend API
After=network.target mongod.service

[Service]
Type=simple
User=root
WorkingDirectory=$BACKEND_DIR
Environment=PATH=$BACKEND_DIR/venv/bin:/usr/bin
ExecStart=$BACKEND_DIR/venv/bin/uvicorn server:app --host 127.0.0.1 --port 8001 --workers 2
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable zikra-backend
systemctl start zikra-backend
echo "Backend servisi basladi."

# 4. Nginx konfigurasyonu
echo "[4/5] Nginx ayarlaniyor..."
cat > /etc/nginx/sites-available/zikra << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Frontend - React static files
    root $FRONTEND_DIR/build;
    index index.html;

    # Upload dosyalari
    location /api/uploads/ {
        alias $BACKEND_DIR/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8001/api/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        client_max_body_size 20M;
    }

    # React Router - tum diger istekleri index.html'e yonlendir
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Static asset cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Nginx'i aktifle
ln -sf /etc/nginx/sites-available/zikra /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
echo "Nginx ayarlandi."

# 5. SSL Sertifikasi (Let's Encrypt)
echo "[5/5] SSL sertifikasi aliniyor..."
echo ""
echo "SSL sertifikasi icin domain'inizin bu sunucuya yonlendirilmis olmasi gerekiyor."
echo "DNS ayarlarinizi yaptiysaniz, asagidaki komutu calistirin:"
echo ""
echo "   sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo ""

echo "============================================"
echo " KURULUM TAMAMLANDI!"
echo "============================================"
echo ""
echo " Site adresi: http://$DOMAIN"
echo " Admin panel: http://$DOMAIN/admin/login"
echo " Admin giris: admin@zikra.com / admin123"
echo ""
echo " SSL icin: sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo ""
echo " Faydali komutlar:"
echo "   Backend durumu:  sudo systemctl status zikra-backend"
echo "   Backend loglar:  sudo journalctl -u zikra-backend -f"
echo "   Backend yeniden: sudo systemctl restart zikra-backend"
echo "   Nginx yeniden:   sudo systemctl restart nginx"
echo "   MongoDB durumu:  sudo systemctl status mongod"
echo "============================================"
