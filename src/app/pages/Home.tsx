import { useEffect, useState } from 'react';
import HeroBanner from '../components/HeroBanner';
import DramaRow from '../components/DramaRow';
import { Drama } from '../lib/api';
import { DramaService } from '../lib/dramaService';
import { Loader2 } from 'lucide-react';
import { HeroBannerSkeleton, DramaRowSkeleton } from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';

export default function Home() {
  const [heroData, setHeroData] = useState<Drama | null>(null);
  const [trending, setTrending] = useState<Drama[]>([]);
  const [latest, setLatest] = useState<Drama[]>([]);
  const [forYou, setForYou] = useState<Drama[]>([]);
  const [dubIndo, setDubIndo] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use service layer to fetch all home data
      const homeData = await DramaService.getHomeData();

      setTrending(homeData.trending);
      setLatest(homeData.latest);
      setForYou(homeData.forYou);
      setDubIndo(homeData.dubIndo);

      // Use first trending item for hero banner
      if (homeData.trending.length > 0) {
        setHeroData(homeData.trending[0]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Gagal memuat konten. Silakan periksa koneksi internet Anda.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="pb-12">
        <HeroBannerSkeleton />
        <div className="relative -mt-32 z-10 space-y-8">
          <DramaRowSkeleton />
          <DramaRowSkeleton />
          <DramaRowSkeleton />
          <DramaRowSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message={error} onRetry={fetchData} />
      </div>
    );
  }

  return (
    <div className="pb-12">
      {heroData && <HeroBanner drama={heroData} />}
      <div className="relative -mt-32 z-10 space-y-8">
        {trending.length > 0 && <DramaRow title="🔥 Trending Sekarang" dramas={trending} />}
        {forYou.length > 0 && <DramaRow title="✨ Untukmu" dramas={forYou} />}
        {latest.length > 0 && <DramaRow title="🆕 Baru Dirilis" dramas={latest} />}
        {dubIndo.length > 0 && <DramaRow title="🇮🇩 Dubbing Indonesia" dramas={dubIndo} />}
      </div>
    </div>
  );
}