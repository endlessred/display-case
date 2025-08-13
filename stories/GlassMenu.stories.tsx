import type { Meta, StoryObj } from '@storybook/react';
import { GlassMenu, GlassMenuTrigger, GlassMenuContent, GlassMenuItem } from '../src/menu';
import { GlassButton } from '../src/button';

const meta: Meta = { title: 'Glass/Menu' };
export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <GlassMenu tone="info">
      <GlassMenuTrigger asChild>
        <GlassButton>Actions ▾</GlassButton>
      </GlassMenuTrigger>
      <GlassMenuContent>
        <GlassMenuItem>Open</GlassMenuItem>
        <GlassMenuItem>Duplicate</GlassMenuItem>
        <GlassMenuItem>Archive</GlassMenuItem>
        <GlassMenuItem className="tone-danger">Delete</GlassMenuItem>
      </GlassMenuContent>
    </GlassMenu>
  )
};

export const InNavbar: Story = {
  render: () => (
    <div style={{ padding: 12 }}>
      <div className="ui-glass" style={{ padding: 8, display: 'flex', gap: 8 }}>
        <GlassMenu tone="primary">
          <GlassMenuTrigger asChild>
            <GlassButton variant="ghost">Products ▾</GlassButton>
          </GlassMenuTrigger>
          <GlassMenuContent>
            <GlassMenuItem>SDK</GlassMenuItem>
            <GlassMenuItem>CLI</GlassMenuItem>
            <GlassMenuItem>Templates</GlassMenuItem>
          </GlassMenuContent>
        </GlassMenu>
      </div>
    </div>
  )
};