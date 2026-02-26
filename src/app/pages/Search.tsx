import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Drama } from '../lib/api';
import { DramaService } from '../lib/dramaService';
import DramaCard from '../components/DramaCard';
import { Loader2, Search as SearchIcon } from 'lucide-react';
import { DramaCardSkeleton } from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchDramas = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await DramaService.search(query);
      setResults(data);
    } catch (error) {
      console.error('Error searching dramas:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Gagal melakukan pencarian. Silakan coba lagi.';
      setError(errorMessage);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchDramas();
  }, [query]);

  return (
    <div className="min-h-screen pt-24 px-4 md:px-12 lg:px-16 pb-12">
      <h1 className="text-3xl font-bold mb-2">Hasil Pencarian</h1>
      {query && (
        <p className="text-gray-400 mb-8">
          Menampilkan hasil untuk: <span className="text-white">"{query}"</span>
        </p>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <DramaCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorMessage message={error} onRetry={searchDramas} />
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {results.map((drama) => (
            <DramaCard key={drama.bookId} drama={drama} />
          ))}
        </div>
      ) : query ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <SearchIcon className="w-16 h-16 mb-4" />
          <p>Tidak ada hasil yang ditemukan untuk "{query}"</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <SearchIcon className="w-16 h-16 mb-4" />
          <p>Mulai mencari drama favoritmu</p>
        </div>
      )}
    </div>
  );
}