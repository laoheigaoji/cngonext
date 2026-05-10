export default function Loading() {
  return (
    <div className="w-full bg-[#f9f9f9] min-h-screen pb-20">
      {/* Hero skeleton */}
      <section className="relative h-[400px] bg-gray-900 animate-pulse" />

      {/* Content skeleton */}
      <div className="max-w-[1240px] mx-auto px-6 mt-8 space-y-8">
        {/* Intro skeleton */}
        <div className="bg-[#f5fff9] rounded border border-green-500 border-dashed p-8 space-y-4">
          <div className="h-8 bg-gray-200/40 rounded w-1/3 mx-auto" />
          <div className="h-4 bg-gray-200/30 rounded w-full" />
          <div className="h-4 bg-gray-200/30 rounded w-5/6" />
        </div>

        {/* Cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white rounded-md border border-gray-100 overflow-hidden h-[300px] flex flex-col shadow-sm animate-pulse">
              <div className="bg-gray-200 h-[240px] w-full" />
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-center">
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
