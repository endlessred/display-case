# Display-Case

A lightweight glassmorphism UI library for React with a retro‑future twist.  
Built for **portfolio‑grade** visuals and **product‑grade** accessibility.

- 🧊 Elegant glass surfaces with blur fallbacks
- 🧩 Headless‑ish components with sensible styles
- 🧪 Storybook‑ready
- 🤖 “AI Kit” for chat/composer/tool calls
- ⚡ Minimal runtime deps (React, React DOM, Floating UI where needed)

---

## Quickstart

```bash
# In your Next/React app
pnpm add display-case

# If you're developing locally (repo next to your app)
# from display-case/
pnpm link --global
# from your app/
pnpm link --global display-case
```

**Next.js (App Router) layout example — order matters**

```tsx
// app/layout.tsx
import 'display-case/styles.css'; // published package entry
// or when consuming your local build: 'display-case/dist/styles.css'
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

Basic usage (client component):

```tsx
'use client';

import { GlassCard, GlassButton } from 'display-case';

export default function Example() {
  return (
    <GlassCard style={{ padding: 16 }}>
      <h3>Hello</h3>
      <GlassButton variant="primary">Click me</GlassButton>
    </GlassCard>
  );
}
```

---

## Installation & Styles

### Peer dependencies

- `react` (18+)
- `react-dom`
- `@floating-ui/react` (used by Popover, Tooltip, etc.)

### Styles

Display‑Case ships a compiled stylesheet:

- **Published builds (preferred)**  
  `import 'display-case/styles.css';`

- **Local dev (after building this repo)**  
  `import 'display-case/dist/styles.css';`  
  or the full bundle: `import 'display-case/dist/styles/index.css';`

> If you are building the CSS inside the library, ensure PostCSS is installed:
>
> ```bash
> pnpm add -D postcss postcss-cli postcss-import autoprefixer
> ```
>
> `postcss.config.cjs`
>
> ```js
> module.exports = {
>   plugins: [require('postcss-import'), require('autoprefixer')],
> };
> ```
>
> `package.json` scripts
>
> ```json
> {
>   "scripts": {
>     "build": "tsup && pnpm run build:css",
>     "build:css": "powershell -NoProfile -Command \"New-Item -ItemType Directory -Force -Path dist | Out-Null\" && postcss src/styles/index.css -o dist/styles.css"
>   }
> }
> ```

---

## Design Language

### Tones

Most components accept a `tone` or `variant`:

```
default | primary | success | info | danger | ghost
```

### Elevation

Glass surfaces support subtle elevation via CSS classes:

```
elev-sm, elev-md (default), elev-lg
```

### Retro‑Future Corners

We favor **asymmetric radii** (larger top‑right and bottom‑left). Utilities are included in styles—example usage:

```tsx
<div className="rf-corners rf-corners--card ui-glass elev-md">…</div>
```

### Backdrop Blur Fallbacks (SSR‑safe)

Blur is gated by CSS `@supports`, so SSR markup stays stable. `.ui-glass` has a non‑blur background by default; when supported, CSS applies `backdrop-filter` / `-webkit-backdrop-filter`.

---

## Using with Next.js (App Router)

- Any component using **hooks, portals, or interactive events** must render in a **Client Component** (`'use client'`).  
- Dialog, Popover, Tooltip, Toast viewport use **portals** (`document.body`) → the file that renders them must be client.  
- To mount a portal‑only widget at the page root without SSR, you can use Next dynamic import with `ssr: false`.
- Prevent hydration mismatches by avoiding server/client attribute drift (handled in library; don’t re‑introduce it).
- Import **Display‑Case CSS first**, then your globals/overrides.

---

## Components

Import from the root:

```ts
import {
  GlassSurface, GlassCard, GlassButton,
  GlassNavbar, GlassNavItem,
  GlassDialog, GlassDialogTrigger, GlassDialogContent, GlassDialogTitle, GlassDialogClose,
  GlassPopover, GlassPopoverTrigger, GlassPopoverContent,
  GlassMenu, GlassMenuTrigger, GlassMenuContent, GlassMenuItem,
  GlassTooltip,
  GlassTextField, GlassTextarea, GlassCheckbox, GlassRadioGroup, GlassRadio, GlassSwitch, GlassCombobox,
  GlassToastProvider, GlassToastViewport, GlassAlert, GlassSpinner, GlassSkeleton, GlassProgress,
  GlassBadge, GlassTag, GlassAvatar,
  GlassBreadcrumbs, GlassPagination,
  GlassTabs, GlassTabList, GlassTab, GlassTabPanels, GlassTabPanel,
  GlassAccordion, GlassAccordionItem, GlassAccordionTrigger, GlassAccordionContent,
  GlassTable
} from 'display-case';
```

### Surface / Card

```tsx
<GlassSurface elevation="md" className="rf-corners rf-corners--card">
  <header>Header</header>
  <div>Content</div>
