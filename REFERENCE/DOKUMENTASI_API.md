# API Documentation - Teras Dracin

Dokumentasi ini menjelaskan struktur API internal yang digunakan oleh Teras Dracin untuk mengambil konten dari berbagai platform drama pendek.

## Overview

Semua API di Teras Dracin berfungsi sebagai proxy ke upstream API (`https://api.sansekai.my.id/api`). Respon dari API ini **dienkripsi** menggunakan AES untuk keamanan data.

### Base URL
`https://[domain-anda]/api`

### Enkripsi & Dekripsi
Data dikembalikan dalam format objek terenkripsi:
```json
{
  "contents": "BASE64_ENCRYPTED_STRING"
}
```
Gunakan `CryptoJS.AES.decrypt` dengan key dari `process.env.NEXT_PUBLIC_CRYPTO_SECRET` untuk membaca data.

---

## 1. DramaBox API
Platform utama dengan konten paling lengkap.

- **Populer (For You)**: `GET /api/dramabox/foryou?page={n}`
- **Terbaru**: `GET /api/dramabox/latest`
- **Trending**: `GET /api/dramabox/trending`
- **Dubbing Indonesia**: `GET /api/dramabox/dubindo`
- **Detail Drama**: `GET /api/dramabox/detail/{bookId}`
- **Daftar Episode**: `GET /api/dramabox/allepisode/{bookId}`
- **Pencarian**: `GET /api/dramabox/search?q={query}`

---

## 2. ReelShort API
- **Homepage**: `GET /api/reelshort/homepage`
- **Detail**: `GET /api/reelshort/detail?bookId={id}`
- **Watch/Stream**: `GET /api/reelshort/watch?bookId={id}&chapterId={id}`
- **Pencarian**: `GET /api/reelshort/search?q={query}`

---

## 3. NetShort API
- **For You**: `GET /api/netshort/foryou?page={n}`
- **Theaters (Home)**: `GET /api/netshort/theaters`
- **Detail**: `GET /api/netshort/detail?shortPlayId={id}`
- **Pencarian**: `GET /api/netshort/search?q={query}`

---

## 4. Melolo API
- **Terbaru**: `GET /api/melolo/latest`
- **Trending**: `GET /api/melolo/trending`
- **Detail**: `GET /api/melolo/detail?bookId={id}`
- **Stream**: `GET /api/melolo/stream?bookId={id}&chapterId={id}`
- **Pencarian**: `GET /api/melolo/search?q={query}`

---

## 5. FlickReels API
- **For You**: `GET /api/flickreels/foryou`
- **Terbaru**: `GET /api/flickreels/latest`
- **Hot Rank**: `GET /api/flickreels/hotrank`
- **Detail**: `GET /api/flickreels/detail?playletId={id}`
- **Pencarian**: `GET /api/flickreels/search?q={query}`

---

## 6. FreeReels API
- **Homepage**: `GET /api/freereels/home`
- **Anime**: `GET /api/freereels/anime`
- **For You**: `GET /api/freereels/foryou`
- **Detail**: `GET /api/freereels/detail?key={key}`
- **Pencarian**: `GET /api/freereels/search?q={query}`

---

## 7. Utility API
- **Video Proxy**: `GET /api/proxy/video?url={encoded_url}` (Digunakan untuk bypass CORS pada stream video)
- **Warmup**: `GET /api/proxy/warmup` (Memastikan koneksi ke upstream aktif)
- **Download**: `GET /api/download?url={url}&name={filename}`

---

## Cara Penggunaan di Frontend (Hooks)
Projek ini sudah menyediakan custom hooks untuk setiap API:
- `useDramas.ts` (DramaBox)
- `useReelShort.ts`
- `useNetShort.ts`
- `useMelolo.ts`
- `useFlickReels.ts`
- `useFreeReels.ts`

Gunakan hooks tersebut untuk otomatisasi fetch, caching (React Query), dan dekripsi data.
