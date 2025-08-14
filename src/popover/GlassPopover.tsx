import * as React from 'react';
import clsx from 'clsx';
import { createPortal } from 'react-dom';
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/react';
import { mergeRefs } from '../utils/refs';

type Tone = 'default' | 'primary' | 'success' | 'info' | 'danger';

type Ctx = {
  open: boolean;
  setOpen: (v: boolean) => void;
  tone?: Tone;
  refs: {
    reference: React.MutableRefObject<HTMLElement | null>;
    floating: React.MutableRefObject<HTMLElement | null>;
    setReference: (node: HTMLElement | null) => void;
    setFloating: (node: HTMLElement | null) => void;
  };
  floating: ReturnType<typeof useFloating>;
};

const PopoverCtx = React.createContext<Ctx | null>(null);
function usePopoverCtx() {
  const v = React.useContext(PopoverCtx);
  if (!v) throw new Error('GlassPopover.* must be used within <GlassPopover>');
  return v;
}

export type GlassPopoverProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?:
    | 'top' | 'bottom' | 'left' | 'right'
    | 'top-start' | 'top-end'
    | 'bottom-start' | 'bottom-end'
    | 'left-start' | 'left-end'
    | 'right-start' | 'right-end';
  tone?: Tone;
  children?: React.ReactNode;
};

export function GlassPopover({
  open,
  defaultOpen,
  onOpenChange,
  placement = 'bottom-start',
  tone,
  children,
}: GlassPopoverProps) {
  const controlled = open !== undefined;
  const [inner, setInner] = React.useState(!!defaultOpen);
  const isOpen = controlled ? !!open : inner;
  const setOpen = (v: boolean) => {
    if (!controlled) setInner(v);
    onOpenChange?.(v);
  };

  const floating = useFloating({
    placement,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  // Keep position synced while open
  React.useEffect(() => {
    if (!isOpen) return;
    const refEl = floating.refs.reference.current;
    const floatEl = floating.refs.floating.current;
    if (!refEl || !floatEl) return;
    return autoUpdate(refEl, floatEl, floating.update);
  }, [isOpen, floating.refs.reference, floating.refs.floating, floating.update]);

  // ESC to close
  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey, { capture: true });
    return () => window.removeEventListener('keydown', onKey, { capture: true });
  }, [isOpen]);

  return (
    <PopoverCtx.Provider value={{ open: isOpen, setOpen, tone, refs: floating.refs as any, floating }}>
      {children}
    </PopoverCtx.Provider>
  );
}

export type GlassPopoverTriggerProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean };

export function GlassPopoverTrigger({ asChild, ...props }: GlassPopoverTriggerProps) {
  const { open, setOpen, refs } = usePopoverCtx();
  const onClick: React.MouseEventHandler<HTMLElement> = (e) => {
    props.onClick?.(e as any);
    setOpen(!open);
  };

  if (asChild) {
    const child = React.Children.only(props.children) as React.ReactElement;
    return React.cloneElement(child, {
      ref: mergeRefs(child.props.ref, refs.setReference as any),
      'aria-haspopup': 'dialog',
      'aria-expanded': open,
      onClick: (e: any) => {
        child.props.onClick?.(e);
        onClick(e);
      },
    });
  }

  return (
    <button
      ref={refs.setReference as unknown as React.Ref<HTMLButtonElement>}
      aria-haspopup="dialog"
      aria-expanded={open}
      {...props}
      onClick={onClick as any}
    />
  );
}

export type GlassPopoverContentProps = React.HTMLAttributes<HTMLDivElement>;

export function GlassPopoverContent({
  className,
  children,
  ...rest
}: GlassPopoverContentProps) {
  const { open, setOpen, tone, refs, floating } = usePopoverCtx();

  // ✅ All hooks run unconditionally (avoids hook order warnings)
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const setPanelRef = React.useMemo(
    () => mergeRefs<HTMLDivElement>(panelRef, refs.setFloating as unknown as React.Ref<HTMLDivElement>),
    [refs.setFloating]
  );

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const panel = panelRef.current;
      const trigger = refs.reference.current as HTMLElement | null;
      const target = e.target as Node;
      if (!panel) return;
      if (!panel.contains(target) && (!trigger || !trigger.contains(target))) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown, true);
    return () => document.removeEventListener('mousedown', onDown, true);
  }, [open, setOpen, refs.reference]);

  // Minimal focus trap while open
  React.useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    if (!panel) return;

    const first =
      (panel.querySelector(
        '[data-autofocus], button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement) || panel;
    first.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')
      ).filter((el) => !el.hasAttribute('disabled'));
      if (!focusables.length) return;
      const f = focusables[0];
      const l = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (!active || !panel.contains(active)) {
        e.preventDefault();
        (e.shiftKey ? l : f).focus();
        return;
      }
      if (!e.shiftKey && active === l) {
        e.preventDefault();
        f.focus();
      }
      if (e.shiftKey && active === f) {
        e.preventDefault();
        l.focus();
      }
    };

    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      prev?.focus({ preventScroll: true });
    };
  }, [open]);

  // ⬇️ Only branch in returned JSX (safe)
  return open
    ? createPortal(
        <div
          ref={setPanelRef}
          role="dialog"
          className={clsx('ui-glass', 'dc-popover', tone && `tone-${tone}`, className)}
          style={{
            position: floating.strategy as any,
            top: floating.y ?? 0,
            left: floating.x ?? 0,
            padding: 8,
            minWidth: 200,
          }}
          {...rest}
        >
          {children}
        </div>,
        document.body
      )
    : null;
}