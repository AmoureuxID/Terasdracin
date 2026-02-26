import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { dramaboxAPI, Drama } from '../lib/api';
import DramaCard from '../components/DramaCard';
import { Loader2, Search as SearchIcon } from 'lucide-react';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function searchDramas() {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        const response = await dramaboxAPI.search(query);
        const data = Array.isArray(response) ? response : response?.data || [];
        setResults(data);
      } catch (error) {
        console.error('Error searching dramas:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

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
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-12 h-12 animate-spin text-red-600" />
        </div>
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
