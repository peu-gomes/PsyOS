'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animate?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, animate = true, ...props }, ref) => {
    const cardContent = (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-xl border border-zinc-200 bg-white/70 backdrop-blur-md p-6 text-zinc-950 shadow-xs transition-all duration-300 hover:shadow-md hover:border-zinc-300 dark:border-zinc-800/80 dark:bg-zinc-950/60 dark:text-zinc-50 dark:hover:border-zinc-700/80 dark:hover:shadow-zinc-950/40",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );

    if (animate) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {cardContent}
        </motion.div>
      );
    }

    return cardContent;
  }
);

Card.displayName = 'Card';
