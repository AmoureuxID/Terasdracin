# 📡 API Integration Documentation

Dokumentasi lengkap integrasi API Sansekai untuk platform DramaBox di Teras Dracin.

## 🌐 Base URL

```
https://api.sansekai.my.id/api
```

## 🔑 Authentication

API Sansekai saat ini tidak memerlukan authentication key. Namun, pastikan untuk:
- Menggunakan HTTPS
- Respect rate limiting
- Implement caching untuk reduce load

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

**Endpoint:** `/dramabox/detail?bookId={bookId}`  
**Method:** `GET`  
**Parameters:**
- `bookId` (required): Drama ID

**Response:**
```json
{
  "status": 200,
  "data": {
    "bookId": "123456",
    "title": "Drama Title",
    "cover": "https://...",
    "coverVertical": "https://...",
    "coverHorizontal": "https://...",
    "introduction": "Full description...",
    "score": 8.5,
    "episodeCount": 100,
    "tags": ["Romance", "Drama"],
    "category": ["Modern"],
    "director": "Director Name",
    "actors": ["Actor 1", "Actor 2"]
  }
}
```

**Usage:**
```typescript
const detail = await DramaService.getDetail('123456');
```

---

### 6. All Episodes

**Endpoint:** `/dramabox/allepisode?bookId={bookId}`  
**Method:** `GET`  
**Parameters:**
- `bookId` (required): Drama ID

**Response:**
```json
{
  "status": 200,
  "data": [
    {
      "episodeId": "ep1",
      "chapterId": "ch1",
      "title": "Episode 1",
      "episodeIndex": 0,
      "episodeNumber": 1,
      "streamUrl": "https://...m3u8",
      "definition": [
        {
          "url": "https://...m3u8",
          "definition": "720p"
        }
      ]
    }
  ]
}
```

**Usage:**
```typescript
const episodes = await DramaService.getAllEpisodes('123456');
```

---

### 7. Search

**Endpoint:** `/dramabox/search?query={query}`  
**Method:** `GET`  
**Parameters:**
- `query` (required): Search term

**Response:** Same structure as Trending

**Usage:**
```typescript
const results = await DramaService.search('romance');
```

---

## 🔄 Response Structure

### Success Response
```json
{
  "status": 200,
  "data": [...] // or single object
}
```

### Error Response
```json
{
  "status": 404,
  "message": "Not found"
}
```

---

## ⚡ Caching Strategy

Aplikasi menggunakan smart caching untuk optimize performance:

### Cache Duration by Endpoint

| Endpoint | Cache Duration | Reason |
|----------|---------------|---------|
| `/trending` | 15 minutes | Updates frequently |
| `/latest` | 15 minutes | Updates frequently |
| `/foryou` | 15 minutes | Personalized content |
| `/dubindo` | 15 minutes | Updates frequently |
| `/detail` | 60 minutes | Static data |
| `/allepisode` | 60 minutes | Static data |
| `/search` | No cache | Always fresh results |

### Cache Implementation

```typescript
// Enable/disable cache per request
const trending = await dramaboxAPI.trending(true); // with cache
const search = await dramaboxAPI.search('query', false); // no cache

// Clear all cache
dramaboxAPI.clearCache();
```

---

## 🔁 Retry Logic

Aplikasi automatically retry failed requests:

- **Max Retries:** 3
- **Retry Delay:** Exponential backoff (1s, 2s, 3s)
- **Retry Conditions:** Network errors, timeouts

```typescript
// Configured in constants.ts
export const API_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  TIMEOUT: 30000,
}
```

---

## 🛡️ Error Handling

### Error Types

1. **Network Error**
   - No internet connection
   - DNS resolution failed
   - Message: "Tidak ada koneksi internet"

2. **Timeout Error**
   - Request took too long (> 30s)
   - Message: "Permintaan terlalu lama"

3. **Server Error (5xx)**
   - Server is down or error
   - Message: "Server sedang bermasalah"

4. **Not Found (404)**
   - Resource not found
   - Message: "Konten tidak ditemukan"

5. **Rate Limit (429)**
   - Too many requests
   - Message: "Terlalu banyak permintaan"

### Error Handling Example

```typescript
try {
  const data = await DramaService.getTrending();
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
    // Show user-friendly error message
  }
}
```

---

## 🎯 Best Practices

### 1. Use Service Layer

Always use `DramaService` instead of directly calling `dramaboxAPI`:

✅ **Good:**
```typescript
const trending = await DramaService.getTrending();
```

❌ **Bad:**
```typescript
const response = await dramaboxAPI.trending();
const trending = extractData(response);
```

### 2. Handle Loading States

```typescript
const [loading, setLoading] = useState(true);
const [data, setData] = useState([]);

useEffect(() => {
  async function fetchData() {
    setLoading(true);
    try {
      const result = await DramaService.getTrending();
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, []);
```

### 3. Use Custom Hooks

```typescript
import { useTrendingDramas } from './lib/hooks';

const { data, loading, error } = useTrendingDramas();
```

### 4. Implement Proper Error UI

```typescript
if (error) {
  return <ErrorMessage message={error.message} onRetry={refetch} />;
}
```

### 5. Show Loading Skeletons

```typescript
if (loading) {
  return <LoadingSkeleton />;
}
```

---

## 🔍 Testing API

### Test in Browser Console

```javascript
// Test trending endpoint
fetch('https://api.sansekai.my.id/api/dramabox/trending')
  .then(res => res.json())
  .then(console.log);

// Test search
fetch('https://api.sansekai.my.id/api/dramabox/search?query=romance')
  .then(res => res.json())
  .then(console.log);
```

### Test with curl

```bash
# Get trending
curl https://api.sansekai.my.id/api/dramabox/trending

# Search
curl "https://api.sansekai.my.id/api/dramabox/search?query=romance"

# Get detail
curl "https://api.sansekai.my.id/api/dramabox/detail?bookId=123456"
```

---

## 📈 Rate Limiting

Meskipun API tidak memiliki rate limit yang jelas, sebaiknya:

1. **Implement Caching** - Reduce unnecessary requests
2. **Debounce Search** - Wait for user to finish typing
3. **Batch Requests** - Use `Promise.all()` for multiple requests
4. **Monitor Usage** - Track API calls per minute

```typescript
// Good: Batch requests
const [trending, latest, forYou] = await Promise.all([
  DramaService.getTrending(),
  DramaService.getLatest(),
  DramaService.getForYou(),
]);

// Good: Debounced search
const debouncedSearch = debounce(async (query) => {
  const results = await DramaService.search(query);
}, 300);
```

---

## 🔒 Security Considerations

1. **HTTPS Only** - Always use HTTPS
2. **No API Keys in Frontend** - API doesn't require keys (good!)
3. **Input Validation** - Sanitize user input before sending to API
4. **XSS Protection** - Escape HTML in responses
5. **CORS** - API supports CORS, but be aware of limitations

---

## 🐛 Troubleshooting

### Issue: API Returns Empty Data

**Solution:**
- Check API endpoint URL
- Verify network connectivity
- Check browser console for errors
- Try different endpoint

### Issue: CORS Error

**Solution:**
- API should support CORS
- If not, use proxy server
- Check browser console for details

### Issue: Slow Response

**Solution:**
- Enable caching
- Reduce concurrent requests
- Check internet connection
- Monitor API response times

---

## 📞 Support

Untuk pertanyaan terkait API:
- API Provider: [Sansekai](https://api.sansekai.my.id)
- Documentation: [API Docs](https://api.sansekai.my.id/docs)

---

**Last Updated:** 2026-02-26
