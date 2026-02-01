import Link from 'next/link';

export default function ProfileNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-900 px-4">
      <h1 className="text-6xl font-bold text-gray-200 dark:text-zinc-700">404</h1>
      <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
        Profile not found
      </h2>
      <p className="mt-2 text-gray-500 dark:text-gray-400 text-center">
        This profile doesn&apos;t exist or is private.
      </p>
      <Link
        href="/"
        className="mt-6 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
      >
        Go home
      </Link>
    </div>
  );
}
