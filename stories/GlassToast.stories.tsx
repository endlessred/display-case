import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassToastProvider, GlassToastViewport, useGlassToast } from '../src/toast';
import { GlassButton } from '../src/button';

const meta: Meta = {
  title: 'Glass/Toast',
  parameters: { layout: 'centered' }
};
export default meta;

type Story = StoryObj;

function Demo() {
  const { push, clear } = useGlassToast();
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <GlassButton onClick={() => push({ title: 'Saved', description: 'Your changes are live.', tone: 'success' })}>
        Push success
      </GlassButton>
      <GlassButton onClick={() => push({ title: 'Heads up', description: 'New version available.', tone: 'info' })}>
        Push info
      </GlassButton>
      <GlassButton onClick={() => push({ title: 'Deletion', description: 'Item removed.', tone: 'danger', action: { label: 'Undo' } })}>
        Push danger + action
      </GlassButton>
      <GlassButton variant="ghost" onClick={clear}>Clear all</GlassButton>
    </div>
  );
}

export const Basic: Story = {
  render: () => (
    <GlassToastProvider>
      <Demo />
      <GlassToastViewport position="bottom-right" />
    </GlassToastProvider>
  )
};