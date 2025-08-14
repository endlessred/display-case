import * as React from 'react';
import clsx from 'clsx';

type Tone = 'default' | 'primary' | 'success' | 'info' | 'danger';
type TypeMode = 'single' | 'multiple';

export type GlassAccordionProps = React.HTMLAttributes<HTMLElement> & {
  type?: TypeMode;                 // 'single' (default) or 'multiple'
  value?: string[] | string | null;
  defaultValue?: string[] | string | null;
  onValueChange?: (val: string[] | string | null) => void;
  collapsible?: boolean;           // for single: allow closing the last open
  tone?: Tone;
  children: React.ReactNode;
};

type Ctx = {
  type: TypeMode;
  openSet: Set<string>;
  toggle: (id: string) => void;
  registerTrigger: (el: HTMLButtonElement) => void;
  unregisterTrigger: (el: HTMLButtonElement) => void;
};
const ACtx = React.createContext<Ctx | null>(null);
const useACtx = () => {
  const c = React.useContext(ACtx);
  if (!c) throw new Error('GlassAccordion.* must be used within <GlassAccordion>');
  return c;
};

export function GlassAccordion({
  type = 'single',
  defaultValue = type === 'single' ? null : [],
  value,
  onValueChange,
  collapsible = true,
  tone,
  className,
  children,
  ...rest
}: GlassAccordionProps) {
  const isControlled = value !== undefined;
  const [inner, setInner] = React.useState<string[] | string | null>(defaultValue);
  const current = isControlled ? value : inner;

  const openSet = React.useMemo(() => {
    if (type === 'single') {
      const v = (current as string | null) ?? null;
      return new Set(v ? [v] : []);
    }
    return new Set(Array.isArray(current) ? current : []);
  }, [current, type]);

  const setVal = (v: string[] | string | null) => {
    if (!isControlled) setInner(v);
    onValueChange?.(v);
  };

  const toggle = (id: string) => {
    if (type === 'single') {
      const open = openSet.has(id);
      if (open) {
        if (collapsible) setVal(null);
      } else {
        setVal(id);
      }
    } else {
      const next = new Set(openSet);
      next.has(id) ? next.delete(id) : next.add(id);
      setVal(Array.from(next));
    }
  };

  // roving focus among triggers
  const triggersRef = React.useRef<Set<HTMLButtonElement>>(new Set());
  const registerTrigger = (el: HTMLButtonElement) => triggersRef.current.add(el);
  const unregisterTrigger = (el: HTMLButtonElement) => triggersRef.current.delete(el);

  return (
    <section
      className={clsx('ui-glass', 'dc-acc', tone && `tone-${tone}`, className)}
      {...rest}
    >
      <ACtx.Provider value={{ type, openSet, toggle, registerTrigger, unregisterTrigger }}>
        {children}
      </ACtx.Provider>
    </section>
  );
}

export type GlassAccordionItemProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string;
  disabled?: boolean;
  defaultOpen?: boolean; // convenience for uncontrolled multiple
};
export function GlassAccordionItem({
  value,
  disabled,
  defaultOpen,
  className,
  children,
  ...rest
}: GlassAccordionItemProps) {
  const { openSet } = useACtx();
  const isOpen = openSet.has(value) || (!!defaultOpen && openSet.size === 0); // defaultOpen only affects initial
  return (
    <div className={clsx('dc-acc__item', isOpen && 'is-open', disabled && 'is-disabled', className)} {...rest} data-acc-item={value}>
      {children}
    </div>
  );
}

export type GlassAccordionTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  itemValue: string;
};
export function GlassAccordionTrigger({ itemValue, className, onKeyDown, onClick, ...rest }: GlassAccordionTriggerProps) {
  const { openSet, toggle, registerTrigger, unregisterTrigger } = useACtx();
  const isOpen = openSet.has(itemValue);
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const panelId = React.useId().replace(/:/g, '') + '-panel';
  const headerId = React.useId().replace(/:/g, '') + '-header';

  React.useEffect(() => {
    const el = btnRef.current;
    if (!el) return;
    registerTrigger(el);
    return () => unregisterTrigger(el);
  }, [registerTrigger, unregisterTrigger]);

  const handleKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e);
    const key = e.key;
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) return;
    e.preventDefault();
    const triggers = Array.from(document.querySelectorAll<HTMLButtonElement>('.dc-acc__trigger'));
    const i = triggers.indexOf(btnRef.current!);
    if (i < 0) return;
    const prev = (idx: number) => triggers[(idx - 1 + triggers.length) % triggers.length]?.focus();
    const next = (idx: number) => triggers[(idx + 1) % triggers.length]?.focus();
    if (key === 'ArrowDown') next(i);
    else if (key === 'ArrowUp') prev(i);
    else if (key === 'Home') triggers[0]?.focus();
    else if (key === 'End') triggers[triggers.length - 1]?.focus();
  };

  return (
    <h3 id={headerId} className="dc-acc__header">
      <button
        ref={btnRef}
        className={clsx('ui-glass', 'dc-btn', 'dc-acc__trigger', isOpen && 'is-open', className)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={(e) => { toggle(itemValue); onClick?.(e); }}
        onKeyDown={handleKey}
        {...rest}
      />
    </h3>
  );
}

export type GlassAccordionContentProps = React.HTMLAttributes<HTMLDivElement> & {
  itemValue: string;
};
export function GlassAccordionContent({ itemValue, className, children, ...rest }: GlassAccordionContentProps) {
  const { openSet } = useACtx();
  const isOpen = openSet.has(itemValue);
  const panelId = React.useId().replace(/:/g, '') + '-panel';

  return (
    <div
      id={panelId}
      role="region"
      aria-labelledby="" /* the trigger's heading label is inside the trigger button */
      hidden={!isOpen}
      className={clsx('dc-acc__panel', isOpen && 'is-open', className)}
      {...rest}
    >
      {children}
    </div>
  );
}

GlassAccordion.Item = GlassAccordionItem;
GlassAccordion.Trigger = GlassAccordionTrigger;
GlassAccordion.Content = GlassAccordionContent;
