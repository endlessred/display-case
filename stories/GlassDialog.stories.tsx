import type { Meta, StoryObj } from '@storybook/react';
import {
  GlassDialog, GlassDialogTrigger, GlassDialogContent,
  GlassDialogTitle, GlassDialogClose
} from '../src/dialog';
import { GlassButton } from '../src/button';

const meta: Meta = { title: 'Glass/Dialog', parameters: { layout: 'centered' } };
export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <GlassDialog>
      <GlassDialogTrigger>
        <GlassButton>Open dialog</GlassButton>
      </GlassDialogTrigger>

      <GlassDialogContent aria-labelledby="demo-title">
        <div className="dc-dialog__header">
          <GlassDialogTitle id="demo-title">Enable payments</GlassDialogTitle>
          <GlassDialogClose className="ui-glass dc-btn btn-ghost">✕</GlassDialogClose>
        </div>

        <p style={{ marginTop: 8 }}>
          This dialog uses the same retro-corners glass surface. Press <kbd>Esc</kbd> to close,
          or click the scrim.
        </p>

        <div className="dc-dialog__footer">
          <GlassDialogClose className="ui-glass dc-btn btn-ghost">Cancel</GlassDialogClose>
          <button className="ui-glass dc-btn btn-primary" data-autofocus>Confirm</button>
        </div>
      </GlassDialogContent>
    </GlassDialog>
  )
};