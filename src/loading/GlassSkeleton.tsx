import * as React from 'react';
import clsx from 'clsx';

export type GlassSkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  width?: number | string;          // e.g., 200 or '100%'
  height?: number | string;         // e.g., 16 or '2rem'
  circle?: boolean;                  // avatar style
  lines?: number;                    // text block helper
  tone?: 'default' | 'primary' | 'success' | 'info' | 'danger';
};

export function GlassSkeleton({
  width = '100%',
  height = 14,
  circle,
  lines,
  tone,
  className,
  ...rest
}: GlassSkeletonProps) {
  if (lines && lines > 1) {
    // Render a stack of lines
    return (
      <div className={clsx('dc-skel-stack', className)} {...rest}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={clsx('ui-glass', 'dc-skeleton', tone && `tone-${tone}`)}
            style={{
              width,
              height,
              borderRadius: 10,
              opacity: i === lines - 1 ? 0.85 : 1,
              marginTop: i === 0 ? 0 : 6
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={clsx('ui-glass', 'dc-skeleton', tone && `tone-${tone}`, className)}
      style={{
        width,
        height,
        borderRadius: circle ? '999px' : 12
      }}
      {...rest}
    />
  );
}