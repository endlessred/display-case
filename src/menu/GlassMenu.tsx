import * as React from 'react';
import clsx from 'clsx';
import { GlassPopover, GlassPopoverTrigger, GlassPopoverContent } from '../popover';

export type GlassMenuProps = {
  children: React.ReactNode;
  tone?: 'default'|'primary'|'success'|'info'|'danger';
  placement?: 'bottom-start'|'bottom-end'|'top-start'|'top-end';
};

export function GlassMenu({ children, tone, placement = 'bottom-start' }: GlassMenuProps) {
  return (
    <GlassPopover tone={tone} placement={placement}>{children}</GlassPopover>
  );
}

export const GlassMenuTrigger = GlassPopoverTrigger;

export type GlassMenuContentProps = React.HTMLAttributes<HTMLUListElement>;
export function GlassMenuContent({ className, children, ...rest }: GlassMenuContentProps) {
  return (
    <GlassPopoverContent className={clsx('dc-menu', className)}>
      <ul role="menu" className="dc-menu__list" {...rest}>
        {children}
      </ul>
    </GlassPopoverContent>
  );
}

export type GlassMenuItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  inset?: boolean;
};

export function GlassMenuItem({ className, inset, children, onKeyDown, onClick, ...rest }: GlassMenuItemProps) {
  const ref = React.useRef<HTMLButtonElement>(null);

  // keyboard nav + typeahead
  const onKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e);
    const key = e.key;
    const owner = ref.current?.closest('[role="menu"]')!;
    if (!owner) return;
    const items = Array.from(owner.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'));
    const idx = items.indexOf(ref.current!);
    const goto = (i: number) => items[i]?.focus();

    if (key === 'ArrowDown') { e.preventDefault(); goto((idx + 1) % items.length); }
    else if (key === 'ArrowUp') { e.preventDefault(); goto((idx - 1 + items.length) % items.length); }
    else if (key === 'Home') { e.preventDefault(); goto(0); }
    else if (key === 'End') { e.preventDefault(); goto(items.length - 1); }
    else if (key.length === 1 && /[A-Za-z0-9]/.test(key)) {
      e.preventDefault();
      const buffer = ((onKey as any)._buf = (((onKey as any)._buf || '') + key).slice(-32));
      const start = (idx + 1) % items.length;
      for (let i = 0; i < items.length; i++) {
        const j = (start + i) % items.length;
        const text = (items[j].textContent || '').trim().toLowerCase();
        if (text.startsWith(buffer.toLowerCase())) { items[j].focus(); break; }
      }
      clearTimeout((onKey as any)._t);
      (onKey as any)._t = setTimeout(() => { (onKey as any)._buf = ''; }, 500);
    } else if (key === 'Escape') {
      // let Popover handler close on Esc
    }
  };

  return (
    <li role="none">
      <button
        ref={ref}
        role="menuitem"
        className={clsx('dc-menu__item ui-glass interactive', inset && 'dc-menu__item--inset', className)}
        onKeyDown={onKey}
        onClick={(e) => { onClick?.(e); }}
        {...rest}
      >
        {children}
      </button>
    </li>
  );
}