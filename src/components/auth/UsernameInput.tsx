'use client';

import { useState, useEffect, useCallback } from 'react';
import { Check, X, Loader2 } from 'lucide-react';

interface UsernameInputProps {
  value: string;
  onChange: (value: string) => void;
  onAvailabilityChange?: (available: boolean) => void;
}

export function UsernameInput({ value, onChange, onAvailabilityChange }: UsernameInputProps) {
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');

  const checkAvailability = useCallback(
    async (username: string) => {
      if (username.length < 3) {
        setStatus('invalid');
        onAvailabilityChange?.(false);
        return;
      }

      if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        setStatus('invalid');
        onAvailabilityChange?.(false);
        return;
      }

      setStatus('checking');
      try {
        const res = await fetch(`/api/username/check?username=${encodeURIComponent(username)}`);
        const data = await res.json();
        setStatus(data.available ? 'available' : 'taken');
        onAvailabilityChange?.(data.available);
      } catch {
        setStatus('idle');
        onAvailabilityChange?.(false);
      }
    },
    [onAvailabilityChange]
  );

  useEffect(() => {
    if (!value || value.length < 3) {
      setStatus(value ? 'invalid' : 'idle');
      onAvailabilityChange?.(false);
      return;
    }

    const timer = setTimeout(() => checkAvailability(value), 500);
    return () => clearTimeout(timer);
  }, [value, checkAvailability, onAvailabilityChange]);

  return (
    <div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.toLowerCase())}
          placeholder="username"
          className="w-full pl-8 pr-10 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          maxLength={30}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {status === 'checking' && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
          {status === 'available' && <Check className="w-4 h-4 text-green-500" />}
          {status === 'taken' && <X className="w-4 h-4 text-red-500" />}
          {status === 'invalid' && value && <X className="w-4 h-4 text-yellow-500" />}
        </div>
      </div>
      <div className="mt-1 text-xs">
        {status === 'available' && <span className="text-green-600">Username is available</span>}
        {status === 'taken' && <span className="text-red-600">Username is already taken</span>}
        {status === 'invalid' && value && (
          <span className="text-yellow-600">
            {value.length < 3
              ? 'Username must be at least 3 characters'
              : 'Only letters, numbers, hyphens and underscores'}
          </span>
        )}
      </div>
    </div>
  );
}
