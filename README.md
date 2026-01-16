# Energy Loop

React + TypeScript + Vite va FastAPI backend bilan qurilgan interaktiv o'yin loyihasi.

## 📋 Talablar

Loyihani ishga tushirishdan oldin quyidagilarni o'rnatganingizga ishonch hosil qiling:

- **Node.js** (v18 yoki yuqori versiya)
- **npm** yoki **yarn**
- **Python** (v3.8 yoki yuqori versiya)
- **pip** (Python package manager)

## 🚀 Loyihani Ishga Tushirish

### 1️⃣ Frontend (React + Vite)

#### O'rnatish:
```bash
# Kerakli paketlarni o'rnatish
npm install
```

#### Ishga tushirish:
```bash
# Development serverini ishga tushirish
npm run dev
```

Brauzerda `http://localhost:5173` manzilini oching.

#### Boshqa buyruqlar:
```bash
# Production uchun build qilish
npm run build

# Production buildni ko'rish
npm run preview

# Kodni tekshirish (linting)
npm run lint
```

### 2️⃣ Backend (FastAPI)

#### O'rnatish:
```bash
# Backend papkasiga o'tish
cd backend

# Virtual environment yaratish (ixtiyoriy, lekin tavsiya etiladi)
python -m venv venv

# Virtual environmentni faollashtirish
# macOS/Linux:
source venv/bin/activate
# Windows:
# venv\Scripts\activate

# Kerakli paketlarni o'rnatish
pip install -r requirements.txt
```

#### Ishga tushirish:
```bash
# Backend serverini ishga tushirish
uvicorn main:app --reload
```

Backend `http://localhost:8000` manzilida ishga tushadi.

API dokumentatsiyasini `http://localhost:8000/docs` da ko'rishingiz mumkin.

## 🐳 Docker Deployment

Loyihani Docker yordamida oson deploy qilishingiz mumkin (bu ham backend, ham frontendni o'z ichiga oladi).

### 1️⃣ Docker Image qurish
```bash
docker build -t energy-loop .
```

### 2️⃣ Kontaynerni ishga tushirish
```bash
docker run -p 8000:8000 energy-loop
```

Endi loyiha `http://localhost:8000` manzilida ishlaydi. Frontend `backend` tomonidan static fayl sifatida uzatiladi.

## 📁 Loyiha Tuzilishi

```
energy-loop/
├── backend/           # FastAPI backend
│   ├── main.py       # Backend asosiy fayl
│   ├── generator.py  # Level generator
│   └── requirements.txt
├── src/              # React frontend
├── public/           # Static fayllar
└── README.md
```

## 🛠️ Texnologiyalar

### Frontend:
- React 19
- TypeScript
- Vite
- TailwindCSS

### Backend:
- FastAPI
- Uvicorn
- Pydantic

## 📸 Screenshots

### Quick Play Mode (5x5 Grid)
![Quick Play Mode](screenshots/quick-play-mode.png)

### Daily Zen Mode (7x7 Grid)
![Daily Zen Mode](screenshots/daily-zen-mode.png)

### Tile Rotation in Action
![Tile Rotation](screenshots/tile-rotation.png)

## 🎮 O'yin Xususiyatlari

- **Quick Play**: Tasodifiy 5x5 o'yin maydoni
- **Daily Zen**: Kunlik 7x7 jumboq (har kuni bir xil seed)
- **Interaktiv Tile Rotation**: Har bir katak ustiga bosish orqali 90° aylanish
- **Power Flow Visualization**: Real-time energiya oqimi ko'rsatilishi
- **Win Detection**: Barcha katak to'g'ri joylashganda g'alaba animatsiyasi
- **Sound Effects**: Click va g'alaba tovushlari

---

## React + Vite Qo'shimcha Ma'lumotlar

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
