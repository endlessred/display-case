import type { Meta, StoryObj } from '@storybook/react';
import { GlassTooltip } from '../src/tooltip';
import { GlassButton } from '../src/button';

const meta: Meta = { title: 'Glass/Tooltip' };
export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <GlassTooltip label="Deletes the selected item" tone="danger">
      <GlassButton variant="danger">Delete</GlassButton>
    </GlassTooltip>
  )
};