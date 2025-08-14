import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  GlassSurface, GlassCard, GlassButton, GlassBadge, GlassTag, GlassAvatar,
  GlassBreadcrumbs, GlassPagination,
  GlassCombobox, type ComboOption,
  GlassTextField, GlassCheckbox, GlassRadioGroup, GlassRadio, GlassSwitch, GlassTextarea,
  GlassToastProvider, GlassToastViewport, useGlassToast,
  GlassAlert,
  GlassSpinner, GlassProgress, GlassSkeleton,
  GlassMenu, GlassMenuTrigger, GlassMenuContent, GlassMenuItem,
  GlassAccordion,
  GlassTable, type GlassTableColumn
} from '../src';

type Story = StoryObj;

const meta: Meta = {
  title: 'Glass/Kitchen Sink',
  parameters: { layout: 'fullscreen' }
};
export default meta;

// --- Demo data --------------------------------------------------------------

type User = { id: number; name: string; email: string; role: 'Admin'|'Member'|'Viewer'; status: 'Active'|'Invited'|'Suspended'; score: number };

const NAMES = ['Ada Lovelace','Alan Turing','Grace Hopper','Linus Torvalds','Margaret Hamilton','Barbara Liskov','Tim Berners-Lee'];
const ROLES: User['role'][] = ['Admin','Member','Viewer'];
const STATUS: User['status'][] = ['Active','Invited','Suspended'];

const ALL_USERS: User[] = Array.from({ length: 42 }).map((_, i) => ({
  id: i + 1,
  name: `${NAMES[i % NAMES.length]} #${i+1}`,
  email: `user${i+1}@acme.test`,
  role: ROLES[i % ROLES.length],
  status: STATUS[i % STATUS.length],
  score: Math.round(Math.random() * 950) / 10
}));

const COLS: GlassTableColumn<User>[] = [
  { key: 'name', header: 'Name', sortable: true, cell: (u) => (
      <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:8, alignItems:'center' }}>
        <GlassAvatar name={u.name} size="sm" status={u.status === 'Active' ? 'online' : u.status === 'Invited' ? 'away' : 'busy'} />
        <div>
          <div style={{ fontWeight: 800 }}>{u.name}</div>
          <div style={{ opacity:.8, fontSize:'.9rem' }}>{u.email}</div>
        </div>
      </div>
    ), sortAccessor: (u) => u.name
  },
  { key: 'role', header: 'Role', sortable: true },
  { key: 'status', header: 'Status', sortable: true, cell: (u) => (
      <GlassBadge tone={u.status === 'Active' ? 'success' : u.status === 'Invited' ? 'info' : 'danger'}>{u.status}</GlassBadge>
    )
  },
  { key: 'score', header: 'Score', sortable: true, align: 'right', sortAccessor: (u) => u.score, cell: (u) => u.score.toFixed(1) },
];

// --- Kitchen Sink Page ------------------------------------------------------

function TopBar() {
  const { push } = useGlassToast();
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr auto', alignItems:'center', gap:12 }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
        <h1 style={{ margin:0, fontSize:'1.3rem' }}>Display Case — Kitchen Sink</h1>
        <GlassTag tone="info">MVP</GlassTag>
        <GlassTag tone="primary" leading="✨">Retro corners</GlassTag>
      </div>
      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
        <GlassMenu tone="info">
          <GlassMenuTrigger asChild>
            <GlassButton variant="ghost">Actions ▾</GlassButton>
          </GlassMenuTrigger>
          <GlassMenuContent>
            <GlassMenuItem onClick={() => push({ title:'Deployed', description:'Your changes are live.', tone:'success' })}>Deploy</GlassMenuItem>
            <GlassMenuItem onClick={() => push({ title:'Queued', description:'Build started.', tone:'info' })}>Build</GlassMenuItem>
            <GlassMenuItem className="tone-danger" onClick={() => push({ title:'Rolled back', description:'Previous version restored.', tone:'danger' })}>Rollback</GlassMenuItem>
          </GlassMenuContent>
        </GlassMenu>
        <GlassButton onClick={() => push({ title:'Saved', description:'Settings updated.', tone:'success' })}>Save</GlassButton>
      </div>
    </div>
  );
}

function FiltersCard({ onApply }: { onApply: (role: User['role']|null, status: User['status']|null) => void }) {
  const roleOpts: ComboOption[] = ROLES.map(r => ({ value: r, label: r }));
  const statusOpts: ComboOption[] = STATUS.map(s => ({ value: s, label: s }));

  const [role, setRole] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<string | null>(null);
  const [q, setQ] = React.useState('');

  return (
    <GlassCard style={{ display:'grid', gap:12 }}>
      <h3 style={{ margin:0 }}>Filters</h3>
      <GlassTextField label="Search" placeholder="Name or email…" value={q} onValueChange={setQ} />
      <GlassCombobox options={roleOpts} value={role} onChange={setRole} placeholder="Role…" tone="info" />
      <GlassCombobox options={statusOpts} value={status} onChange={setStatus} placeholder="Status…" tone="primary" />
      <div style={{ display:'flex', gap:8 }}>
        <GlassButton onClick={() => onApply(role as any, status as any)}>Apply</GlassButton>
        <GlassButton variant="ghost" onClick={() => { setRole(null); setStatus(null); setQ(''); onApply(null, null); }}>Reset</GlassButton>
      </div>

      <GlassAlert tone="info" title="Tip">
        Type to filter the comboboxes; Enter to select; Esc to close.
      </GlassAlert>

      <div style={{ display:'grid', gap:8 }}>
        <GlassCheckbox label="Email alerts" defaultChecked />
        <GlassRadioGroup label="Access level" defaultValue="member">
          <GlassRadio value="viewer" label="Viewer" />
          <GlassRadio value="member" label="Member" />
          <GlassRadio value="admin"  label="Admin" />
        </GlassRadioGroup>
        <GlassSwitch label="Experimental features" />
      </div>

      <GlassTextarea label="Notes" placeholder="Write a quick note…" maxChars={200} />
    </GlassCard>
  );
}

