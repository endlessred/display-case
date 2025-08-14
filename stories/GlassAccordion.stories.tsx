import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassAccordion } from '../src/accordion';

const meta: Meta<typeof GlassAccordion> = {
  title: 'Glass/Accordion',
  component: GlassAccordion,
  parameters: { layout: 'centered' }
};
export default meta;

type Story = StoryObj<typeof GlassAccordion>;

export const Single: Story = {
  render: () => (
    <div style={{ width: 520 }}>
      <GlassAccordion type="single" collapsible tone="info">
        <GlassAccordion.Item value="one">
          <GlassAccordion.Trigger itemValue="one">What is Display Case?</GlassAccordion.Trigger>
          <GlassAccordion.Content itemValue="one">
            A retrofuturistic glass UI library with solid a11y and tiny footprint.
          </GlassAccordion.Content>
        </GlassAccordion.Item>
        <GlassAccordion.Item value="two">
          <GlassAccordion.Trigger itemValue="two">How do I install it?</GlassAccordion.Trigger>
          <GlassAccordion.Content itemValue="two">
            <code>pnpm add display-case</code> (hypothetical). Import styles and start composing.
          </GlassAccordion.Content>
        </GlassAccordion.Item>
        <GlassAccordion.Item value="three">
          <GlassAccordion.Trigger itemValue="three">Is it tree-shakeable?</GlassAccordion.Trigger>
          <GlassAccordion.Content itemValue="three">Yep—per-entry exports via tsup config.</GlassAccordion.Content>
        </GlassAccordion.Item>
      </GlassAccordion>
    </div>
  )
};

export const Multiple: Story = {
  render: () => (
    <div style={{ width: 520 }}>
      <GlassAccordion type="multiple" tone="primary">
        {['alpha','bravo','charlie'].map(k => (
          <GlassAccordion.Item key={k} value={k}>
            <GlassAccordion.Trigger itemValue={k}>Section {k}</GlassAccordion.Trigger>
            <GlassAccordion.Content itemValue={k}>
              Content for {k}. Arrow ↑/↓ to move, Home/End to jump.
            </GlassAccordion.Content>
          </GlassAccordion.Item>
        ))}
      </GlassAccordion>
    </div>
  )
};
