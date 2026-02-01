'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { UsernameInput } from '@/components/auth/UsernameInput';

export default function OnboardingPage() {
  const { update } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameAvailable) return;

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/username/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to set username');
        return;
      }

      // Update session with new username
      await update({ username });
      router.push('/editor');
      router.refresh();
    } catch {
      setError('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Choose your username</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          This will be your public profile URL
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <UsernameInput
          value={username}
          onChange={setUsername}
          onAvailabilityChange={setUsernameAvailable}
        />

        {username && usernameAvailable && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your profile will be at <strong>openbento.me/{username}</strong>
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading || !usernameAvailable}
          className="w-full px-4 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Setting up...' : 'Continue'}
        </button>
      </form>
    </div>
  );
}
