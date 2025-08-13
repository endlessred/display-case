import type { Meta, StoryObj } from '@storybook/react';
import { GlassCheckbox } from '../src/form';

const meta: Meta<typeof GlassCheckbox> = {
  title: 'Glass/Checkbox',
  component: GlassCheckbox,
  parameters: { layout: 'centered' }
};
export default meta;

type Story = StoryObj<typeof GlassCheckbox>;

export const Basic: Story = {
  args: { label: 'Email me updates', description: 'You can unsubscribe anytime.' }
};

export const Indeterminate: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, width: 360 }}>
      <GlassCheckbox label="Select all" indeterminate />
      <GlassCheckbox label="Item A" defaultChecked />
      <GlassCheckbox label="Item B" />
    </div>
  )
};

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, width: 360 }}>
      <GlassCheckbox label="Primary" tone="primary" />
      <GlassCheckbox label="Success" tone="success" />
      <GlassCheckbox label="Info" tone="info" />
      <GlassCheckbox label="Danger" tone="danger" defaultChecked />
    </div>
  )
};