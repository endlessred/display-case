import * as React from 'react';
import { createPortal } from 'react-dom';
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/react-dom';
import clsx from 'clsx';

export type GlassTooltipProps = {
  label: React.ReactNode;
  children: React.ReactElement; // one focusable child
  tone?: 'default'|'primary'|'success'|'info'|'danger';
  openDelay?: number;
  closeDelay?: number;
};

export function GlassTooltip({ label, children, tone, openDelay = 150, closeDelay = 150 }: GlassTooltipProps) {
  const [open, setOpen] = React.useState(false);
  const { x, y, refs, strategy, update } = useFloating({ placement: 'top', middleware: [offset(8), flip(), shift()] });

  React.useEffect(() => {
    if (!refs.reference.current || !refs.floating.current) return;
    return autoUpdate(refs.reference.current, refs.floating.current, update);
  }, [refs.reference, refs.floating, update]);

  const id = React.useId();
  const show = () => { window.clearTimeout((show as any)._t); (show as any)._t = window.setTimeout(() => setOpen(true), openDelay); };
  const hide = () => { window.clearTimeout((show as any)._t); window.setTimeout(() => setOpen(false), closeDelay); };

  const child = React.Children.only(children);

  return (
    <>
      {React.cloneElement(child, {
        ref: refs.setReference,
        'aria-describedby': open ? id : undefined,
        onFocus: (e: any) => { child.props.onFocus?.(e); show(); },
        onBlur:  (e: any) => { child.props.onBlur?.(e); hide(); },
        onMouseEnter: (e: any) => { child.props.onMouseEnter?.(e); show(); },
        onMouseLeave: (e: any) => { child.props.onMouseLeave?.(e); hide(); },
      })}
      {open && createPortal(
        <div
          ref={refs.setFloating}
          id={id}
          role="tooltip"
          className={clsx('ui-glass', 'dc-tooltip', tone && `tone-${tone}`)}
          style={{ position: strategy as any, top: y ?? 0, left: x ?? 0, padding: 8, maxWidth: 280 }}
        >
          {label}
        </div>,
        document.body
      )}
    </>
  );
}