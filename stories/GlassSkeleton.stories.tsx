import type { Meta, StoryObj } from '@storybook/react';
import { GlassSkeleton } from '../src/loading';

const meta: Meta<typeof GlassSkeleton> = {
  title: 'Glass/Loading/Skeleton',
  component: GlassSkeleton,
  parameters: { layout: 'centered' }
};
export default meta;

type Story = StoryObj<typeof GlassSkeleton>;

export const Block: Story = {
  render: () => <GlassSkeleton width={320} height={120} />
};

export const TextLines: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <GlassSkeleton lines={4} height={14} />
    </div>
  )
};

export const AvatarRow: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <GlassSkeleton circle width={40} height={40} />
      <div style={{ width: 260 }}>
        <GlassSkeleton lines={2} height={12} />
      </div>
    </div>
  )
};