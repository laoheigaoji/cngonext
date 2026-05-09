export default function Loading() {
  return (
    <div className="w-full bg-[#f7f7f7]">
      {/* Hero Header - 直接显示 */}
      <section className="relative h-[480px] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://static.tripcngo.com/ing/banner_bg_1.jpg" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 text-left">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Travel Guides
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl leading-relaxed font-medium">
            From mastering mobile payments to high-speed rail, our practical guides cover everything you need to know.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - 直接显示分类 */}
          <div className="w-full lg:w-[300px] shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-32">
              <div className="p-2 space-y-1">
                {[1,2,3,4,5,6,7,8].map(i => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 bg-gray-200/60 rounded animate-pulse" />
                      <div className="h-4 bg-gray-200/50 rounded w-20 animate-pulse" />
                    </div>
                    <div className="h-4 bg-gray-200/40 rounded w-6 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Articles skeleton */}
          <div className="flex-1 space-y-6">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row h-[220px] animate-pulse">
                <div className="md:w-[340px] h-full bg-gray-200" />
                <div className="flex-1 p-8 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-8 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
