import type { Meta, StoryObj } from '@storybook/react';
import { GlassTabs, GlassTabList, GlassTab, GlassTabPanels, GlassTabPanel } from '../src/tabs';

const meta: Meta = { title: 'Glass/Tabs' };
export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <GlassTabs defaultValue="one">
      <GlassTabList tone="info" style={{ display: 'inline-flex', gap: 8, padding: 8 }}>
        <GlassTab value="one">One</GlassTab>
        <GlassTab value="two">Two</GlassTab>
        <GlassTab value="three">Three</GlassTab>
      </GlassTabList>
      <GlassTabPanels style={{ marginTop: 12 }}>
        <GlassTabPanel value="one"><div className="ui-glass" style={{ padding: 16 }}>Panel one</div></GlassTabPanel>
        <GlassTabPanel value="two"><div className="ui-glass" style={{ padding: 16 }}>Panel two</div></GlassTabPanel>
        <GlassTabPanel value="three"><div className="ui-glass" style={{ padding: 16 }}>Panel three</div></GlassTabPanel>
      </GlassTabPanels>
    </GlassTabs>
  )
};