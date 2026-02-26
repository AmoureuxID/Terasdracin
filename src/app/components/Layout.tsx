import { Outlet } from 'react-router';
import Navbar from './Navbar';
import ScrollToTop from './ScrollToTop';

export default function Layout() {
  return (
    <div className="min-h-screen bg-black text-white">
      <ScrollToTop />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-gray-800 py-8 px-4 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          <p className="mb-2">© 2025 Teras Dracin. Platform Streaming Drama.</p>
          <p className="text-sm">
            Powered by{' '}
            <a
              href="https://api.sansekai.my.id"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-500 transition"
            >
              Sansekai API
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}