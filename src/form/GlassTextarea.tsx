import * as React from 'react';
import clsx from 'clsx';

export type GlassTextareaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> & {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  tone?: 'default' | 'primary' | 'success' | 'info' | 'danger';
  autoGrow?: boolean;                 // auto-resize height to content
  maxChars?: number;                  // show counter if provided
  onValueChange?: (value: string) => void;
};

export function GlassTextarea({
  label,
  description,
  error,
  tone,
  autoGrow = true,
  maxChars,
  onValueChange,
  className,
  id,
  value,
  defaultValue,
  onInput,
  ...rest
}: GlassTextareaProps) {
  const autoId = React.useId();
  const inputId = id || `dc-ta-${autoId}`;
  const descId = `${inputId}-desc`;
  const errId = `${inputId}-err`;
  const counterId = `${inputId}-counter`;

  const taRef = React.useRef<HTMLTextAreaElement>(null);

  const resize = React.useCallback(() => {
    if (!autoGrow || !taRef.current) return;
    const el = taRef.current;
    el.style.height = '0px';
    el.style.height = Math.min(el.scrollHeight, 480) + 'px';
  }, [autoGrow]);

  React.useEffect(() => { resize(); }, [resize, value]);

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    resize();
    onValueChange?.(e.currentTarget.value);
    onInput?.(e);
  };

  const describedBy = [
    description ? descId : null,
    error ? errId : null,
    maxChars ? counterId : null
  ].filter(Boolean).join(' ') || undefined;

  const count = (value ?? defaultValue ?? '').toString().length;

  return (
    <div className={clsx('ui-glass', 'dc-textarea', tone && `tone-${tone}`, className)}>
      {label && <label className="dc-field__label" htmlFor={inputId}>{label}</label>}

      <textarea
        ref={taRef}
        id={inputId}
        className="dc-textarea__input"
        aria-describedby={describedBy}
        aria-invalid={!!error || undefined}
        value={value as any}
        defaultValue={defaultValue as any}
        onInput={handleInput}
        {...rest}
      />

      <div className="dc-field__meta">
        {description && <div id={descId} className="dc-field__desc">{description}</div>}
        {maxChars !== undefined && (
          <div id={counterId} className="dc-field__counter" aria-live="polite">
            {count}/{maxChars}
          </div>
        )}
      </div>

      {error && <div id={errId} className="dc-field__error" role="alert">{error}</div>}
    </div>
  );
}
