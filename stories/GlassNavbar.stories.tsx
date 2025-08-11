import type { Meta, StoryObj } from '@storybook/react';
import { GlassNavbar } from '../src/navbar';
import { GlassButton } from '../src/button';

const meta: Meta<typeof GlassNavbar> = {
  title: 'Glass/Navbar',
  component: GlassNavbar,
  parameters: { layout: 'fullscreen' }
};
export default meta;

type Story = StoryObj<typeof GlassNavbar>;

const links = [
  { label: 'Home', href: '#', current: true },
  { label: 'Products', href: '#products' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '#docs' }
];

export const Basic: Story = {
  args: {
    brand: <span>display<span style={{ opacity: .6 }}>-case</span></span>,
    links,
    actions: <GlassButton variant="primary" size="sm">Sign in</GlassButton>,
    tone: 'info',
    sticky: false,
  }
};

export const StickyDanger: Story = {
  args: {
    brand: <span>display<span style={{ opacity: .6 }}>-case</span></span>,
    links,
    actions: (
      <>
        <GlassButton variant="ghost" size="sm">Docs</GlassButton>
        <GlassButton variant="danger" size="sm">Launch</GlassButton>
      </>
    ),
    tone: 'danger',
    sticky: true
  }
};
