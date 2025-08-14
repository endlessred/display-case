import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassPagination } from '../src/pagination';

const meta: Meta<typeof GlassPagination> = {
  title: 'Glass/Pagination',
  component: GlassPagination,
  parameters: { layout: 'centered' }
};
export default meta;

type Story = StoryObj<typeof GlassPagination>;

export const Basic: Story = {
  render: () => {
    const [page, setPage] = React.useState(4);
    return <GlassPagination page={page} pageCount={12} onPageChange={setPage} tone="primary" />;
  }
};

export const CompactWithDots: Story = {
  render: () => {
    const [page, setPage] = React.useState(20);
    return (
      <GlassPagination
        page={page}
        pageCount={50}
        onPageChange={setPage}
        siblingCount={1}
        boundaryCount={1}
        compact
        tone="info"
      />
    );
  }
};