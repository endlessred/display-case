import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassTextarea } from '../src/form';

const meta: Meta<typeof GlassTextarea> = {
  title: 'Glass/Textarea',
  component: GlassTextarea,
  parameters: { layout: 'centered' }
};
export default meta;

type Story = StoryObj<typeof GlassTextarea>;

export const Basic: Story = {
  args: {
    label: 'Bio',
    placeholder: 'Tell us a little about yourself…',
    description: 'Markdown supported.',
    maxChars: 200
  }
};

export const Controlled: Story = {
  render: () => {
    const [val, setVal] = React.useState('Once upon a time…');
    return (
      <div style={{ width: 520 }}>
        <GlassTextarea
          label="Story"
          value={val}
          onValueChange={setVal}
          description="Auto-grows up to ~480px."
          maxChars={500}
          tone="info"
        />
        <pre style={{ opacity: .8, marginTop: 8 }}>{val}</pre>
      </div>
    );
  }
};

export const WithError: Story = {
  render: () => (
    <div style={{ width: 520 }}>
      <GlassTextarea
        label="Comment"
        placeholder="Type something…"
        error="Please write at least 10 characters."
        maxLength={10}
        tone="danger"
      />
    </div>
  )
};
