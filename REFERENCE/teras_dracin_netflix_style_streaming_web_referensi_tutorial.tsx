# Teras Dracin — Netflix‑Style Streaming Web

Dokumen ini adalah **referensi rapi + tutorial praktis** untuk membangun platform streaming ala Netflix berbasis **short drama** menggunakan API Sansekai / Teras Dracin.

Tujuan dokumen ini:
- Menjadi **single source of truth** (arsitektur, alur, keputusan teknis)
- Bisa dipakai **belajar**, **onboarding tim**, atau **eksekusi langsung**
- Menghindari pola "clone UI tanpa otak"

---

## 1. Gambaran Besar Sistem

**Teras Dracin bukan sekadar website.**
Ia adalah *content discovery platform*.

Alur sederhana:

User → Frontend (Next.js) → Backend BFF → Upstream API → Backend → Frontend → User

Prinsip inti:
- Frontend **tidak pernah** mengakses API upstream langsung
- Backend bertindak sebagai **proxy + aggregator + gatekeeper**
- Semua response dienkripsi

---

## 2. Tech Stack (Final & Konsisten)

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- TanStack React Query
- HLS.js (video streaming m3u8)

### Backend
- Next.js API Routes (BFF pattern)
- Node.js runtime
- AES Encryption
- Rate limiting

### Deployment
- Vercel compatible
- Environment-based config

---

## 3. Konsep Backend (BFF – Backend For Frontend)

Backend **BUKAN** streaming server.
Backend adalah **lapisan kontrol**.

### Fungsi Backend
- Proxy ke API Sansekai (DramaBox, ReelShort, dll)
- Menyembunyikan API asli
- Normalisasi response
- Enkripsi payload
- Rate limit endpoint berat

### Format Response Wajib
```json
{
  "contents": "BASE64_AES_ENCRYPTED_STRING"
}
```

Frontend melakukan dekripsi menggunakan:
```
process.env.NEXT_PUBLIC_CRYPTO_SECRET
```

---

## 4. Endpoint Backend yang Direkomendasikan

### 4.1 `/api/home`
Aggregator homepage (inti UX Netflix)

Menggabungkan:
- Trending
- For You
- Latest
- Dub Indo

Response:
```json
[
  {
    "title": "Trending",
    "items": []
  }
]
```

---

### 4.2 `/api/detail/[id]`
- Deteksi platform
- Ambil detail drama
- Metadata + ringkasan episode

---

### 4.3 `/api/episodes/[id]`
- Ambil semua episode
- Jangan fetch stream di sini

---

### 4.4 `/api/watch`
- Generate playable stream (m3u8)
- Optional: proxy via `/api/proxy/video`

---

### 4.5 `/api/search?q=`
- Unified search
- Gabungan multi platform

---

## 5. Struktur Frontend (App Router)

```
app/
 ├─ page.tsx                // Homepage
 ├─ drama/[id]/page.tsx     // Detail
 ├─ watch/[id]/page.tsx     // Player
 ├─ search/page.tsx         // Search

components/
 ├─ Navbar.tsx
 ├─ HeroBanner.tsx
 ├─ RowSlider.tsx
 ├─ DramaCard.tsx
 ├─ EpisodeList.tsx
 ├─ VideoPlayer.tsx

hooks/
 ├─ useHome.ts
 ├─ useDramaDetail.ts
 ├─ useSearch.ts

lib/
 ├─ api.ts
 ├─ decrypt.ts
```

---

## 6. UX Netflix‑Style (Yang Benar)

Bukan sekadar "gelap + poster".

Prinsip UX:
- **Hero Banner** → decision shortcut
- **Horizontal Rows** → discovery tanpa lelah
- **Hover Preview** → micro‑dopamine
- **Skeleton Loader** → perceived performance

Kalau pakai grid biasa → itu katalog, bukan Netflix.

---

## 7. Video Player

Gunakan **HLS.js**

Fitur minimum:
- m3u8 playback
- Fullscreen
- Auto play
- Minimal UI

Catatan penting:
- Proxy streaming **cukup untuk MVP**
- Jangan sok CDN enterprise di awal

---

## 8. Keamanan & Anti‑Scrape

Tujuan enkripsi **bukan absolut security**, tapi:
- Naikkan cost attacker
- Cegah copas API
- Lindungi upstream

Tambahan opsional:
- Rate limit per IP
- Block heavy endpoint abuse

---

## 9. Kesalahan Fatal yang Harus Dihindari

- Fokus UI dulu, logic belakangan
- Tidak bikin `/api/home`
- Streaming langsung dari frontend
- Over‑engineering di fase MVP

Kalau ini terjadi → proyek mati pelan‑pelan.

---

## 10. Urutan Eksekusi yang Benar

1. Backend `/api/home`
2. Homepage (Hero + Rows)
3. Detail page
4. Watch page
5. Search
6. Polish UI

Urutan ini **tidak boleh dibalik**.

---

## 11. Posisi Dokumen Ini

Dokumen ini bisa dipakai sebagai:
- Referensi pribadi
- Tutorial internal
- Dokumentasi proyek
- Prompt basis untuk AI coding

Kalau ingin lanjut:
- Bisa diturunkan ke README
- Bisa dipecah jadi wiki
- Bisa dijadikan SOP tim

---

**End of Document**