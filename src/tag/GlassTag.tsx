import * as React from 'react';
import clsx from 'clsx';

export type TagTone = 'default' | 'primary' | 'success' | 'info' | 'danger';

export type GlassTagProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: TagTone;
  removable?: boolean;
  onRemove?: () => void;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
};

export function GlassTag({
  tone,
  removable,
  onRemove,
  leading,
  trailing,
  className,
  children,
  ...rest
}: GlassTagProps) {
  const removeBtn = removable ? (
    <button
      type="button"
      className="ui-glass dc-btn dc-tag__remove"
      aria-label="Remove tag"
      onClick={(e) => { e.stopPropagation(); onRemove?.(); }}
    >
      ✕
    </button>
  ) : null;

  return (
    <span className={clsx('ui-glass', 'dc-tag', tone && `tone-${tone}`, className)} {...rest}>
      {leading && <span className="dc-tag__ico">{leading}</span>}
      <span className="dc-tag__label">{children}</span>
      {trailing && <span className="dc-tag__ico">{trailing}</span>}
      {removeBtn}
    </span>
  );
}