</GlassSurface>

<GlassCard style={{ padding: 16 }} tone="info">
  Card body
</GlassCard>
```

### Button

```tsx
<GlassButton variant="primary" size="md" onClick={() => {}}>Save</GlassButton>
<GlassButton variant="ghost">Ghost</GlassButton>
```

### Navbar

```tsx
<GlassNavbar
  brand={<strong>Display-Case</strong>}
  right={<a href="/contact">Contact</a>}
>
  <GlassNavItem href="/" active>Home</GlassNavItem>
  <GlassNavItem href="/work">Work</GlassNavItem>
</GlassNavbar>
```

### Dialog

```tsx
<GlassDialog>
  <GlassDialogTrigger>Open</GlassDialogTrigger>
  <GlassDialogContent>
    <GlassDialogTitle>Title</GlassDialogTitle>
    Content…
    <GlassDialogClose>Close</GlassDialogClose>
  </GlassDialogContent>
</GlassDialog>
```

### Popover / Menu / Tooltip

```tsx
<GlassPopover>
  <GlassPopoverTrigger className="ui-glass dc-btn">Open</GlassPopoverTrigger>
  <GlassPopoverContent>Hi there</GlassPopoverContent>
</GlassPopover>

<GlassMenu>
  <GlassMenuTrigger className="ui-glass dc-btn">Menu</GlassMenuTrigger>
  <GlassMenuContent>
    <GlassMenuItem onClick={() => {}}>Item</GlassMenuItem>
  </GlassMenuContent>
</GlassMenu>

<GlassTooltip label="More info">
  <button className="ui-glass dc-btn">Hover me</button>
</GlassTooltip>
```

### Form: TextField / Textarea / Checkbox / Radio / Switch / Combobox

```tsx
<GlassTextField label="Email" placeholder="you@site.com" />

<GlassTextarea label="Message" autoGrow />

<GlassCheckbox label="Subscribe" />

<GlassRadioGroup label="Role" defaultValue="dev">
  <GlassRadio value="dev" label="Developer" />
  <GlassRadio value="pm" label="PM" />
</GlassRadioGroup>

<GlassSwitch label="Enable experimental" checked={on} onCheckedChange={setOn} />

<GlassCombobox
  options={[{ label: 'Alpha', value: 'a' }, { label: 'Beta', value: 'b' }]}
  value={val}
  onChange={setVal}
  placeholder="Pick one"
/>
```

### Feedback: Toast / Alert / Loading Trio

```tsx
// Wrap your app to show toasts
<GlassToastProvider>
  {/* …your app… */}
  <GlassToastViewport position="bottom-right" />
</GlassToastProvider>

<GlassAlert tone="info" title="Heads up">Something happened.</GlassAlert>

<GlassSpinner label="Loading" />

<GlassSkeleton width="100%" height={14} />

<GlassProgress value={32} max={100} />
```

### Data Display: Badge / Tag / Avatar

```tsx
<GlassBadge tone="success">Stable</GlassBadge>

<GlassTag tone="info" removable onRemove={() => {}}>filter:popular</GlassTag>

<GlassAvatar name="Ava Lovelace" status="online" />
```

### Navigation: Breadcrumbs / Pagination / Tabs / Accordion

```tsx
<GlassBreadcrumbs
  items={[
    { label: 'Home', href: '/' },
    { label: 'Work', href: '/work' },
    { label: 'Project' }
  ]}
/>

<GlassPagination page={3} pageCount={10} onPageChange={setPage} />

<GlassTabs defaultValue="a">
  <GlassTabList>
    <GlassTab value="a">A</GlassTab>
    <GlassTab value="b">B</GlassTab>
  </GlassTabList>
  <GlassTabPanels>
    <GlassTabPanel value="a">Content A</GlassTabPanel>
    <GlassTabPanel value="b">Content B</GlassTabPanel>
  </GlassTabPanels>
</GlassTabs>

<GlassAccordion type="single" collapsible defaultValue="item-1">
  <GlassAccordionItem value="item-1">
    <GlassAccordionTrigger itemValue="item-1">Details</GlassAccordionTrigger>
    <GlassAccordionContent itemValue="item-1">Hidden content</GlassAccordionContent>
  </GlassAccordionItem>
</GlassAccordion>
```

### Table

```tsx
<GlassTable
  columns={[
    { key: 'name', header: 'Name', sortable: true },
    { key: 'stars', header: '★', align: 'right', sortable: true }
  ]}
  data={[{ id: 1, name: 'Display-Case', stars: 42 }]}
  sortBy="stars"
  sortDir="desc"
