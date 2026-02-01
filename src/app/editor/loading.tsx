export default function EditorLoading() {
  return (
    <div className="flex h-screen">
      {/* Sidebar skeleton */}
      <div className="w-80 bg-white dark:bg-zinc-900 border-r border-gray-100 dark:border-zinc-800 p-6">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-zinc-800 animate-pulse" />
          <div className="mt-4 w-32 h-5 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="mt-2 w-48 h-4 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="flex gap-2 mt-3">
            <div className="w-14 h-6 bg-gray-200 dark:bg-zinc-800 rounded-full animate-pulse" />
            <div className="w-14 h-6 bg-gray-200 dark:bg-zinc-800 rounded-full animate-pulse" />
            <div className="w-14 h-6 bg-gray-200 dark:bg-zinc-800 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="flex-1 p-8 bg-gray-50 dark:bg-zinc-900">
        <div className="grid grid-cols-12 gap-4 max-w-4xl mx-auto">
          <div className="col-span-12 h-12 bg-gray-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
          <div className="col-span-3 aspect-square bg-gray-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
          <div className="col-span-3 aspect-square bg-gray-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
          <div className="col-span-3 aspect-square bg-gray-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
          <div className="col-span-3 aspect-square bg-gray-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
          <div className="col-span-12 h-12 bg-gray-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
          <div className="col-span-6 h-40 bg-gray-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
          <div className="col-span-6 h-40 bg-gray-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
