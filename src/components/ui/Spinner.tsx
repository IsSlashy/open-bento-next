import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'border-2 border-gray-200 dark:border-zinc-700 rounded-full animate-spin',
        {
          'w-4 h-4 border-t-gray-600 dark:border-t-gray-300': size === 'sm',
          'w-6 h-6 border-t-gray-600 dark:border-t-gray-300': size === 'md',
          'w-8 h-8 border-t-gray-600 dark:border-t-gray-300': size === 'lg',
        },
        className
      )}
    />
  );
}
