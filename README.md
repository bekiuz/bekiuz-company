# Bekiuz Company — rasmiy sayt

Professional, mobilga mos statik sayt. Bitta `index.html` faylida HTML, CSS va JavaScript jamlangan — build qilish, npm o‘rnatish yoki server kerak emas.

## Lokal ishga tushirish

1. Repozitoriyani kompyuteringizga yuklab oling yoki `index.html` faylini oching.
2. `index.html` faylini Chrome yoki boshqa brauzerda oching.

## GitHub Pages orqali bepul nashr qilish

1. Ushbu public repozitoriyda **Settings → Pages** sahifasini oching: https://github.com/bekiuz/bekiuz-company/settings/pages
2. **Build and deployment** → **Deploy from a branch** ni tanlang.
3. Branch: `main`; folder: `/(root)` ni tanlab **Save** bosing.
4. Bir necha daqiqadan so‘ng sayt quyidagi manzilda ochiladi:
   https://bekiuz.github.io/bekiuz-company/

## Saytda mavjud

- Mobil va desktop ekranlariga moslashuvchi dizayn
- Xizmatlar, demo loyihalar, ish jarayoni va kompaniya haqida bo‘limlar
- Mobil navigatsiya, loyiha filtrlari va scroll progress indikatori
- Kontakt so‘rovi matnini tayyorlash va nusxalash
- Tashqi kutubxonalar yoki build vositalariga bog‘liqlik yo‘q

## Kontakt formasini sozlash

`index.html` faylining oxiridagi JavaScript konfiguratsiyasini toping:

```js
var CONFIG = {
  telegramUsername: "",
  contactEmail: "",
  githubUrl: "https://github.com/bekiuz"
};
```

`telegramUsername` maydoniga Telegram username (masalan, `bekiuz_dev`), `contactEmail` maydoniga mijozlar murojaati uchun haqiqiy email kiriting. Keyin o‘zgarishlarni GitHub’ga commit qiling.

**Muhim:** GitHub Pages statik hosting. Kontakt formasi backend yoki CRM’ga o‘zi ma’lumot saqlamaydi. Telegram/email sozlanmagan bo‘lsa, forma xabarni foydalanuvchi qurilmasida nusxalashga harakat qiladi; bu holatda xabarni foydalanuvchi o‘zi yuboradi. Maxfiy API kalitlarini `index.html` ichiga joylamang.

Portfolio kartalari demo-konsepsiyalar deb belgilangan va haqiqiy mijoz ishlari sifatida ko‘rsatilmaydi.
