import type { Meta, StoryObj } from '@storybook/react';
import { GlassBreadcrumbs } from '../src/breadcrumbs';

const meta: Meta<typeof GlassBreadcrumbs> = {
  title: 'Glass/Breadcrumbs',
  component: GlassBreadcrumbs,
  parameters: { layout: 'centered' }
};
export default meta;

type Story = StoryObj<typeof GlassBreadcrumbs>;

export const FromItems: Story = {
  render: () => (
    <GlassBreadcrumbs
      tone="info"
      items={[
        { label: 'Home', href: '#' },
        { label: 'Products', href: '#products' },
        { label: 'Keyboards', href: '#keyboards' },
        { label: 'Model X' } // current
      ]}
    />
  )
};

export const JSXChildren: Story = {
  render: () => (
    <GlassBreadcrumbs>
      <GlassBreadcrumbs.Item href="#">Root</GlassBreadcrumbs.Item>
      <GlassBreadcrumbs.Item href="#">Library</GlassBreadcrumbs.Item>
      <GlassBreadcrumbs.Item current>Glass UI</GlassBreadcrumbs.Item>
    </GlassBreadcrumbs>
  )
};