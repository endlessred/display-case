import type { Meta, StoryObj } from '@storybook/react';
import { GlassSpinner } from '../src/loading';

const meta: Meta<typeof GlassSpinner> = {
  title: 'Glass/Loading/Spinner',
  component: GlassSpinner,
  parameters: { layout: 'centered' }
};
export default meta;

type Story = StoryObj<typeof GlassSpinner>;

export const Basic: Story = { args: { label: 'Loading', tone: 'info' } };
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <GlassSpinner size="sm" label=" " />
      <GlassSpinner size="md" label=" " />
      <GlassSpinner size="lg" label=" " />
      <GlassSpinner size={48} thickness={4} label=" " tone="primary" />
    </div>
  )
};