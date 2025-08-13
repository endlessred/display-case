import * as React from 'react';
import clsx from 'clsx';

type Tone = 'default' | 'primary' | 'success' | 'info' | 'danger';

type Ctx = {
  name: string;
  value: string | undefined;
  setValue: (v: string) => void;
  tone?: Tone;
  disabled?: boolean;
};
const RadioCtx = React.createContext<Ctx | null>(null);
const useRadioCtx = () => {
  const c = React.useContext(RadioCtx);
  if (!c) throw new Error('GlassRadio must be used within GlassRadioGroup');
  return c;
};

export type GlassRadioGroupProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  name?: string;
  label?: React.ReactNode;
  tone?: Tone;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
};
export function GlassRadioGroup({
  value,
  defaultValue,
  onValueChange,
  name,
  label,
  tone,
  disabled,
  className,
  children,
}: GlassRadioGroupProps) {
  const isControlled = value !== undefined;
  const [inner, setInner] = React.useState(defaultValue);
  const val = isControlled ? value : inner;
  const setValue = (v: string) => {
    if (!isControlled) setInner(v);
    onValueChange?.(v);
  };
  const auto = React.useId();
  const groupName = name || `dc-radio-${auto}`;

  return (
    <fieldset className={clsx('ui-glass', 'dc-radio-group', tone && `tone-${tone}`, disabled && 'is-disabled', className)}>
      {label && <legend className="dc-radio-group__legend">{label}</legend>}
      <RadioCtx.Provider value={{ name: groupName, value: val, setValue, tone, disabled }}>
        <div role="radiogroup" className="dc-radio-group__list">
          {children}
        </div>
      </RadioCtx.Provider>
    </fieldset>
  );
}

export type GlassRadioProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'name' | 'checked' | 'onChange'> & {
  value: string; // radio value
  label?: React.ReactNode;
  description?: React.ReactNode;
};
export function GlassRadio({ value, label, description, disabled: itemDisabled, className, id, ...rest }: GlassRadioProps) {
  const { name, value: current, setValue, disabled: groupDisabled } = useRadioCtx();
  const disabled = groupDisabled || itemDisabled;
  const autoId = React.useId();
  const inputId = id || `dc-radio-${autoId}`;
  const checked = current === value;

  return (
    <label htmlFor={inputId} className={clsx('ui-glass', 'dc-radio', disabled && 'is-disabled', className)}>
      <input
        id={inputId}
        className="dc-radio__input"
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => setValue(value)}
        disabled={disabled}
        {...rest}
      />
      <span className="dc-radio__control" aria-hidden="true" />
      <span className="dc-radio__body">
        {label && <span className="dc-radio__label">{label}</span>}
        {description && <span className="dc-radio__desc">{description}</span>}
      </span>
    </label>
  );
}