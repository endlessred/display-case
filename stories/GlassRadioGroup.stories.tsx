import type { Meta, StoryObj } from '@storybook/react';
import { GlassRadioGroup, GlassRadio } from '../src/form';

const meta: Meta<typeof GlassRadioGroup> = {
  title: 'Glass/RadioGroup',
  component: GlassRadioGroup,
  parameters: { layout: 'centered' }
};
export default meta;

type Story = StoryObj<typeof GlassRadioGroup>;

export const Basic: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <GlassRadioGroup label="Plan" defaultValue="pro">
        <GlassRadio value="free"  label="Free"  description="Basic features" />
        <GlassRadio value="pro"   label="Pro"   description="Everything in Free plus more" />
        <GlassRadio value="team"  label="Team"  description="Collaboration tools" />
      </GlassRadioGroup>
    </div>
  )
};

export const WithTone: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <GlassRadioGroup label="Theme tone" defaultValue="indigo" tone="info">
        <GlassRadio value="indigo" label="Indigo" />
        <GlassRadio value="emerald" label="Emerald" />
        <GlassRadio value="rose" label="Rose" />
      </GlassRadioGroup>
    </div>
  )
};