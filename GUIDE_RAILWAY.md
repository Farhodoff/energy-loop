# 🚂 Railway orqali Deploy qilish bo'yicha qo'llanma

Render qiyinlik qilayotgan bo'lsa, **Railway** juda oddiy va qulay alternativadir.

## 1-qadam: Ro'yxatdan o'tish
1. [railway.app](https://railway.app/) saytiga kiring.
2. **"Login"** tugmasini bosing va **GitHub** orqali kiring.

## 2-qadam: Loyihani ulash
1. Asosiy oynada **"New Project"** (yoki "+ Create a New Project") tugmasini bosing.
2. **"Deploy from GitHub repo"** ni tanlang.
3. **`energy-loop`** repozitoriyingizni ro'yxatdan tanlang.

## 3-qadam: Tasdiqlash
1. Railway avtomatik ravishda loyihangizdagi `Dockerfile` faylini ko'radi.
2. **"Deploy Now"** tugmasini bosing.

## Bo'ldi! 🎉
Railway o'zi hammasini bajaradi:
- Docker image quradi.
- Frontendni build qiladi.
- Backendni ishga tushiradi.
- Sizga `xyz-production.up.railway.app` kabi tayyor havola beradi.

*Eslatma: Biz kodni shunday sozlaganmizki (Dockerfile va PORT sozlamalari), u Railway-da hech qanday qo'shimcha sozlamasiz ishlaydi.*
