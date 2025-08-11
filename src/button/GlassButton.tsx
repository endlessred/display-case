import * as React from 'react';
import clsx from 'clsx';

export type GlassButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
};

export function GlassButton({ variant = 'primary', size = 'md', className, children, ...rest }: GlassButtonProps) {
  return (
    <button
      className={clsx(
        'ui-glass',
        'interactive',
        'dc-btn',                  // shape + spacing
        variant && `btn-${variant}`,
        size && `btn-${size}`,
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}