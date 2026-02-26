import { Link } from 'react-router';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-red-600 mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-2">Halaman Tidak Ditemukan</h2>
        <p className="text-gray-400 mb-8">
          Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded transition"
          >
            <Home className="w-5 h-5" />
            Kembali ke Beranda
          </Link>
          <Link
            to="/search"
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded transition"
          >
            <Search className="w-5 h-5" />
            Cari Drama
          </Link>
        </div>
      </div>
    </div>
  );
}
