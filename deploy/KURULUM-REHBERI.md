# Craponia Atelier - VPS Kurulum Rehberi
## TR-VPS-2 (Ubuntu 22.04, 1 GB RAM, Docker'siz)

---

## ADIM 1: VPS Siparis Verin
- Guzelhosting'ten **TR-VPS-2** paketini secin
- Isletim sistemi: **Ubuntu 22.04**
- cPanel lisansi: **ALMAYIN** (gerek yok)
- Siparis tamamlaninca size **IP adresi** ve **root sifresi** gelecek

---

## ADIM 2: Domain DNS Ayari
Guzelhosting veya domain saglayicinizin DNS panelinden:

| Tip | Ad | Deger |
|-----|-----|-------|
| A | @ | VPS_IP_ADRESINIZ |
| A | www | VPS_IP_ADRESINIZ |

> DNS degisikligi 5-30 dakika surebilir.

---

## ADIM 3: VPS'e Baglanin
Windows'ta: **PuTTY** veya **Windows Terminal** kullanin
Mac/Linux'ta: Terminal kullanin

```bash
ssh root@VPS_IP_ADRESINIZ
# Sifrenizi girin
```

---

## ADIM 4: Kurulum Scriptini Yukleyin ve Calistirin

### 4a. Emergent'ten kodu indirin
Emergent chat ekraninda **"Download Code"** butonuna basin ve ZIP dosyasini indirin.

### 4b. Dosyalari VPS'e yukleyin
Bilgisayarinizda yeni bir terminal acin:

```bash
# ZIP'i cikartin
unzip craponia-commerce.zip

# Dosyalari VPS'e yukleyin
scp -r deploy/* root@VPS_IP_ADRESINIZ:/root/
scp -r backend root@VPS_IP_ADRESINIZ:/var/www/zikra/
scp -r frontend root@VPS_IP_ADRESINIZ:/var/www/zikra/
```

### 4c. VPS'te kurulumu baslatin
VPS terminaline geri donun:

```bash
# Dizinleri olustur
mkdir -p /var/www/zikra

# Ilk kurulum (sistem + MongoDB + Node.js + Nginx)
sudo bash /root/setup-vps.sh craponiaatelier.com
```
> `craponiaatelier.com` yerine kendi domain adinizi yazin

### 4d. Deploy edin
```bash
sudo bash /var/www/zikra/deploy.sh craponiaatelier.com
```

---

## ADIM 5: SSL Sertifikasi (HTTPS)
DNS ayarlari yayildiktan sonra:

```bash
sudo certbot --nginx -d craponiaatelier.com -d www.craponiaatelier.com
```
> Sertifika otomatik yenilenir, baska bir sey yapmaniza gerek yok.

---

## ADIM 6: Admin Seed (Ilk Giris)
VPS'te admin kullanicisini olusturmak icin:

```bash
cd /var/www/zikra/backend
source venv/bin/activate
python3 seed.py
deactivate
```

Artik admin paneline girebilirsiniz:
- **URL:** https://craponiaatelier.com/admin/login
- **E-posta:** admin@zikra.com
- **Sifre:** admin123

---

## Faydali Komutlar

### Durum kontrol
```bash
sudo systemctl status zikra-backend    # Backend durumu
sudo systemctl status nginx            # Nginx durumu
sudo systemctl status mongod           # MongoDB durumu
```

### Log izleme
```bash
sudo journalctl -u zikra-backend -f    # Backend loglarini canli izle
sudo tail -f /var/log/nginx/error.log  # Nginx hata loglari
```

### Yeniden baslatma
```bash
sudo systemctl restart zikra-backend   # Backend yeniden baslat
sudo systemctl restart nginx           # Nginx yeniden baslat
sudo systemctl restart mongod          # MongoDB yeniden baslat
```

### Kod guncelleme
Yeni degisiklik yaptiginizda:
1. Yeni dosyalari VPS'e yukleyin (scp ile)
2. Guncelleme scriptini calistirin:
```bash
sudo bash /var/www/zikra/update.sh
```

---

## Sorun Giderme

### Site acilmiyor
```bash
# Nginx calisiyormu?
sudo systemctl status nginx

# Backend calisiyormu?
sudo systemctl status zikra-backend

# MongoDB calisiyormu?
sudo systemctl status mongod

# Port kontrolu
sudo ss -tlnp | grep -E '80|443|8001|27017'
```

### Backend hatasi
```bash
# Loglara bak
sudo journalctl -u zikra-backend --no-pager -n 50
```

### RAM yetersiz uyarisi
```bash
# RAM kullanimi
free -h

# Swap olustur (1 GB)
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```
> 1 GB RAM yeterli olmali ama swap eklemek guvenlik agi saglar.

---

## Onemli Notlar
- **Yedekleme:** MongoDB verilerinizi duzenli yedekleyin:
  `mongodump --db zikra_production --out /root/backups/$(date +%Y%m%d)`
- **Guvenlik:** root sifrenizi degistirin ve SSH key kullanin
- **Firewall:** `sudo ufw allow 80,443,22/tcp && sudo ufw enable`
