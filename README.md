# Teras Dracin - Platform Streaming Drama

Platform streaming drama modern ala Netflix dengan konten dari DramaBox melalui API Sansekai.

## 🚀 Fitur Utama

- **Homepage Dinamis**: Hero banner, trending, latest, for you, dan dubbing Indonesia
- **Detail Drama**: Informasi lengkap drama dengan grid episode
- **Video Player**: HLS streaming dengan kualitas adaptif
- **Pencarian**: Search real-time untuk menemukan drama favorit
- **Responsive Design**: Optimal di desktop, tablet, dan mobile
- **Error Handling**: Robust error handling dengan retry logic
- **Caching**: Smart caching untuk performa optimal
- **SEO Optimized**: Meta tags lengkap untuk SEO

## 🛠️ Tech Stack

- **React 18** - UI Library
- **TypeScript** - Type Safety
- **React Router 7** - Multi-page Navigation
- **Tailwind CSS 4** - Styling
- **HLS.js** - Video Streaming
- **Motion** - Animations
- **Vite** - Build Tool

## 📦 Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 🌐 API Integration

Aplikasi ini menggunakan API dari Sansekai:
- Base URL: `https://api.sansekai.my.id/api`
- Platform: DramaBox

### Endpoints yang Digunakan:
- `/dramabox/trending` - Drama trending
- `/dramabox/latest` - Drama terbaru
- `/dramabox/foryou` - Rekomendasi personal
- `/dramabox/dubindo` - Dubbing Indonesia
- `/dramabox/detail` - Detail drama
- `/dramabox/allepisode` - Semua episode
- `/dramabox/search` - Pencarian

## ⚙️ Configuration

### Environment Variables

Buat file `.env` dengan konfigurasi berikut:

```env
# API Configuration
VITE_API_BASE_URL=https://api.sansekai.my.id/api
VITE_API_TIMEOUT=30000

# Feature Flags
VITE_ENABLE_CACHE=true
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=false

# App Info
VITE_APP_VERSION=1.0.0
```

### Constants Configuration

Edit `/src/app/lib/constants.ts` untuk mengubah:
- API timeouts dan retry logic
- Cache durations
- SEO metadata
- Video player settings
- Error messages

## 📁 Struktur Project

```
src/
├── app/
│   ├── components/          # React components
│   │   ├── DramaCard.tsx
│   │   ├── DramaRow.tsx
│   │   ├── HeroBanner.tsx
│   │   ├── VideoPlayer.tsx
│   │   ├── Navbar.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── Home.tsx
│   │   ├── DramaDetail.tsx
│   │   ├── Watch.tsx
│   │   ├── Search.tsx
│   │   └── NotFound.tsx
│   ├── lib/                # Utilities & services
│   │   ├── api.ts          # API client with caching
│   │   ├── dramaService.ts # Service layer
│   │   ├── constants.ts    # App constants
│   │   ├── env.ts          # Environment config
│   │   ├── hooks.ts        # Custom hooks
│   │   ├── storage.ts      # Local storage manager
│   │   ├── analytics.ts    # Analytics utilities
│   │   └── utils.ts        # Helper functions
│   ├── routes.tsx          # Router configuration
│   └── App.tsx             # Main app component
├── styles/                 # Global styles
└── index.tsx               # App entry point
```

## 🎯 Fitur Production-Ready

### 1. **API Layer yang Robust**
- Request timeout handling
- Automatic retry dengan exponential backoff
- Smart caching untuk reduce API calls
- Network status monitoring
- User-friendly error messages dalam Bahasa Indonesia

### 2. **Performance Optimization**
- Code splitting dengan manual chunks
- Lazy loading untuk komponen besar
- Image optimization
- Prefetch untuk API endpoints
- Service worker ready

### 3. **Error Handling**
- Error Boundary untuk catch React errors
- Graceful degradation
- Retry mechanisms
- User-friendly error messages
- Error reporting (optional)

### 4. **Caching Strategy**
- In-memory cache dengan TTL
- Automatic cache expiration
- Cache invalidation
- Configurable cache duration

### 5. **SEO Optimization**
- Dynamic meta tags
- Open Graph tags
- Twitter Card tags
- Structured data ready
- Sitemap ready

### 6. **User Experience**
- Loading skeletons
- Smooth animations
- Responsive design
- Hover effects
- Scroll to top functionality

## 🔧 Production Deployment

### Build Process

```bash
# Build for production
pnpm build

# Output akan ada di folder dist/
```

### Deployment Platforms

Aplikasi dapat di-deploy ke berbagai platform:

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Netlify
```bash
# Build command: pnpm build
# Publish directory: dist
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build
CMD ["pnpm", "preview"]
```

### Environment Setup

Untuk production, pastikan set environment variables:
```bash
VITE_API_BASE_URL=https://api.sansekai.my.id/api
VITE_ENABLE_CACHE=true
```

## 📊 Monitoring & Analytics

Aplikasi sudah siap untuk integrasi dengan:
- Google Analytics
- Sentry (Error Tracking)
- PostHog / Mixpanel (Product Analytics)

Edit `/src/app/lib/analytics.ts` untuk enable tracking.

## 🔒 Security

- No sensitive data stored in frontend
- API calls through secure HTTPS
- Content Security Policy ready
- XSS protection
- CORS handling

## 🐛 Troubleshooting

### API Timeout
Jika API sering timeout, tingkatkan timeout di `constants.ts`:
```typescript
export const API_CONFIG = {
  TIMEOUT: 60000, // 60 seconds
}
```

### Cache Issues
Clear cache dengan:
```typescript
import { dramaboxAPI } from './lib/api';
dramaboxAPI.clearCache();
```

### Video Player Issues
Pastikan HLS.js compatible dengan browser:
- Chrome: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Native HLS support
- Edge: ✅ Full support

## 📝 License

This project is for educational purposes only. Respect the API provider's terms of service.

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📧 Support

Untuk bantuan atau pertanyaan:
- Email: support@terasdracin.com (ganti dengan email Anda)
- Issues: GitHub Issues
- Documentation: README.md

## 🎉 Credits

- API Provider: [Sansekai](https://api.sansekai.my.id)
- Content Source: DramaBox
- Design Inspiration: Netflix

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
