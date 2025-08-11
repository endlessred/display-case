import * as React from 'react';
import clsx from 'clsx';

export type NavLink = { label: string; href: string; current?: boolean };
export type GlassNavbarProps = React.HTMLAttributes<HTMLElement> & {
  brand?: React.ReactNode;
  links?: NavLink[];
  actions?: React.ReactNode;
  tone?: 'default' | 'primary' | 'success' | 'info' | 'danger';
  sticky?: boolean;
  collapseAt?: number; // px
};

export function GlassNavbar({
  brand, links, actions, tone, sticky, collapseAt = 768, className, children, ...rest
}: GlassNavbarProps) {
  const [open, setOpen] = React.useState(false);
  const [isDesktop, setIsDesktop] = React.useState(false);

  // Esc closes mobile panel
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey, { capture: true });
    return () => window.removeEventListener('keydown', onKey, { capture: true });
  }, [open]);

  // Use window width breakpoint (robust in Storybook & real apps)
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia(`(min-width: ${collapseAt}px)`);
    const update = () => setIsDesktop(mq.matches);
    update();
    // modern browsers
    mq.addEventListener?.('change', update);
    // safari fallback
    // @ts-expect-error older API
    mq.addListener?.(update);
    return () => {
      mq.removeEventListener?.('change', update);
      // @ts-expect-error older API
      mq.removeListener?.(update);
    };
  }, [collapseAt]);

  const onLinkClick = () => setOpen(false);

  return (
    <nav
      aria-label="Main"
      className={clsx(
        'ui-glass',
        'dc-navbar',
        tone && `tone-${tone}`,
        sticky && 'dc-navbar--sticky',
        open && 'dc-navbar--open',
        isDesktop && 'dc-navbar--desktop',
        className
      )}
      {...rest}
    >
      <div className="dc-navbar__row">
        <div className="dc-navbar__brand">{brand}</div>

        <ul className="dc-navbar__links">
          {links?.map(l => (
            <li key={l.href}>
              <a
                href={l.href}
                aria-current={l.current ? 'page' : undefined}
                className={clsx('dc-navlink', l.current && 'dc-navlink--current')}
                onClick={onLinkClick}
              >
                {l.label}
              </a>
            </li>
          ))}
          {children}
        </ul>

        <div className="dc-navbar__actions">{actions}</div>

        <button
          className="ui-glass dc-btn dc-navbar__toggle"
          aria-controls="dc-menu"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(s => !s)}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      <div id="dc-menu" className="dc-navbar__panel" hidden={!open}>
        <ul className="dc-navbar__panel-links">
          {links?.map(l => (
            <li key={l.href}>
              <a
                href={l.href}
                aria-current={l.current ? 'page' : undefined}
                className={clsx('dc-navlink', l.current && 'dc-navlink--current')}
                onClick={onLinkClick}
              >
                {l.label}
              </a>
            </li>
          ))}
          {children}
        </ul>
        {actions && <div className="dc-navbar__panel-actions">{actions}</div>}
      </div>
    </nav>
  );
}