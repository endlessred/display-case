import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassProgress } from '../src/loading';

const meta: Meta<typeof GlassProgress> = {
  title: 'Glass/Loading/Progress',
  component: GlassProgress,
  parameters: { layout: 'centered' }
};
export default meta;

type Story = StoryObj<typeof GlassProgress>;

export const Determinate: Story = {
  render: () => {
    const [v, setV] = React.useState(40);
    return (
      <div style={{ width: 360, display: 'grid', gap: 10 }}>
        <GlassProgress value={v} label={`Uploading… ${v}%`} tone="primary" />
        <input type="range" min={0} max={100} value={v} onChange={(e) => setV(Number(e.target.value))} />
      </div>
    );
  }
};

export const Indeterminate: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <GlassProgress indeterminate label="Syncing…" tone="info" />
    </div>
  )
};