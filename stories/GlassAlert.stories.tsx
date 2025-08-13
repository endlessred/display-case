import type { Meta, StoryObj } from '@storybook/react';
import { GlassAlert } from '../src/alert';
import { GlassButton } from '../src/button';

const meta: Meta<typeof GlassAlert> = {
  title: 'Glass/Inline Alert',
  component: GlassAlert,
  parameters: { layout: 'centered' }
};
export default meta;

type Story = StoryObj<typeof GlassAlert>;

export const Info: Story = {
  args: {
    tone: 'info',
    title: 'Heads up',
    children: 'We’ve updated our terms of service.',
    actions: <GlassButton variant="ghost" size="sm">Read</GlassButton>
  }
};

export const Success: Story = {
  args: {
    tone: 'success',
    title: 'All set',
    children: 'Your profile is complete.'
  }
};

export const DangerDismissible: Story = {
  render: () => (
    <GlassAlert
      tone="danger"
      title="Payment failed"
      dismissible
      onDismiss={() => console.log('dismissed')}
    >
      Please update your card to keep your workspace active.
    </GlassAlert>
  )
};