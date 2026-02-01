import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div>
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all',
            error
              ? 'border-red-300 dark:border-red-700 focus:ring-red-500'
              : 'border-gray-200 dark:border-zinc-700 focus:ring-blue-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
