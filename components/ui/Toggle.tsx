'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}) => {
  return (
    <label className={cn(
      "flex items-start justify-between gap-4 cursor-pointer select-none py-2",
      disabled && "opacity-50 cursor-not-allowed"
    )}>
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="font-sans text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {label}
            </span>
          )}
          {description && (
            <span className="font-sans text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {description}
            </span>
          )}
        </div>
      )}
      
      <div 
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ease-in-out border outline-none",
          checked 
            ? "bg-zinc-900 border-zinc-900 dark:bg-zinc-100 dark:border-zinc-100" 
            : "bg-zinc-100 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800"
        )}
      >
        <motion.span
          animate={{ x: checked ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={cn(
            "absolute top-[2px] left-0 block h-4 w-4 rounded-full shadow-sm transition-colors",
            checked
              ? "bg-white dark:bg-zinc-900"
              : "bg-zinc-400 dark:bg-zinc-600"
          )}
        />
      </div>
    </label>
  );
};
