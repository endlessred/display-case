import * as React from 'react';
import { GlassCombobox } from '../select';

export type ModelOption = { label: string; value: string; disabled?: boolean; icon?: React.ReactNode };

export type GlassModelSelectProps = {
  models: ModelOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  tone?: 'default' | 'primary' | 'success' | 'info' | 'danger';
  disabled?: boolean;
  className?: string;
};

export function GlassModelSelect({ models, value, onChange, placeholder = 'Select a model', tone, disabled, className }: GlassModelSelectProps) {
  return (
    <GlassCombobox
      options={models}
      value={value}
      onChange={(v) => onChange(v)}
      placeholder={placeholder}
      tone={tone}
      disabled={disabled}
      className={className}
    />
  );
}