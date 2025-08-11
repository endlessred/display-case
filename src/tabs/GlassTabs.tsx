import * as React from 'react';
import clsx from 'clsx';

export type TabsOrientation = 'horizontal' | 'vertical';

export type GlassTabsProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  orientation?: TabsOrientation;
  className?: string;
  children: React.ReactNode;
};

type Ctx = {
  value: string | undefined;
  setValue: (v: string) => void;
  orientation: TabsOrientation;
  idBase: string;
};
const Ctx = React.createContext<Ctx | null>(null);
function useTabsCtx() { const c = React.useContext(Ctx); if (!c) throw new Error('GlassTabs.* must be within <GlassTabs>'); return c; }

export function GlassTabs({ value, defaultValue, onValueChange, orientation = 'horizontal', className, children }: GlassTabsProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : uncontrolled;
  const setValue = (v: string) => { if (!isControlled) setUncontrolled(v); onValueChange?.(v); };
  const idBase = React.useId().replace(/:/g, '');

  return (
    <Ctx.Provider value={{ value: current, setValue, orientation, idBase }}>
      <div className={className}>{children}</div>
    </Ctx.Provider>
  );
}

export type GlassTabListProps = React.HTMLAttributes<HTMLDivElement> & { tone?: 'default'|'primary'|'success'|'info'|'danger' };
export function GlassTabList({ className, tone, ...rest }: GlassTabListProps) {
  const { orientation } = useTabsCtx();
  return (
    <div role="tablist" aria-orientation={orientation} className={clsx('ui-glass', 'interactive', tone && `tone-${tone}`, className)} {...rest} />
  );
}

export type GlassTabProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string };
export function GlassTab({ value, className, children, ...rest }: GlassTabProps) {
  const { value: cur, setValue, orientation, idBase } = useTabsCtx();
  const selected = cur === value;
  const btnRef = React.useRef<HTMLButtonElement>(null);

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const key = e.key;
    if (!['ArrowRight','ArrowLeft','ArrowUp','ArrowDown','Home','End'].includes(key)) return;
    e.preventDefault();
    const list = btnRef.current?.closest('[role="tablist"]');
    if (!list) return;
    const tabs = Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const idx = tabs.indexOf(btnRef.current!);
    const horiz = orientation === 'horizontal';
    let next = idx;
    if ((horiz && key === 'ArrowRight') || (!horiz && key === 'ArrowDown')) next = (idx + 1) % tabs.length;
    if ((horiz && key === 'ArrowLeft')  || (!horiz && key === 'ArrowUp'))   next = (idx - 1 + tabs.length) % tabs.length;
    if (key === 'Home') next = 0;
    if (key === 'End') next = tabs.length - 1;
    tabs[next]?.focus();
    const val = tabs[next]?.getAttribute('data-value');
    if (val) setValue(val);
  };

  return (
    <button
      ref={btnRef}
      role="tab"
      data-value={value}
      id={`${idBase}-tab-${value}`}
      aria-selected={selected}
      aria-controls={`${idBase}-panel-${value}`}
      tabIndex={selected ? 0 : -1}
      className={clsx('ui-glass', 'interactive', 'dc-btn', selected && 'btn-primary', className)}
      onClick={(e) => { rest.onClick?.(e); setValue(value); }}
      onKeyDown={onKeyDown}
      {...rest}
    >
      {children}
    </button>
  );
}

export type GlassTabPanelsProps = React.HTMLAttributes<HTMLDivElement>;
export function GlassTabPanels({ className, ...rest }: GlassTabPanelsProps) {
  return <div className={className} {...rest} />;
}

export type GlassTabPanelProps = React.HTMLAttributes<HTMLDivElement> & { value: string };
export function GlassTabPanel({ value, className, children, ...rest }: GlassTabPanelProps) {
  const { value: cur, idBase } = useTabsCtx();
  const selected = cur === value;
  return (
    <div
      role="tabpanel"
      id={`${idBase}-panel-${value}`}
      aria-labelledby={`${idBase}-tab-${value}`}
      hidden={!selected}
      className={className}
      {...rest}
    >
      {children}
    </div>
  );
}