import { useEffect, useState } from 'react';
import HeroBanner from '../components/HeroBanner';
import DramaRow from '../components/DramaRow';
import { dramaboxAPI, Drama } from '../lib/api';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [heroData, setHeroData] = useState<Drama | null>(null);
  const [trending, setTrending] = useState<Drama[]>([]);
  const [latest, setLatest] = useState<Drama[]>([]);
  const [forYou, setForYou] = useState<Drama[]>([]);
  const [dubIndo, setDubIndo] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [trendingRes, latestRes, forYouRes, dubIndoRes] = await Promise.all([
          dramaboxAPI.trending(),
          dramaboxAPI.latest(),
          dramaboxAPI.forYou(1),
          dramaboxAPI.dubIndo('terpopuler', 1),
        ]);

        // Set data from responses
        const trendingData = Array.isArray(trendingRes) ? trendingRes : trendingRes?.data || [];
        const latestData = Array.isArray(latestRes) ? latestRes : latestRes?.data || [];
        const forYouData = Array.isArray(forYouRes) ? forYouRes : forYouRes?.data || [];
        const dubIndoData = Array.isArray(dubIndoRes) ? dubIndoRes : dubIndoRes?.data || [];

        setTrending(trendingData);
        setLatest(latestData);
        setForYou(forYouData);
        setDubIndo(dubIndoData);

        // Use first trending item for hero banner
        if (trendingData.length > 0) {
          setHeroData(trendingData[0]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-red-600" />
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
