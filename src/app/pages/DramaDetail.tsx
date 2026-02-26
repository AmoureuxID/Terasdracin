import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { dramaboxAPI, DramaDetail as DramaDetailType } from '../lib/api';
import { Play, ArrowLeft, Loader2 } from 'lucide-react';

export default function DramaDetail() {
  const { bookId } = useParams<{ bookId: string }>();
  const [drama, setDrama] = useState<DramaDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      if (!bookId) return;
      
      try {
        setLoading(true);
        const detailRes = await dramaboxAPI.detail(bookId);
        const dramaData = detailRes?.data || detailRes;
        
        // Fetch all episodes
        const episodesRes = await dramaboxAPI.allEpisodes(bookId);
        const episodesData = Array.isArray(episodesRes) ? episodesRes : episodesRes?.data || [];
        
        setDrama({
          ...dramaData,
          episodes: episodesData,
        });
      } catch (error) {
        console.error('Error fetching drama detail:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [bookId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-red-600" />
      </div>
    );
  }

  if (!drama) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Drama tidak ditemukan</p>
      </div>
    );
  }

  const coverImage = drama.coverHorizontal || drama.cover || drama.posterUrl;
  const title = drama.title || drama.name || 'Untitled';
  const description = drama.introduction || drama.description || '';

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <div className="absolute inset-0">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        <div className="relative h-full flex items-end px-4 md:px-12 lg:px-16 pb-8">
          <div className="max-w-3xl">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-4">
              <ArrowLeft className="w-5 h-5" />
              Kembali
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{title}</h1>
            {drama.score && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-yellow-400">★</span>
                <span>{drama.score}/10</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="px-4 md:px-12 lg:px-16 py-8">
        <div className="max-w-6xl">
          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Sinopsis</h2>
            <p className="text-gray-300 leading-relaxed">{description}</p>
          </div>

          {/* Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {drama.episodeCount && (
              <div>
                <span className="text-gray-400">Total Episode:</span>
                <span className="ml-2">{drama.episodeCount} Episode</span>
              </div>
            )}
            {drama.tags && drama.tags.length > 0 && (
              <div>
                <span className="text-gray-400">Genre:</span>
                <span className="ml-2">{drama.tags.join(', ')}</span>
              </div>
            )}
            {drama.category && drama.category.length > 0 && (
              <div>
                <span className="text-gray-400">Kategori:</span>
                <span className="ml-2">{drama.category.join(', ')}</span>
              </div>
            )}
          </div>

          {/* Episodes */}
          {drama.episodes && drama.episodes.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Episode</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {drama.episodes.map((episode, index) => (
                  <Link
                    key={episode.episodeId || episode.chapterId || index}
                    to={`/watch/${bookId}/${index}`}
                    className="bg-gray-800 hover:bg-gray-700 rounded p-4 flex flex-col items-center justify-center gap-2 transition group"
                  >
                    <Play className="w-8 h-8 text-gray-400 group-hover:text-white transition" />
                    <span className="text-sm">Episode {index + 1}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}