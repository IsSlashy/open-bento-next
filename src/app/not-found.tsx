import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-zinc-900 px-4">
      <h1 className="text-8xl font-bold text-gray-100 dark:text-zinc-800">404</h1>
      <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
        Page not found
      </h2>
      <p className="mt-2 text-gray-500 dark:text-gray-400 text-center max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
      >
        Go home
      </Link>
    </div>
  );
}
