import { Link, useNavigate } from 'react-router';
import { Search, Play } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black via-black/80 to-transparent">
      <div className="px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <Play className="w-8 h-8 text-red-600 fill-red-600" />
            <span className="text-2xl font-bold text-red-600">TERAS DRACIN</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="hover:text-gray-300 transition">Beranda</Link>
            <Link to="/search" className="hover:text-gray-300 transition">Cari</Link>
          </div>
        </div>
        
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari drama..."
              className="bg-black/50 border border-gray-700 rounded px-4 py-2 pl-10 w-48 md:w-64 focus:outline-none focus:border-red-600 transition"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </form>
      </div>
    </nav>
  );
}