/>
```

---

## 🤖 AI Kit

`GlassChat`, `GlassChatMessage`, `GlassComposer`, `GlassToolCall`, `GlassModelSelect`

```tsx
'use client';

import * as React from 'react';
import {
  GlassCard,
  GlassChat, GlassChatMessage, GlassComposer, GlassToolCall, GlassModelSelect
} from 'display-case';

export default function MiniChat() {
  const [messages, setMessages] = React.useState([
    { role: 'assistant' as const, text: 'Ask me about Display-Case.' }
  ]);
  const [input, setInput] = React.useState('');
  const [model, setModel] = React.useState<string | null>('gpt-4o-mini');

  return (
    <GlassCard style={{ padding: 16 }}>
      <GlassChat style={{ height: 280 }}>
        {messages.map((m, i) => (
          <GlassChatMessage key={i} role={m.role} tone={m.role === 'assistant' ? 'info' : undefined}>
            {m.text}
          </GlassChatMessage>
        ))}
        <GlassToolCall name="searchDocs" status="ok" args={{ q: 'glass blur' }} result={{ hits: 12 }} />
      </GlassChat>

      <GlassComposer
        value={input}
        onChange={setInput}
        onSend={(v) => { setMessages([...messages, { role: 'user' as const, text: v }]); setInput(''); }}
        endAdornment={
          <GlassModelSelect
            models={[
              { label: 'gpt-4o-mini', value: 'gpt-4o-mini' },
              { label: 'gpt-4.1', value: 'gpt-4.1' }
            ]}
            value={model}
            onChange={setModel}
          />
        }
      />
    </GlassCard>
  );
}
```

**Layout behavior**
- Assistant / tool / system messages align **left**; user messages align **right** (avatars follow).
- Pass `streaming` to `GlassChatMessage` for a subtle typing caret.

---

## Accessibility

- Semantic roles/ARIA for dialog, tooltip, combobox, menu, tabs, accordion, pagination, table sorting.
- Focus trap in dialog/popover; `Escape` to close.
- Keyboard navigation: menus, listboxes, tabs, accordions, pagination.
- Toasts use `role="status"` or `role="alert"` depending on tone.

---

## Storybook

```bash
# Initialize (Vite builder recommended)
pnpm dlx storybook@latest init --builder @storybook/builder-vite
```

Common TS fixes:
- Stories import `Meta`, `StoryObj` from `@storybook/react` (v8+).
- If Vite complains about `storybook/internal/preview/runtime`, bump Storybook and builder to matching latest versions.

---

## Troubleshooting

### “Module not found: Can't resolve 'display-case/styles.css'”

- When consuming a **published** package → `display-case/styles.css`.
- When consuming a **local build** → `display-case/dist/styles.css` or `display-case/dist/styles/index.css`.
- Ensure you’ve run `pnpm build` in `display-case`.

### `postcss is not recognized`

- Install PostCSS toolchain and re-run build (see Installation & Styles).

### Next.js “document is not defined”

- Use `'use client'` for any file that renders **Dialog/Popover/ToastViewport** or calls `createPortal`.
- Optionally `dynamic(() => import(...), { ssr: false })` for portal-only pieces mounted at page root.

### Hydration mismatch (e.g., `data-no-backdrop`)

- We removed server-time feature detection and rely on CSS `@supports`. If you’ve forked, ensure components don’t render different attributes between server and client.

### Popover “Cannot assign to 'current' because it is a read-only property”

- Use a **merged ref** instead of assigning to `.current` directly:
  ```tsx
  const setPanelRef = React.useMemo(
    () => mergeRefs(panelRef, refs.setFloating as React.Ref<HTMLDivElement>),
    [refs.setFloating]
  );
  ```

### “Change in order of Hooks”

- Don’t put hooks behind early returns. In `GlassPopoverContent`, run hooks unconditionally and branch only in returned JSX.

### Pagination: “Each child needs a unique key”

- Use stable keys for each `<li>` (the library now does this).

### Combobox panel cut off / z-index

- Add safe fallbacks:
  ```css
  .dc-cbx__panel, .dc-popover, .dc-menu, .dc-tooltip {
    max-width: calc(100vw - 24px);
    z-index: 60;
  }
  ```

---

## Contributing

```bash
pnpm i
pnpm dev        # or storybook
pnpm build      # tsup + postcss
pnpm test       # (if/when tests are added)
```

Repo layout:

```
src/
  button/ card/ dialog/ form/ loading/ menu/ navbar/ pagination/ popover/
  select/ surface/ tabs/ toast/ tooltip/ table/ accordion/ …
  ai/ (chat, composer, toolcall, model select)
  styles/ *.css (index.css imports the rest)
  utils/ (refs, events)
```

---

## License

MIT © 2025 — endlessred / Display‑Case
