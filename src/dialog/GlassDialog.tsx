import * as React from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

type DialogContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
  triggerRef: React.RefObject<HTMLElement>;
};
const DialogCtx = React.createContext<DialogContextValue | null>(null);

export type GlassDialogProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
};

export function GlassDialog({ open, defaultOpen, onOpenChange, children }: GlassDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(!!defaultOpen);
  const isControlled = open !== undefined;
  const valueOpen = isControlled ? !!open : uncontrolledOpen;
  const setOpen = (v: boolean) => {
    if (!isControlled) setUncontrolledOpen(v);
    onOpenChange?.(v);
  };
  const triggerRef = React.useRef<HTMLElement>(null);

  return (
    <DialogCtx.Provider value={{ open: valueOpen, setOpen, triggerRef }}>
      {children}
    </DialogCtx.Provider>
  );
}

function useDialogCtx() {
  const ctx = React.useContext(DialogCtx);
  if (!ctx) throw new Error('GlassDialog.* must be used within <GlassDialog>');
  return ctx;
}

export type GlassDialogTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean };
export function GlassDialogTrigger({ asChild, ...rest }: GlassDialogTriggerProps) {
  const { setOpen, triggerRef } = useDialogCtx();
  const onClick = (e: React.MouseEvent) => {
    rest.onClick?.(e);
    setOpen(true);
  };

  if (asChild) {
    return React.cloneElement(React.Children.only(rest.children as React.ReactElement), {
      onClick,
      ref: triggerRef as any,
    });
  }
  return <button ref={triggerRef as any} {...rest} onClick={onClick} />;
}

export type GlassDialogContentProps = React.HTMLAttributes<HTMLDivElement> & {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  className?: string;
};
export function GlassDialogContent({ className, children, ...rest }: GlassDialogContentProps) {
  const { open, setOpen, triggerRef } = useDialogCtx();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const lastFocused = React.useRef<HTMLElement | null>(null);

  // lock scroll on body while open
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // on open: store active element and focus first focusable
  React.useEffect(() => {
    if (!open) return;
    lastFocused.current = (document.activeElement as HTMLElement) || null;
    const node = contentRef.current;
    if (!node) return;
    // try focus element with [data-autofocus], else first focusable, else the panel
    const focusable = node.querySelector<HTMLElement>(
      '[data-autofocus], button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    (focusable || node).focus({ preventScroll: true });
  }, [open]);

  // on close: restore focus to trigger (or last)
  const close = React.useCallback(() => {
    setOpen(false);
    const el = triggerRef.current || lastFocused.current;
    if (el) el.focus({ preventScroll: true });
  }, [setOpen, triggerRef]);

  // focus trap + esc
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close();
      } else if (e.key === 'Tab') {
        const node = contentRef.current;
        if (!node) return;
        const focusables = Array.from(
          node.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
        if (focusables.length === 0) return;
        const first = focusables[0], last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        const goingBack = e.shiftKey;
        if (!active) return;
        if (!node.contains(active)) {
          (goingBack ? last : first).focus();
          e.preventDefault();
        } else if (!goingBack && active === last) {
          first.focus(); e.preventDefault();
        } else if (goingBack && active === first) {
          last.focus(); e.preventDefault();
        }
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [open, close]);

  if (!open) return null;

  return createPortal(
    <div className="dc-overlay" aria-hidden={false} onMouseDown={(e) => {
      // click outside to close
      if (e.target === e.currentTarget) close();
    }}>
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        className={clsx('ui-glass', 'dc-dialog', className)}
        tabIndex={-1}
        {...rest}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

export type GlassDialogTitleProps = React.HTMLAttributes<HTMLHeadingElement>;
export function GlassDialogTitle(props: GlassDialogTitleProps) {
  return <h2 className={clsx('dc-dialog__title', props.className)} {...props} />;
}

export type GlassDialogCloseProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
export function GlassDialogClose({ children = 'Close', ...rest }: GlassDialogCloseProps) {
  const { setOpen } = useDialogCtx();
  return (
    <button {...rest} onClick={(e) => { rest.onClick?.(e); setOpen(false); }}>
      {children}
    </button>
  );
}