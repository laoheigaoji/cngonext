export default function Loading() {
  return (
    <div className="w-full bg-[#f9f9f9] pb-20">
      {/* Hero Banner - 直接显示 */}
      <section className="relative h-[400px] flex items-center pt-16 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://static.tripcngo.com/ing/Fbanner_bg_2.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="max-w-[1240px] w-full mx-auto px-6 relative z-10 text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
            Explore China
          </h1>
          <p className="text-white/95 text-base max-w-3xl drop-shadow-md">
            Discover the best destinations across China
          </p>
        </div>
      </section>

      {/* Intro Section - 直接显示 */}
      <div className="max-w-[1240px] mx-auto px-6 mt-12 bg-[#f5fff9] rounded border border-green-500 border-dashed p-8 mb-12">
        <div className="text-center mb-6">
          <h2 className="text-[28px] font-bold text-green-600 inline-block">China Travel Guide</h2>
        </div>
        <div className="space-y-4 text-[15px] text-gray-700 leading-[1.8]">
          <div className="h-4 bg-gray-200/40 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-200/30 rounded w-5/6 animate-pulse" />
          <div className="h-4 bg-gray-200/40 rounded w-full animate-pulse" />
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6,7,8,9].map(i => (
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
