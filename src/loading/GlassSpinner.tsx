import * as React from 'react';
import clsx from 'clsx';

export type GlassSpinnerProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: 'sm' | 'md' | 'lg' | number; // px if number
  thickness?: number;                  // stroke width in px
  label?: React.ReactNode;             // a11y/visible label
  tone?: 'default' | 'primary' | 'success' | 'info' | 'danger';
};

export function GlassSpinner({
  size = 'md',
  thickness = 3,
  label,
  tone,
  className,
  ...rest
}: GlassSpinnerProps) {
  const px = typeof size === 'number' ? size : size === 'sm' ? 18 : size === 'lg' ? 36 : 24;
  const r = (px - thickness) / 2;
  const c = 2 * Math.PI * r;

  // If label provided, expose via aria; otherwise mark as aria-hidden
  const ariaProps = label ? { role: 'status', 'aria-live': 'polite' as const } : { 'aria-hidden': true };

  return (
    <div className={clsx('ui-glass', 'dc-spinner', tone && `tone-${tone}`, className)} {...ariaProps} {...rest}>
      <svg
        className="dc-spinner__svg"
        width={px}
        height={px}
        viewBox={`0 0 ${px} ${px}`}
        aria-hidden="true"
      >
        <circle
          className="dc-spinner__track"
          cx={px / 2}
          cy={px / 2}
          r={r}
          strokeWidth={thickness}
        />
        <circle
          className="dc-spinner__arc"
          cx={px / 2}
          cy={px / 2}
          r={r}
          strokeWidth={thickness}
          strokeDasharray={`${c * 0.25} ${c}`}
          strokeLinecap="round"
        />
      </svg>
      {label && <span className="dc-spinner__label">{label}</span>}
    </div>
  );
}