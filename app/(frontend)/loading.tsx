export default function Loading() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-16 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
        <div className="lg:col-span-8">
          <div className="skeleton aspect-video rounded-lg mb-4" />
          <div className="skeleton h-4 w-24 mb-3 rounded" />
          <div className="skeleton h-8 w-full mb-2 rounded" />
          <div className="skeleton h-8 w-3/4 mb-4 rounded" />
          <div className="skeleton h-4 w-full mb-2 rounded" />
          <div className="skeleton h-4 w-5/6 rounded" />
        </div>
        <div className="lg:col-span-4 flex flex-col gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="skeleton h-3 w-16 rounded" />
              <div className="skeleton h-5 w-full rounded" />
              <div className="skeleton h-5 w-4/5 rounded" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg overflow-hidden bg-[var(--surface-container)]">
            <div className="skeleton aspect-video" />
            <div className="p-4 space-y-2">
              <div className="skeleton h-3 w-16 rounded" />
              <div className="skeleton h-5 w-full rounded" />
              <div className="skeleton h-5 w-4/5 rounded" />
              <div className="skeleton h-3 w-24 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
