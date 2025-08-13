import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassSwitch } from '../src/form';

const meta: Meta<typeof GlassSwitch> = {
  title: 'Glass/Switch',
  component: GlassSwitch,
  parameters: { layout: 'centered' }
};
export default meta;

type Story = StoryObj<typeof GlassSwitch>;

export const Basic: Story = {
  args: { label: 'Enable notifications', description: 'Receive occasional updates.' }
};

export const Controlled: Story = {
  render: () => {
    const [on, setOn] = React.useState(true);
    return (
      <div style={{ width: 360 }}>
        <GlassSwitch checked={on} onCheckedChange={setOn} label={`Notifications: ${on ? 'On' : 'Off'}`} />
      </div>
    );
  }
};

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, width: 360 }}>
      <GlassSwitch label="Primary" tone="primary" />
      <GlassSwitch label="Success" tone="success" />
      <GlassSwitch label="Info" tone="info" />
      <GlassSwitch label="Danger" tone="danger" />
    </div>
  )
};