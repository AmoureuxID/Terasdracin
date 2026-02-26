import { Play, Info } from 'lucide-react';
import { Link } from 'react-router';
import { Drama } from '../lib/api';
import { useState } from 'react';

interface HeroBannerProps {
  drama: Drama;
}

export default function HeroBanner({ drama }: HeroBannerProps) {
  const [imageError, setImageError] = useState(false);
  const coverImage = drama.coverHorizontal || drama.cover || drama.posterUrl;
  const title = drama.title || drama.name || 'Untitled';
  const description = drama.introduction || drama.description || '';

  return (
    <div className="relative h-[70vh] md:h-[85vh] w-full">
      {/* Background Image */}
      <div className="absolute inset-0">
        {!imageError && coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center px-4 md:px-12 lg:px-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">{title}</h1>
          <p className="text-base md:text-lg text-gray-300 mb-6 line-clamp-3 max-w-xl">
            {description}
          </p>
          <div className="flex items-center gap-4">
            <Link
              to={`/drama/${drama.bookId}`}
              className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded hover:bg-gray-200 transition font-semibold"
            >
              <Play className="w-5 h-5 fill-black" />
              Putar
            </Link>
            <Link
              to={`/drama/${drama.bookId}`}
              className="flex items-center gap-2 bg-gray-500/50 text-white px-6 py-3 rounded hover:bg-gray-500/70 transition font-semibold"
            >
              <Info className="w-5 h-5" />
              Info Lebih
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}