# 📡 API Integration Documentation

Dokumentasi lengkap integrasi API Sansekai untuk platform DramaBox di Teras Dracin.

## 🌐 Base URL & Configuration

Base URL sekarang dikonfigurasi melalui environment variable.

**Development (.env):**
```bash
VITE_API_BASE_URL=/api
```
Menggunakan proxy lokal untuk menghindari masalah CORS.

**Production:**
```bash
VITE_API_BASE_URL=https://api.sansekai.my.id/api
```

## 🔑 Authentication

API Sansekai saat ini tidak memerlukan authentication key. Namun, pastikan untuk:
- Menggunakan HTTPS
- Respect rate limiting
- Implement caching untuk reduce load (Sudah diimplementasikan di `api.ts`)

## 📊 Endpoints

### 1. Trending Dramas

**Endpoint:** `/dramabox/trending`  
**Method:** `GET`  
**Description:** Mendapatkan daftar drama yang sedang trending

**Response:**
```json
{
  "status": 200,
  "data": [
    {
      "bookId": "123456",
      "title": "Drama Title",
      "cover": "https://...",
      "coverVertical": "https://...",
      "introduction": "Drama description...",
      "score": 8.5,
      "episodeCount": 100
    }
  ]
}
```

**Usage:**
```typescript
import { DramaService } from './lib/dramaService';

const trending = await DramaService.getTrending();
```

---

### 2. Latest Dramas

**Endpoint:** `/dramabox/latest`  
**Method:** `GET`  
**Description:** Mendapatkan drama-drama terbaru

**Response:** Same structure as Trending

**Usage:**
```typescript
const latest = await DramaService.getLatest();
```

---

### 3. For You (Recommendations)

**Endpoint:** `/dramabox/foryou?page={page}`  
**Method:** `GET`  
**Parameters:**
- `page` (optional): Page number, default = 1

**Usage:**
```typescript
const forYou = await DramaService.getForYou(1);
```

---

### 4. Dubbing Indonesia

**Endpoint:** `/dramabox/dubindo?classify={classify}&page={page}`  
**Method:** `GET`  
**Parameters:**
- `classify` (optional): Classification type
  - `terpopuler` (most popular)
  - `terbaru` (newest)
  - Default: `terpopuler`
- `page` (optional): Page number, default = 1

**Usage:**
```typescript
const dubIndo = await DramaService.getDubIndo('terpopuler', 1);
```

---

### 5. Drama Detail
