# 🚀 Panduan Deployment Teras Dracin

Panduan lengkap untuk deployment aplikasi Teras Dracin ke berbagai platform hosting.

## 📋 Pre-Deployment Checklist

Sebelum melakukan deployment, pastikan:

- ✅ Semua test berjalan dengan baik
- ✅ Build berjalan tanpa error (`pnpm build`)
- ✅ Environment variables sudah dikonfigurasi
- ✅ API endpoint dapat diakses
- ✅ Assets (images, icons) sudah siap
- ✅ Meta tags SEO sudah dikonfigurasi

## 🌐 Deployment Options

### Option 1: Vercel (Recommended) ⭐

**Kelebihan:**
- Zero-config deployment
- Automatic HTTPS
- Edge Network CDN
- Preview deployments
- Git integration

**Langkah Deployment:**

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login ke Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Set Environment Variables** (via Vercel Dashboard)
```
VITE_API_BASE_URL=https://api.sansekai.my.id/api
VITE_ENABLE_CACHE=true
```

5. **Deploy to Production**
```bash
vercel --prod
```

**Custom Domain:**
- Tambahkan domain di Vercel Dashboard
- Update DNS records sesuai instruksi Vercel

---

### Option 2: Netlify

**Kelebihan:**
- Free SSL
- Continuous Deployment
- Form handling
- Serverless functions support

**Langkah Deployment:**

1. **Install Netlify CLI**
```bash
npm i -g netlify-cli
```

2. **Login**
```bash
netlify login
```

3. **Build Project**
```bash
pnpm build
```

4. **Deploy**
```bash
netlify deploy --prod --dir=dist
```

**Atau via Git:**
1. Push code ke GitHub
2. Connect repository di Netlify Dashboard
3. Configure build settings:
   - Build command: `pnpm build`
   - Publish directory: `dist`
   - Node version: `18`

4. Set Environment Variables di Dashboard:
```
VITE_API_BASE_URL=https://api.sansekai.my.id/api
VITE_ENABLE_CACHE=true
```

---

### Option 3: GitHub Pages

**Kelebihan:**
- Free hosting
- Easy to setup
- Good for static sites

**Langkah Deployment:**

1. **Install gh-pages**
```bash
pnpm add -D gh-pages
```

2. **Update package.json**
```json
{
  "scripts": {
    "deploy": "pnpm build && gh-pages -d dist"
  },
  "homepage": "https://yourusername.github.io/teras-dracin"
}
```

3. **Deploy**
```bash
pnpm deploy
```

---

### Option 4: Railway

**Kelebihan:**
- Simple deployment
- Database support
- Environment variables
- Automatic SSL

**Langkah Deployment:**

1. Push code ke GitHub
2. Connect repository di Railway
3. Configure environment variables
4. Deploy automatically on push

**railway.json:**
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pnpm install && pnpm build"
  },
  "deploy": {
    "startCommand": "pnpm preview",
    "healthcheckPath": "/"
  }
}
```

---

### Option 5: Docker + Any VPS

**Kelebihan:**
- Full control
- Can run anywhere
- Consistent environments

**Dockerfile:**
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Build & Run:**
```bash
# Build image
docker build -t teras-dracin .

# Run container
docker run -p 80:80 teras-dracin
```

**Deploy ke VPS:**
```bash
# Copy files
scp -r . user@your-vps:/app/teras-dracin

# SSH ke VPS
ssh user@your-vps

