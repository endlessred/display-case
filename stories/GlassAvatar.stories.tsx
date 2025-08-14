import type { Meta, StoryObj } from '@storybook/react';
import { GlassAvatar } from '../src/avatar';

const meta: Meta = { title: 'Glass/Avatar', parameters: { layout: 'centered' } };
export default meta;

type Story = StoryObj;

export const Basics: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <GlassAvatar name="Ada Lovelace" />
      <GlassAvatar name="N. Tesla" status="online" tone="success" />
      <GlassAvatar src="https://i.pravatar.cc/100?img=32" alt="User" status="away" />
      <GlassAvatar size="lg" name="Grace Hopper" status="busy" tone="danger" />
      <GlassAvatar size="sm" name="Alan Turing" square />
    </div>
  )
};