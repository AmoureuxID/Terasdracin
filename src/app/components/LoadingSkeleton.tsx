export function DramaCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[2/3] bg-gray-800 rounded" />
      <div className="mt-2 h-4 bg-gray-800 rounded w-3/4" />
    </div>
  );
}

export function DramaRowSkeleton() {
  return (
    <div className="px-4 md:px-12 lg:px-16 mb-8">
      <div className="h-6 bg-gray-800 rounded w-48 mb-4 animate-pulse" />
      <div className="flex gap-2 md:gap-4 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex-none w-32 md:w-48">
            <DramaCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroBannerSkeleton() {
  return (
    <div className="relative h-[70vh] md:h-[85vh] w-full bg-gray-900 animate-pulse">
      <div className="absolute bottom-0 left-0 px-4 md:px-12 lg:px-16 pb-8">
        <div className="h-12 bg-gray-800 rounded w-96 mb-4" />
        <div className="h-4 bg-gray-800 rounded w-72 mb-2" />
        <div className="h-4 bg-gray-800 rounded w-64 mb-6" />
        <div className="flex gap-4">
          <div className="h-12 bg-gray-800 rounded w-32" />
          <div className="h-12 bg-gray-800 rounded w-32" />
        </div>
      </div>
    </div>
  );
}
