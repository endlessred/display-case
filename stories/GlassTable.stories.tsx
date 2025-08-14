import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassTable, type GlassTableColumn, type SortDir } from '../src/table';
import { GlassPagination } from '../src/pagination';
import { GlassBadge } from '../src/badge';

type Row = { id: number; name: string; role: string; score: number; status: 'Active'|'Invited'|'Suspended' };

const meta: Meta<typeof GlassTable<Row>> = {
  title: 'Glass/Table',
  component: GlassTable as any,
  parameters: { layout: 'fullscreen' }
};
export default meta;

type Story = StoryObj<typeof GlassTable<Row>>;

const COLUMNS: GlassTableColumn<Row>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'role', header: 'Role', sortable: true },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    cell: (r) => <GlassBadge tone={r.status === 'Active' ? 'success' : r.status === 'Invited' ? 'info' : 'danger'}>{r.status}</GlassBadge>,
    sortAccessor: (r) => r.status
  },
  { key: 'score', header: 'Score', sortable: true, align: 'right', sortAccessor: (r) => r.score,
    cell: (r) => r.score.toFixed(1) }
];

const ALL: Row[] = Array.from({ length: 57 }).map((_, i) => ({
  id: i + 1,
  name: ['Ada Lovelace','Alan Turing','Grace Hopper','Linus Torvalds','Margaret Hamilton','Barbara Liskov','Tim Berners-Lee'][i % 7] + ` #${i+1}`,
  role: ['Engineer','Admin','Owner','Analyst'][i % 4],
  status: (['Active','Invited','Suspended'][i % 3]) as Row['status'],
  score: Math.round((Math.random() * 1000)) / 10
}));

export const BasicSortable: Story = {
  render: () => (
    <div style={{ padding: 16 }}>
      <GlassTable<Row>
        columns={COLUMNS}
        data={ALL.slice(0, 8)}
        stickyHeader
        tone="info"
        zebra
      />
    </div>
  )
};

export const WithPaginationAndLoading: Story = {
  render: () => {
    const [page, setPage] = React.useState(1);
    const [loading, setLoading] = React.useState(false);
    const perPage = 10;

    const start = (page - 1) * perPage;
    const end = start + perPage;

    React.useEffect(() => {
      setLoading(true);
      const t = setTimeout(() => setLoading(false), 600);
      return () => clearTimeout(t);
    }, [page]);

    return (
      <div style={{ padding: 16, display: 'grid', gap: 12 }}>
        <GlassTable<Row>
          columns={COLUMNS}
          data={loading ? [] : ALL.slice(start, end)}
          loading={loading}
          zebra
          dense
          stickyHeader
          empty={<span>No users on this page.</span>}
        />
        <GlassPagination
          page={page}
          pageCount={Math.ceil(ALL.length / perPage)}
          onPageChange={setPage}
          tone="primary"
          compact
        />
      </div>
    );
  }
};

export const ControlledSort: Story = {
  render: () => {
    const [by, setBy] = React.useState<string | null>('score');
    const [dir, setDir] = React.useState<SortDir | null>('desc');
    const onSortChange = (k: string | null, d: SortDir | null) => { setBy(k); setDir(d); };

    return (
      <div style={{ padding: 16 }}>
        <GlassTable<Row>
          columns={COLUMNS}
          data={ALL.slice(0, 12)}
          sortBy={by}
          sortDir={dir}
          onSortChange={onSortChange}
          tone="primary"
        />
      </div>
    );
  }
};