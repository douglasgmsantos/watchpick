'use client';

import { cn } from '@/lib/utils';

interface ToggleOption<T extends string> {
  value: T;
  label: string;
}

interface ToggleProps<T extends string> {
  options: ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function Toggle<T extends string>({ options, value, onChange, className }: ToggleProps<T>) {
  return (
    <div
      className={cn(
        'inline-flex rounded-xl bg-white/5 border border-white/10 p-1',
        className
      )}
      role="radiogroup"
    >
      {options.map((option) => (
        <button
          key={option.value}
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500',
            value === option.value
              ? 'bg-violet-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
