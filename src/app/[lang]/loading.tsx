export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f7]">
      {/* Navbar skeleton */}
      <div className="h-16 bg-gray-200/50 animate-pulse" />
      
      {/* Hero skeleton */}
      <div className="px-4 pt-8 pb-6 max-w-6xl mx-auto w-full">
        <div className="h-8 bg-gray-200/60 rounded-lg w-2/3 mb-4 animate-pulse" />
        <div className="h-4 bg-gray-200/40 rounded w-1/2 mb-8 animate-pulse" />
        
        {/* Search bar skeleton */}
        <div className="h-12 bg-gray-200/50 rounded-full w-full max-w-xl animate-pulse" />
      </div>
      
      {/* Cards skeleton */}
      <div className="px-4 max-w-6xl mx-auto w-full">
        <div className="h-6 bg-gray-200/40 rounded w-24 mb-4 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="rounded-xl overflow-hidden">
              <div className="aspect-[4/3] bg-gray-200/50 animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200/40 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-gray-200/30 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
