export default function ArticleLoading() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-16 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <div className="skeleton h-3 w-48 mb-8 rounded" />
          <div className="skeleton h-4 w-20 mb-4 rounded" />
          <div className="skeleton h-10 w-full mb-2 rounded" />
          <div className="skeleton h-10 w-4/5 mb-8 rounded" />
          <div className="flex items-center gap-4 mb-8">
            <div className="skeleton w-10 h-10 rounded-full" />
            <div className="space-y-1">
              <div className="skeleton h-3 w-24 rounded" />
              <div className="skeleton h-2 w-16 rounded" />
            </div>
          </div>
          <div className="skeleton aspect-video rounded-lg mb-10" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className={`skeleton h-4 rounded ${i % 3 === 0 ? 'w-4/5' : 'w-full'}`} />
            ))}
          </div>
        </div>
        <div className="lg:col-span-4 space-y-6">
          <div className="skeleton h-48 rounded-lg" />
          <div className="skeleton h-36 rounded-lg" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="skeleton w-20 h-20 rounded-lg flex-none" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-3 w-16 rounded" />
                  <div className="skeleton h-4 w-full rounded" />
                  <div className="skeleton h-4 w-3/4 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
