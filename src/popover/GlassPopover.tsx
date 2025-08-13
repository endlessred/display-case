import * as React from 'react';
import { createPortal } from 'react-dom';
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/react-dom';
import clsx from 'clsx';

export type GlassPopoverProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (o: boolean) => void;
  placement?: 'top'|'bottom'|'left'|'right'|'top-start'|'top-end'|'bottom-start'|'bottom-end';
  trapFocus?: boolean;
  tone?: 'default'|'primary'|'success'|'info'|'danger';
  children: React.ReactNode;
};

type Ctx = {
  open: boolean;
  setOpen: (o: boolean) => void;
  tone?: GlassPopoverProps['tone'];
  refs: ReturnType<typeof useFloating>['refs'];
  floating: ReturnType<typeof useFloating>;
};
const Ctx = React.createContext<Ctx | null>(null);
const useCtx = () => { const c = React.useContext(Ctx); if (!c) throw new Error('GlassPopover.* must be used in <GlassPopover>'); return c; };

export function GlassPopover({ open, defaultOpen, onOpenChange, placement = 'bottom-start', trapFocus = true, tone, children }: GlassPopoverProps) {
  const [internal, setInternal] = React.useState(!!defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? !!open : internal;
  const setOpen = (o: boolean) => { if (!isControlled) setInternal(o); onOpenChange?.(o); };

  const floating = useFloating({ placement, middleware: [offset(8), flip(), shift({ padding: 8 })] });

  React.useEffect(() => {
    const ref = floating.refs.reference.current;
    const flo = floating.refs.floating.current;
    if (!ref || !flo || !isOpen) return;
    return autoUpdate(ref, flo, floating.update);
  }, [isOpen, floating.refs.reference, floating.refs.floating, floating.update]);

  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey, { capture: true });
    return () => window.removeEventListener('keydown', onKey, { capture: true });
  }, [isOpen]);

  return (
    <Ctx.Provider value={{ open: isOpen, setOpen, tone, refs: floating.refs, floating }}>
      {children}
    </Ctx.Provider>
  );
}

export type GlassPopoverTriggerProps = { asChild?: boolean } & React.HTMLAttributes<HTMLElement>;
export function GlassPopoverTrigger({ asChild, ...props }: GlassPopoverTriggerProps) {
  const { open, setOpen, refs } = useCtx();
  const onClick = (e: any) => { props.onClick?.(e); setOpen(!open); };

  if (asChild) {
    const child = React.Children.only((props.children as React.ReactElement));
    return React.cloneElement(child, { ref: refs.setReference, 'aria-expanded': open, 'aria-haspopup': 'dialog', onClick });
  }
  return (
    <button ref={refs.setReference as any} aria-haspopup="dialog" aria-expanded={open} onClick={onClick} {...props} />
  );
}

export type GlassPopoverContentProps = React.HTMLAttributes<HTMLDivElement> & { className?: string };
export function GlassPopoverContent({ className, children, ...rest }: GlassPopoverContentProps) {
  const { open, setOpen, tone, refs, floating } = useCtx();
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const p = panelRef.current;
      const refEl = refs.reference.current as HTMLElement | null;
      if (!p) return;
      if (p.contains(e.target as Node)) return;
      if (refEl && refEl.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDown, true);
    return () => document.removeEventListener('mousedown', onDown, true);
  }, [open, setOpen, refs.reference]);

  React.useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const node = panelRef.current;
    if (!node) return;
    const focusFirst = () => {
      const el = node.querySelector<HTMLElement>('[data-autofocus], button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      (el || node).focus({ preventScroll: true });
    };
    focusFirst();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusables = Array.from(
        node.querySelectorAll<HTMLElement>('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')
      ).filter(el => !el.hasAttribute('disabled'));
      if (focusables.length === 0) return;
      const first = focusables[0], last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (!active || !node.contains(active)) { e.preventDefault(); (e.shiftKey ? last : first).focus(); return; }
      if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
      if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      prev?.focus({ preventScroll: true });
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      ref={node => { panelRef.current = node!; refs.setFloating(node as any); }}
      role="dialog"
      className={clsx('ui-glass', 'dc-popover', tone && `tone-${tone}`, className)}
      style={{ position: (floating.strategy as any), top: (floating.y ?? 0), left: (floating.x ?? 0), padding: 8, minWidth: 200 }}
      {...rest}
    >
      {children}
    </div>,
    document.body
  );
}