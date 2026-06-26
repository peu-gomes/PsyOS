'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = cn(
      "inline-flex items-center justify-center font-sans font-medium tracking-wide transition-all duration-200 outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 select-none cursor-pointer rounded-lg",
      // Ensuring touch target is optimal (at least 44px height for touch interactions unless custom sizing)
      size === 'sm' && "h-9 px-4 text-xs",
      size === 'md' && "h-11 px-6 text-sm",
      size === 'lg' && "h-13 px-8 text-base",
      // Custom premium color variants
      variant === 'primary' && "bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 border border-zinc-900 dark:border-zinc-100 shadow-sm",
      variant === 'secondary' && "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 border border-transparent",
      variant === 'outline' && "bg-transparent text-zinc-800 dark:text-zinc-200 border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50",
      variant === 'ghost' && "bg-transparent text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-transparent",
      variant === 'danger' && "bg-red-950/20 text-red-400 hover:bg-red-950/40 border border-red-900/30",
      props.disabled && "opacity-50 cursor-not-allowed hover:bg-transparent dark:hover:bg-transparent"
    );

    return (
      <motion.button
        ref={ref}
        whileTap={props.disabled ? undefined : { scale: 0.98 }}
        className={cn(baseStyles, className)}
        {...(props as any)}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
