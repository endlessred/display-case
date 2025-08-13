import type { Meta, StoryObj } from '@storybook/react';
import { GlassPopover, GlassPopoverTrigger, GlassPopoverContent } from '../src/popover';
import { GlassButton } from '../src/button';

const meta: Meta = { title: 'Glass/Popover' };
export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <GlassPopover tone="primary">
      <GlassPopoverTrigger asChild>
        <GlassButton>Open popover</GlassButton>
      </GlassPopoverTrigger>
      <GlassPopoverContent style={{ minWidth: 260 }}>
        <p style={{ margin: 0 }}>Hello from a retro-cornered popover.</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <GlassButton size="sm" variant="ghost">Cancel</GlassButton>
          <GlassButton size="sm">Confirm</GlassButton>
        </div>
      </GlassPopoverContent>
    </GlassPopover>
  )
};