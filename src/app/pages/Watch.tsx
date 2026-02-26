import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { dramaboxAPI, DramaDetail as DramaDetailType, Episode } from '../lib/api';
import VideoPlayer from '../components/VideoPlayer';
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export default function Watch() {
  const { bookId, episodeIndex } = useParams<{ bookId: string; episodeIndex: string }>();
  const navigate = useNavigate();
  const [drama, setDrama] = useState<DramaDetailType | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);

  const currentIndex = parseInt(episodeIndex || '0');

  useEffect(() => {
    async function fetchData() {
      if (!bookId) return;

      try {
        setLoading(true);
        const [detailRes, episodesRes] = await Promise.all([
          dramaboxAPI.detail(bookId),
          dramaboxAPI.allEpisodes(bookId),
        ]);

        const dramaData = detailRes?.data || detailRes;
        const episodesData = Array.isArray(episodesRes) ? episodesRes : episodesRes?.data || [];

        setDrama({
          ...dramaData,
          episodes: episodesData,
        });

        if (episodesData[currentIndex]) {
          setCurrentEpisode(episodesData[currentIndex]);
        }
      } catch (error) {
        console.error('Error fetching watch data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [bookId, currentIndex]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      navigate(`/watch/${bookId}/${currentIndex - 1}`);
    }
  };

  const handleNext = () => {
    if (drama?.episodes && currentIndex < drama.episodes.length - 1) {
      navigate(`/watch/${bookId}/${currentIndex + 1}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-red-600" />
      </div>
    );
  }

  if (!drama || !currentEpisode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Episode tidak ditemukan</p>
      </div>
    );
  }

  const title = drama.title || drama.name || 'Untitled';
  const streamUrl = currentEpisode.streamUrl || 
                   (currentEpisode.definition && currentEpisode.definition[0]?.url) || '';

  const hasPrevious = currentIndex > 0;
  const hasNext = drama.episodes && currentIndex < drama.episodes.length - 1;

  return (
    <div className="min-h-screen pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <Link 
          to={`/drama/${bookId}`}
          className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali ke Detail
        </Link>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>
        <p className="text-gray-400 mb-6">Episode {currentIndex + 1}</p>

        {/* Video Player */}
        <div className="mb-8">
          {streamUrl ? (
            <VideoPlayer 
              src={streamUrl} 
              poster={drama.coverHorizontal || drama.cover || drama.posterUrl}
            />
          ) : (
            <div className="w-full aspect-video bg-gray-800 flex items-center justify-center">
              <p className="text-gray-400">Video tidak tersedia</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handlePrevious}
            disabled={!hasPrevious}
            className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed rounded transition"
          >
            <ChevronLeft className="w-5 h-5" />
            Episode Sebelumnya
          </button>
          <button
            onClick={handleNext}
            disabled={!hasNext}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed rounded transition"
          >
            Episode Selanjutnya
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Episode List */}
        {drama.episodes && drama.episodes.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Semua Episode</h2>
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {drama.episodes.map((episode, index) => (
                <button
                  key={episode.episodeId || episode.chapterId || index}
                  onClick={() => navigate(`/watch/${bookId}/${index}`)}
                  className={`p-4 rounded transition ${
                    index === currentIndex
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}