export default function CategoryLoading() {
  return (
    <div>
      <div className="bg-[var(--primary-container)] border-b border-[var(--outline-variant)]">
        <div className="max-w-content mx-auto px-4 md:px-16 py-16">
          <div className="skeleton h-3 w-32 mb-4 rounded" />
          <div className="skeleton h-12 w-80 mb-4 rounded" />
          <div className="skeleton h-5 w-full max-w-xl mb-2 rounded" />
          <div className="skeleton h-5 w-3/4 max-w-xl rounded" />
        </div>
      </div>
      <div className="max-w-content mx-auto px-4 md:px-16 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-lg overflow-hidden bg-[var(--surface-container)]">
              <div className="skeleton aspect-video" />
              <div className="p-5 space-y-2">
                <div className="skeleton h-3 w-16 rounded" />
                <div className="skeleton h-5 w-full rounded" />
                <div className="skeleton h-5 w-4/5 rounded" />
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-3 w-24 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