function UsersCard() {
  const [page, setPage] = React.useState(1);
  const perPage = 8;
  const [loading, setLoading] = React.useState(false);
  const [role, setRole] = React.useState<User['role'] | null>(null);
  const [status, setStatus] = React.useState<User['status'] | null>(null);

  const filtered = ALL_USERS.filter(u => (!role || u.role === role) && (!status || u.status === status));
  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const start = (page - 1) * perPage;
  const slice = filtered.slice(start, start + perPage);

  React.useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, [page, role, status]);

  return (
    <GlassCard style={{ display:'grid', gap:12 }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr auto', alignItems:'end' }}>
        <h3 style={{ margin:0 }}>Users</h3>
        <GlassBadge tone="info">{filtered.length} total</GlassBadge>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:12 }}>
        <GlassTable<User>
          columns={COLS}
          data={loading ? [] : slice}
          loading={loading}
          zebra
          stickyHeader
          empty={<span>No users match your filters.</span>}
        />
        <div style={{ display:'flex', justifyContent:'center' }}>
          <GlassPagination compact page={page} pageCount={pageCount} onPageChange={setPage} tone="primary" />
        </div>
      </div>

      <div style={{ display:'flex', gap:12, alignItems:'center' }}>
        <GlassSpinner label="Syncing" tone="info" />
        <GlassProgress indeterminate label="Background job" tone="primary" />
        <GlassSkeleton width={160} height={20} />
      </div>

      <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
        <GlassAvatar name="Ada Lovelace" status="online" />
        <GlassAvatar name="Grace Hopper" status="busy" tone="danger" />
        <GlassTag tone="success" removable>Active</GlassTag>
        <GlassTag tone="danger" removable>Blocked</GlassTag>
      </div>

      <GlassAccordion type="multiple" tone="info">
        <GlassAccordion.Item value="faq-1">
          <GlassAccordion.Trigger itemValue="faq-1">What’s this table?</GlassAccordion.Trigger>
          <GlassAccordion.Content itemValue="faq-1">A sortable, sticky-header demo fed with mock data.</GlassAccordion.Content>
        </GlassAccordion.Item>
        <GlassAccordion.Item value="faq-2">
          <GlassAccordion.Trigger itemValue="faq-2">How do I paginate?</GlassAccordion.Trigger>
          <GlassAccordion.Content itemValue="faq-2">Use <code>&lt;GlassPagination /&gt;</code> below the table and keep page in state.</GlassAccordion.Content>
        </GlassAccordion.Item>
      </GlassAccordion>

      <FiltersCard onApply={(r, s) => { setPage(1); setRole(r); setStatus(s); }} />
    </GlassCard>
  );
}

function Kitchen() {
  return (
    <GlassToastProvider>
      <div style={{ padding:16, display:'grid', gap:16 }}>
        {/* Crumbs / header */}
        <GlassBreadcrumbs items={[
          { label:'Home', href:'#' },
          { label:'Components', href:'#' },
          { label:'Kitchen Sink' }
        ]} />
        <GlassSurface style={{ padding:12 }}>
          <TopBar />
        </GlassSurface>

        {/* Main grid */}
        <div style={{ display:'grid', gridTemplateColumns:'minmax(260px, 360px) 1fr', gap:16 }}>
          {/* Left column: form & bits (inside UsersCard near bottom for demo flow) */}
          <div style={{ display:'grid', gap:16 }}>
            <GlassCard style={{ display:'grid', gap:12 }}>
              <h3 style={{ margin:0 }}>Quick Actions</h3>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                <GlassButton>Primary</GlassButton>
                <GlassButton variant="ghost">Ghost</GlassButton>
                <GlassButton className="tone-danger">Danger</GlassButton>
              </div>
              <GlassAlert tone="success" title="All set">Your environment is configured.</GlassAlert>
            </GlassCard>

            <GlassCard style={{ display:'grid', gap:12 }}>
              <h3 style={{ margin:0 }}>Showcase</h3>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                <GlassBadge tone="primary">New</GlassBadge>
                <GlassBadge tone="success">Live</GlassBadge>
                <GlassBadge tone="info">Beta</GlassBadge>
                <GlassBadge tone="danger">Breaking</GlassBadge>
              </div>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <GlassAvatar name="N. Tesla" status="away" />
                <GlassAvatar name="A. Turing" status="offline" />
              </div>
            </GlassCard>
          </div>

          {/* Right column: data/table card */}
          <UsersCard />
        </div>
      </div>

      {/* Toast viewport */}
      <GlassToastViewport position="bottom-right" />
    </GlassToastProvider>
  );
}

// Story
export const Demo: Story = { render: () => <Kitchen /> };
