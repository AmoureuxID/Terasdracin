import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DramaCard from './DramaCard';
import { Drama } from '../lib/api';

interface DramaRowProps {
  title: string;
  dramas: Drama[];
}

export default function DramaRow({ title, dramas }: DramaRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = direction === 'left' ? -800 : 800;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!dramas || dramas.length === 0) return null;

  return (
    <div className="px-4 md:px-12 lg:px-16 mb-8 group/row">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">{title}</h2>
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-black/50 opacity-0 group-hover/row:opacity-100 hover:bg-black/70 transition-all flex items-center justify-center"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        {/* Scrollable Row */}
        <div
          ref={rowRef}
          className="flex gap-2 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {dramas.map((drama) => (
            <div key={drama.bookId} className="flex-none w-32 md:w-48">
              <DramaCard drama={drama} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-black/50 opacity-0 group-hover/row:opacity-100 hover:bg-black/70 transition-all flex items-center justify-center"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