# Build & run
cd /app/teras-dracin
docker-compose up -d
```

---

### Option 6: Cloudflare Pages

**Kelebihan:**
- Free tier generous
- Global CDN
- Fast edge computing
- Workers support

**Langkah Deployment:**

1. Push code ke GitHub
2. Connect di Cloudflare Pages Dashboard
3. Configure:
   - Build command: `pnpm build`
   - Build output: `dist`
   - Node version: `18`

4. Set environment variables
5. Deploy

---

## 🔧 Environment Variables Setup

### Development (.env.development)
```env
VITE_API_BASE_URL=https://api.sansekai.my.id/api
VITE_API_TIMEOUT=30000
VITE_ENABLE_CACHE=true
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=false
```

### Production (.env.production)
```env
VITE_API_BASE_URL=https://api.sansekai.my.id/api
VITE_API_TIMEOUT=30000
VITE_ENABLE_CACHE=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
VITE_APP_VERSION=1.0.0
```

---

## 📊 Post-Deployment Checklist

Setelah deployment, pastikan:

- ✅ Website dapat diakses via domain/URL
- ✅ HTTPS berjalan dengan baik
- ✅ API calls berfungsi normal
- ✅ Video player dapat streaming
- ✅ Search functionality works
- ✅ Mobile responsive
- ✅ Meta tags muncul di social media
- ✅ Console tidak ada error
- ✅ Lighthouse score > 90

---

## 🔍 Testing Production Build

### Test Locally
```bash
# Build
pnpm build

# Preview
pnpm preview

# Open http://localhost:4173
```

### Test Performance
```bash
# Lighthouse CI
npm i -g @lhci/cli
lhci autorun --upload.target=temporary-public-storage
```

---

## 🐛 Troubleshooting

### Build Errors

**Error: "Out of memory"**
```bash
# Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" pnpm build
```

**Error: "Module not found"**
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Runtime Errors

**API CORS issues:**
- Pastikan API endpoint mendukung CORS
- Gunakan proxy jika diperlukan
- Check browser console untuk detail error

**Video tidak play:**
- Pastikan HLS.js ter-load dengan benar
- Check video URL valid
- Test di browser yang berbeda

---

## 🔐 Security Recommendations

1. **Environment Variables**
   - Jangan commit `.env` ke Git
   - Gunakan secrets management
   - Rotate secrets secara berkala

2. **HTTPS**
   - Always use HTTPS in production
   - Enable HSTS headers
   - Use secure cookies

3. **Content Security Policy**
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;
               connect-src 'self' https://api.sansekai.my.id;">
```

4. **Rate Limiting**
   - Implement rate limiting untuk API calls
   - Use cache aggressively
   - Implement request throttling

---

## 📈 Monitoring & Analytics

### Setup Google Analytics

1. Dapatkan Tracking ID dari Google Analytics
2. Update `src/app/lib/analytics.ts`
3. Set `VITE_ENABLE_ANALYTICS=true`

### Setup Sentry (Error Tracking)

```bash
pnpm add @sentry/react
```

Update `src/app/lib/analytics.ts`:
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: ENV.isProduction ? "production" : "development",
});
```

---

## 🎯 Performance Optimization

### CDN Setup
- Use CDN untuk static assets
- Enable gzip/brotli compression
- Implement image optimization

### Caching Strategy
```nginx
# Nginx cache headers
location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location / {
    add_header Cache-Control "no-cache, must-revalidate";
}
```

### Service Worker (Optional)
Untuk offline support, implement service worker:
```bash
pnpm add workbox-precaching workbox-routing
```

---

## 📱 Mobile App (Optional)

Convert to mobile app using:
- **Capacitor** (recommended)
- **React Native Web**
- **PWA** (Progressive Web App)

---

## 🆘 Support & Maintenance

### Monitoring
- Setup uptime monitoring (UptimeRobot, Pingdom)
- Monitor API response times
- Track error rates
- Monitor user analytics

### Updates
```bash
# Update dependencies
pnpm update

# Check for security vulnerabilities
pnpm audit

# Build and test
pnpm build && pnpm preview
```

---

## 📞 Contact

Jika ada pertanyaan atau butuh bantuan deployment:
- Email: support@terasdracin.com
- GitHub Issues: [Create Issue](https://github.com/yourrepo/issues)

---

**Happy Deploying! 🚀**
