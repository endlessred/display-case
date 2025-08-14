import * as React from 'react';
import clsx from 'clsx';

export type Crumb = { label: React.ReactNode; href?: string };
export type GlassBreadcrumbsProps = React.HTMLAttributes<HTMLElement> & {
  items?: Crumb[];                    // optional convenience API
  separator?: React.ReactNode;        // default handled in CSS
  tone?: 'default' | 'primary' | 'success' | 'info' | 'danger';
  children?: React.ReactNode;         // <GlassBreadcrumbs.Item /> form
};

export function GlassBreadcrumbs({
  items,
  tone,
  className,
  children,
  ...rest
}: GlassBreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={clsx('ui-glass', 'dc-bc', tone && `tone-${tone}`, className)}
      {...rest}
    >
      <ol className="dc-bc__list">
        {items
          ? items.map((c, i) => {
              const last = i === items.length - 1;
              return (
                <li key={i} className="dc-bc__item">
                  {last || !c.href ? (
                    <span aria-current={last ? 'page' : undefined} className="dc-bc__link dc-bc__link--current">
                      {c.label}
                    </span>
                  ) : (
                    <a className="dc-bc__link" href={c.href}>{c.label}</a>
                  )}
                </li>
              );
            })
          : children}
      </ol>
    </nav>
  );
}

export type GlassBreadcrumbItemProps = React.LiHTMLAttributes<HTMLLIElement> & {
  href?: string;
  current?: boolean;
};
export function GlassBreadcrumbItem({ href, current, className, children, ...rest }: GlassBreadcrumbItemProps) {
  return (
    <li className={clsx('dc-bc__item', className)} {...rest}>
      {href && !current ? (
        <a className="dc-bc__link" href={href}>{children}</a>
      ) : (
        <span className="dc-bc__link dc-bc__link--current" aria-current={current ? 'page' : undefined}>
          {children}
        </span>
      )}
    </li>
  );
}

GlassBreadcrumbs.Item = GlassBreadcrumbItem;