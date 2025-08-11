import type { Meta, StoryObj } from '@storybook/react';
import { GlassCard } from '../src/card';

const meta: Meta<typeof GlassCard> = { title: 'Glass/Card', component: GlassCard };
export default meta;

type Story = StoryObj<typeof GlassCard>;
export const Basic: Story = {
  args: { header: 'Payment Methods', children: 'Securely add or remove cards.' },
};

export const DangerCard: Story = {
  args: {
    elevation: 'lg',
    header: 'Delete account',
    children: 'This action cannot be undone.',
  },
  render: (args) => <GlassCard {...args} tone="danger" />
};
export const InfoCard = {
  args: { header: 'Heads up', children: 'Informational surface.' },
  render: (args) => <GlassCard {...args} tone="info" elevation="lg" />
};