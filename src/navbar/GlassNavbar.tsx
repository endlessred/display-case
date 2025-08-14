// src/navbar/GlassNavbar.tsx
import * as React from 'react';
import clsx from 'clsx';
import { mergeRefs } from '../utils/refs';
import { composeMouseHandlers, TriggerLikeProps } from '../utils/events';

export type GlassNavbarProps = React.HTMLAttributes<HTMLElement> & {
  /** Collapse into a menu below this measured navbar width (px). Default 720. */
  collapsedAt?: number;
  /** Optional brand slot on the left. */
  brand?: React.ReactNode;
  /** Right slot (e.g., avatar). */
  right?: React.ReactNode;
};

export function GlassNavbar({
  collapsedAt = 720,
  brand,
  right,
  className,
  children,
  ...rest
}: GlassNavbarProps) {
  const hostRef = React.useRef<HTMLElement | null>(null);
  const [collapsed, setCollapsed] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  // Measure the navbar's own width (works in Storybook if canvas is narrow)
  React.useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      setCollapsed(w < collapsedAt);
      // auto-close when expanding back
      if (w >= collapsedAt) setOpen(false);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [collapsedAt]);

  return (
    <nav ref={hostRef} className={clsx('ui-glass', 'dc-navbar', className)} {...rest}>
      <div className="dc-nav__row">
        <div className="dc-nav__brand">{brand}</div>

        {collapsed ? (
          <button
            type="button"
            className={clsx('ui-glass', 'dc-btn', 'dc-nav__toggle', open && 'is-open')}
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            ☰
          </button>
        ) : (
          <ul className="dc-nav__items" role="menubar">{children}</ul>
        )}

        <div className="dc-nav__right">{right}</div>
      </div>

      {collapsed && open && (
        <ul className="dc-nav__items is-collapsed" role="menu" onClick={() => setOpen(false)}>
          {children}
        </ul>
      )}
    </nav>
  );
}

export type GlassNavItemProps = {
  /** Render as any element; defaults to <a>. */
  as?: React.ElementType;
  href?: string;               // used when as='a'
  active?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<'a'>, 'as' | 'href'>;

export const GlassNavItem = React.forwardRef<HTMLElement, GlassNavItemProps>(function GlassNavItem(
  { as, href, active, icon, children, className, onClick, ...rest },
  ref
) {
  const Comp = (as || 'a') as React.ElementType;
  const localRef = React.useRef<HTMLElement | null>(null);
  const setRef = React.useMemo(
    () => mergeRefs<HTMLElement>(localRef, ref as React.Ref<HTMLElement>),
    [ref]
  );

  const ours: React.MouseEventHandler<HTMLElement> = () => { /* could close menus, etc. */ };

  return (
    <li role="none" className="dc-nav__item">
      <Comp
        // ✅ no ts-expect-error needed; merged refs typed to HTMLElement
        ref={setRef}
        role="menuitem"
        href={Comp === 'a' ? href : undefined}
        className={clsx('dc-nav__link', active && 'is-active', className)}
        // ✅ compose handlers with generic HTMLElement type
        onClick={composeMouseHandlers(onClick as React.MouseEventHandler<HTMLElement> | undefined, ours)}
        {...(rest as any)}
      >
        {icon && <span className="dc-nav__ico" aria-hidden>{icon}</span>}
        <span className="dc-nav__label">{children}</span>
      </Comp>
    </li>
  );
});
