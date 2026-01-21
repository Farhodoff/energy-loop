# Energy Loop - Monetizatsiya va Narxlash Strategiyasi

Loyiha uchun "Freemium" modeli tanlandi. Bu model o'yinchilarga o'yinni bepul o'ynash imkonini beradi, biroq qo'shimcha qulayliklar va vizual elementlar uchun to'lov talab qilinadi.

## 1. Asosiy Daromad Modellari

Biz quyidagi 3 ta yo'nalishni birlashtiramiz:

### A. Reklama (Ad-Supported) - Bepul Foydalanuvchilar uchun
Bu eng katta auditoriyani qamrab oladi.
*   **Rewarded Ads (Mukofotli Reklama):** O'yinchi qiyin vaziyatda qolganda, "Hint" (Yordam) olish uchun 30 soniyalik videoni ixtiyoriy tomosha qiladi. Bu foydalanuvchini bezovta qilmaydi, chunki u buni o'zi tanlaydi.
*   **Interstitial Ads:** Har 5-10 bosqichdan so'ng chiqadigan to'liq ekranli reklama (ehtiyotkorlik bilan qo'llash kerak).

### B. Bir Martalik Xaridlar (In-App Purchases)
*   **Remove Ads (Reklamani o'chirish):** **$2.99**. O'yinchiga toza, reklamasiz tajribani taqdim etadi.
*   **Coin/Hint Packs:** 
    *   Small Pack (10 Hints): **$0.99**
    *   Large Pack (50 Hints): **$3.99**
*   **Premium Themes (Mavzular):** O'yin ko'rinishini o'zgartirish (masalan, "Cyberpunk", "Paper Effect", "Retro"). Narxi: **$0.99** dan.

### C. Obuna (Hozircha rejalashtirilmaydi)
Hozirgi bosqichda obuna modeli (Monthly Subscription) oddiy jumboq o'yini uchun ortiqcha bo'lishi mumkin. Buni keyinchalik "Daily Zen Archive" (eski kunlik jumboqlarni yechish) funksiyasi bilan qo'shish mumkin.

---

## 2. Foydalanuvchi Ehtiyojlarini O'rganish (Survey)

Marketing strategiyasining bir qismi sifatida, biz o'yinchilardan qaysi funksiyalar ular uchun qadrli ekanligini so'raymiz (MaxDiff usuli).

**Savol:** Quyidagilardan qaysi biri siz uchun **ENG MUHIM** va qaysi biri **ENG KAM MUHIM**?

| Variantlar | Eng Muhim (Most) | Eng Kam Muhim (Least) |
| :--- | :---: | :---: |
| **Reklamasiz o'yin** (No Ads) | □ | □ |
| **Cheksiz Yordam** (Unlimited Hints) | □ | □ |
| **Chiroyli Mavzular** (Custom Themes) | □ | □ |
| **O'tgan Kunlar Arxivi** (Archive Access) | □ | □ |
| **Rekordlar Jadvali** (Leaderboards) | □ | □ |

---

## 3. Texnik Amalga Oshirish Rejasi

1.  **Google AdMob integratsiyasi:** Mobil ilova (React Native/Expo) versiyasi uchun.
2.  **Stripe yoki RevenueCat:** To'lovlarni qabul qilish uchun.
3.  **UI Updates:** 
    *   "Shop" (Do'kon) sahifasini yaratish.
    *   "Watch Ad for Hint" tugmasini qo'shish.

## 4. Keyingi Qadamlar
1.  Foydalanuvchi interfeysiga (UI) "Shop" tugmasini qo'shish.
2.  "Hint" tizimini reklama bilan bog'lash logikasini yozish.
