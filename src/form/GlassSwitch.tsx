import * as React from 'react';
import clsx from 'clsx';

export type GlassSwitchProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  tone?: 'default' | 'primary' | 'success' | 'info' | 'danger';
  disabled?: boolean;
};

export function GlassSwitch({
  checked,
  defaultChecked,
  onCheckedChange,
  label,
  description,
  tone,
  disabled,
  className,
  ...rest
}: GlassSwitchProps) {
  const isControlled = checked !== undefined;
  const [inner, setInner] = React.useState(!!defaultChecked);
  const value = isControlled ? !!checked : inner;

  const toggle = () => {
    if (disabled) return;
    const next = !value;
    if (!isControlled) setInner(next);
    onCheckedChange?.(next);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <div className={clsx('ui-glass', 'dc-switch', tone && `tone-${tone}`, disabled && 'is-disabled', className)}>
      <button
        role="switch"
        aria-checked={value}
        aria-disabled={disabled || undefined}
        className={clsx('dc-switch__btn', value && 'is-on')}
        onClick={toggle}
        onKeyDown={onKeyDown}
        disabled={disabled}
        {...rest}
      >
        <span className="dc-switch__track" aria-hidden="true">
          <span className="dc-switch__thumb" />
        </span>
      </button>
      {(label || description) && (
        <span className="dc-switch__body" onClick={!disabled ? toggle : undefined}>
          {label && <span className="dc-switch__label">{label}</span>}
          {description && <span className="dc-switch__desc">{description}</span>}
        </span>
      )}
    </div>
  );
}