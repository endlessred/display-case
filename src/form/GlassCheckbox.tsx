import * as React from 'react';
import clsx from 'clsx';

export type GlassCheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange' | 'checked' | 'defaultChecked'
> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  tone?: 'default' | 'primary' | 'success' | 'info' | 'danger';
  indeterminate?: boolean;
};

export function GlassCheckbox({
  checked,
  defaultChecked,
  onCheckedChange,
  label,
  description,
  tone,
  disabled,
  className,
  id,
  indeterminate,
  ...rest
}: GlassCheckboxProps) {
  const isControlled = checked !== undefined;
  const [inner, setInner] = React.useState(!!defaultChecked);
  const value = isControlled ? !!checked : inner;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const autoId = React.useId();
  const inputId = id || `dc-check-${autoId}`;

  React.useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = !!indeterminate && !value;
  }, [indeterminate, value]);

  const toggle = () => {
    const next = !value;
    if (!isControlled) setInner(next);
    onCheckedChange?.(next);
  };

  return (
    <label
      htmlFor={inputId}
      className={clsx('ui-glass', 'dc-check', tone && `tone-${tone}`, disabled && 'is-disabled', className)}
    >
      <input
        ref={inputRef}
        id={inputId}
        className="dc-check__input"
        type="checkbox"
        checked={value}
        onChange={toggle}
        disabled={disabled}
        {...rest}
      />
      <span className={clsx('dc-check__box', indeterminate && !value && 'is-indeterminate')} aria-hidden="true" />
      <span className="dc-check__body">
        {label && <span className="dc-check__label">{label}</span>}
        {description && <span className="dc-check__desc">{description}</span>}
      </span>
    </label>
  );
}