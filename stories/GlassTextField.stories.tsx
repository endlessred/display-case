import type { Meta, StoryObj } from '@storybook/react';
import { GlassTextField } from '../src/form';

const meta: Meta<typeof GlassTextField> = { title: 'Glass/TextField', component: GlassTextField };
export default meta;

type Story = StoryObj<typeof GlassTextField>;

export const Basic: Story = { args: { label: 'Email', placeholder: 'you@example.com', description: 'We will never share your email.' } };
export const Error: Story = { args: { label: 'Email', placeholder: 'you@example.com', error: 'Please enter a valid email address.' } };