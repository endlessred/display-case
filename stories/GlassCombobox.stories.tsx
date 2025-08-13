import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassCombobox, type ComboOption } from '../src/select';
import { GlassButton } from '../src/button';

const meta: Meta<typeof GlassCombobox> = {
  title: 'Glass/Combobox',
  component: GlassCombobox,
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof GlassCombobox>;

const opts: ComboOption[] = [
  { value: 'alpha',   label: 'Alpha' },
  { value: 'bravo',   label: 'Bravo' },
  { value: 'charlie', label: 'Charlie' },
  { value: 'delta',   label: 'Delta' },
  { value: 'echo',    label: 'Echo', disabled: true },
  { value: 'foxtrot', label: 'Foxtrot' },
];

export const Basic: Story = {
  name: 'Basic (uncontrolled)',
  render: () => (
    <div style={{ width: 360 }}>
      <GlassCombobox options={opts} placeholder="Pick a call sign" />
    </div>
  ),
};

export const WithTones: Story = {
  name: 'With tones',
  render: () => (
    <div style={{ width: 360, display: 'grid', gap: 12 }}>
      <GlassCombobox options={opts} placeholder="Primary tone" tone="primary" />
      <GlassCombobox options={opts} placeholder="Info tone" tone="info" />
      <GlassCombobox options={opts} placeholder="Danger tone" tone="danger" />
    </div>
  ),
};

export const Controlled: Story = {
  name: 'Controlled value',
  render: () => {
    const [val, setVal] = React.useState<string | null>('charlie');
    return (
      <div style={{ width: 360, display: 'grid', gap: 12 }}>
        <GlassCombobox
          options={opts}
          value={val}
          onChange={(v) => setVal(v)}
          placeholder="Controlled combobox"
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <GlassButton size="sm" variant="ghost" onClick={() => setVal(null)}>Clear</GlassButton>
          <GlassButton size="sm" onClick={() => setVal('delta')}>Set to Delta</GlassButton>
        </div>
      </div>
    );
  },
};

export const CustomRender: Story = {
  name: 'Custom option renderer',
  render: () => (
    <div style={{ width: 360 }}>
      <GlassCombobox
        options={opts}
        placeholder="Fancy render"
        renderOption={(opt, active, selected) => (
          <>
            <span style={{ opacity: 0.8, width: 18, display: 'inline-block' }}>
              {selected ? '✓' : active ? '›' : '•'}
            </span>
            <span>{opt.label}</span>
          </>
        )}
      />
    </div>
  ),
};