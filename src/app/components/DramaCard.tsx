import { Link } from 'react-router';
import { Drama } from '../lib/api';
import { Play } from 'lucide-react';
import { useState } from 'react';

interface DramaCardProps {
  drama: Drama;
}

export default function DramaCard({ drama }: DramaCardProps) {
  const [imageError, setImageError] = useState(false);
  const coverImage = drama.coverVertical || drama.cover || drama.posterUrl;
  const title = drama.title || drama.name || 'Untitled';

  return (
    <Link to={`/drama/${drama.bookId}`} className="group relative block">
      <div className="relative aspect-[2/3] rounded overflow-hidden bg-gray-800">
        {!imageError && coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <Play className="w-16 h-16" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Play className="w-12 h-12 text-white fill-white" />
        </div>
      </div>
      <h3 className="mt-2 text-sm md:text-base line-clamp-2">{title}</h3>
    </Link>
  );
}