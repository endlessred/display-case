import * as React from 'react';
import clsx from 'clsx';

export type GlassProgressProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: number;           // 0..100 (omit for indeterminate)
  max?: number;             // default 100 (used if value given)
  label?: React.ReactNode;  // visible label (optional)
  tone?: 'default' | 'primary' | 'success' | 'info' | 'danger';
  indeterminate?: boolean;  // overrides value
};

export function GlassProgress({
  value,
  max = 100,
  label,
  tone,
  indeterminate,
  className,
  ...rest
}: GlassProgressProps) {
  const isInd = indeterminate || value === undefined || value === null;
  const pct = Math.max(0, Math.min(100, (Number(value) / max) * 100 || 0));
  const labelId = React.useId().replace(/:/g, '') + '-progress';

  return (
    <div className={clsx('ui-glass', 'dc-progress', tone && `tone-${tone}`, className)} {...rest}>
      {label && <div id={labelId} className="dc-progress__label">{label}</div>}
      <div
        role="progressbar"
        aria-labelledby={label ? labelId : undefined}
        aria-valuemin={isInd ? undefined : 0}
        aria-valuemax={isInd ? undefined : max}
        aria-valuenow={isInd ? undefined : Math.round((pct / 100) * max)}
        aria-valuetext={isInd ? 'Loading…' : undefined}
        className="dc-progress__track"
      >
        <div
          className={clsx('dc-progress__bar', isInd && 'is-indeterminate')}
          style={!isInd ? { width: `${pct}%` } : undefined}
        />
      </div>
    </div>
  );
}