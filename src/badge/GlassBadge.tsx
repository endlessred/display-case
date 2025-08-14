import * as React from 'react';
import clsx from 'clsx';

export type BadgeTone = 'default' | 'primary' | 'success' | 'info' | 'danger';

export type GlassBadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
  size?: 'sm' | 'md';
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
};

export function GlassBadge({
  tone,
  size = 'md',
  leading,
  trailing,
  className,
  children,
  ...rest
}: GlassBadgeProps) {
  return (
    <span
      className={clsx('ui-glass', 'dc-badge', size && `dc-badge--${size}`, tone && `tone-${tone}`, className)}
      {...rest}
    >
      {leading && <span className="dc-badge__ico">{leading}</span>}
      <span className="dc-badge__label">{children}</span>
      {trailing && <span className="dc-badge__ico">{trailing}</span>}
    </span>
  );
}