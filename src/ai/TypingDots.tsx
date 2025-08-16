import * as React from 'react';
import clsx from 'clsx';

export type TypingDotsProps = {
  'aria-label'?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export function TypingDots({ 'aria-label': label = 'Assistant is typing…', size = 'md', className }: TypingDotsProps) {
  return (
    <span className={clsx('dc-typing', `dc-typing--${size}`, className)} role="status" aria-live="polite" aria-label={label}>
      <span className="dc-typing__dot" />
      <span className="dc-typing__dot" />
      <span className="dc-typing__dot" />
    </span>
  );
}
