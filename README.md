# Energy Loop

React (Vite) va FastAPI (Python) texnologiyalari asosida yaratilgan interaktiv jumboq o'yini.

## 📋 Xususiyatlar

- **🎮 O'yin rejimlari**:
  - **Quick Play**: 5x5 o'lchamdagi tasodifiy jumboq.
  - **Daily Zen**: 7x7 o'lchamdagi kunlik jumboq (har kuni yangi).
- **✨ Vizual Effektlar**: Nurlanuvchi plitkalar (Tiles) va silliq animatsiyalar.
- **🔊 Ovozlar**: Harakat va g'alaba uchun maxsus tovushlar.
- **🐳 Docker Support**: To'liq `dockerized` qilingan (Frontend + Backend).

## 🚀 Ishga Tushirish (Development)

Loyiha ham frontend, ham backendni bitta buyruq bilan ishga tushirish uchun sozlangan.

### 1-usul: Avtomatlashtirilgan Skript
```bash
# Barcha kerakli bog'liqliklarni o'rnatadi va ishga tushiradi
chmod +x setup_and_run.sh
./setup_and_run.sh
```

### 2-usul: Qo'lda (Manual)
```bash
# 1. NPM paketlarini o'rnatish
npm install

# 2. Python paketlarini o'rnatish
pip install -r backend/requirements.txt

# 3. Ikkalasini birga ishga tushirish
npm run dev
```
O'yin `http://localhost:5173` manzilida ishga tushadi.

## 🧪 Testlash

Loyihada Frontend (Vitest) va Backend (Pytest) testlari mavjud.

```bash
# Frontend va Backend testlarini ishga tushirish
npm run test
```

## 🌐 Deployment (Internetga Joylash)

Loyiha **Docker** asosida qurilganligi uchun uni istalgan platformaga (Render, Railway, VPS) osongina joylash mumkin.

### 1. Render (Tavsiya etiladi)
1. [Render](https://render.com) ga kiring va **New Blueprint** yarating.
2. Ushbu repozitoriyani tanlang.
3. Bo'ldi! Render `render.yaml` faylini o'qib, o'zi hammasini bajaradi.

### 2. Railway
1. [Railway](https://railway.app) da **New Project** yarating.
2. Repozitoriyani tanlang.
3. Railway `Dockerfile` ni topib, avtomatik deploy qiladi.

### 3. Docker (Mahalliy)
```bash
# Image qurish
docker build -t energy-loop .

# Ishga tushirish (8000-portda)
docker run -p 8000:8000 -e PORT=8000 energy-loop
```

## 📁 Loyiha Tuzilishi

```
energy-loop/
├── backend/           # FastAPI (Python) backend
│   ├── main.py        # Asosiy server va statik fayllar
│   ├── generator.py   # Labirint generatsiya logikasi
│   └── tests/         # Backend testlari
├── src/               # React (TypeScript) frontend
│   ├── components/    # O'yin komponentlari (Grid, Tile)
│   ├── logic/         # O'yin mantiqi
│   └── assets/        # Ovozlar va rasmlar
├── public/            # Favicon va statik resurslar
├── Dockerfile         # Docker konfiguratsiyasi
├── render.yaml        # Render deployment sozlamalari
└── setup_and_run.sh   # Tezkor ishga tushirish skripti
```

## 🛠 Texnologiyalar

- **Frontend**: React 19, TypeScript, Vite, TailwindCSS
- **Backend**: FastAPI, Uvicorn, Python 3.11
- **Tools**: Docker, Vitest, Pytest
