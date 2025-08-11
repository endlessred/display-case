import * as React from 'react';
import clsx from 'clsx';

export type GlassTextFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  tone?: 'default'|'primary'|'success'|'info'|'danger';
};

export function GlassTextField({ label, description, error, className, id, tone, ...rest }: GlassTextFieldProps) {
  const autoId = React.useId();
  const inputId = id || `dc-input-${autoId}`;
  const descId = description ? `${inputId}-desc` : undefined;
  const errId  = error ? `${inputId}-err` : undefined;

  return (
    <div className={clsx('ui-glass', 'dc-input-wrap', tone && `tone-${tone}`)}>
      {label && <label htmlFor={inputId} className="dc-label">{label}</label>}
      <input id={inputId} className={clsx('dc-input', className)} aria-describedby={[descId, errId].filter(Boolean).join(' ') || undefined} aria-invalid={!!error || undefined} {...rest} />
      {description && <div id={descId} className="dc-desc">{description}</div>}
      {error && <div id={errId} role="alert" className="dc-error">{error}</div>}
    </div>
  );
}