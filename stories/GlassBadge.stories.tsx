import type { Meta, StoryObj } from '@storybook/react';
import { GlassBadge } from '../src/badge';
import { GlassTag } from '../src/tag';

const meta: Meta = { title: 'Glass/Badge & Tag', parameters: { layout: 'centered' } };
export default meta;

type Story = StoryObj;

export const Badges: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <GlassBadge tone="primary">New</GlassBadge>
      <GlassBadge tone="success">Live</GlassBadge>
      <GlassBadge tone="info">Beta</GlassBadge>
      <GlassBadge tone="danger">Breaking</GlassBadge>
      <GlassBadge>Default</GlassBadge>
    </div>
  )
};

export const Tags: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <GlassTag tone="primary" leading="🏷">Design</GlassTag>
      <GlassTag tone="success" removable onRemove={() => alert('removed')}>Green</GlassTag>
      <GlassTag tone="info" trailing="ℹ️">Docs</GlassTag>
      <GlassTag tone="danger" removable>Danger</GlassTag>
      <GlassTag>Plain</GlassTag>
    </div>
  )
};