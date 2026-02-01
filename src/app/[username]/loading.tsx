export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Profile skeleton */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-zinc-800 animate-pulse" />
          <div className="mt-4 w-40 h-6 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="mt-2 w-60 h-4 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="flex gap-2 mt-3">
            <div className="w-16 h-6 bg-gray-200 dark:bg-zinc-800 rounded-full animate-pulse" />
            <div className="w-16 h-6 bg-gray-200 dark:bg-zinc-800 rounded-full animate-pulse" />
            <div className="w-16 h-6 bg-gray-200 dark:bg-zinc-800 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Cards skeleton */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 h-10 bg-gray-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
          <div className="col-span-3 aspect-square bg-gray-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
          <div className="col-span-3 aspect-square bg-gray-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
          <div className="col-span-3 aspect-square bg-gray-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
          <div className="col-span-3 aspect-square bg-gray-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
          <div className="col-span-6 h-40 bg-gray-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
          <div className="col-span-6 h-40 bg-gray-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
