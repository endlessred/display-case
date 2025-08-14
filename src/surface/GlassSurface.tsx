import * as React from 'react';
import clsx from 'clsx';

// adjust types to whatever you already have
export type GlassSurfaceProps = React.ComponentPropsWithoutRef<'div'> & {
  as?: keyof JSX.IntrinsicElements;
  elevation?: 'sm' | 'md' | 'lg';
  tone?: 'default' | 'primary' | 'success' | 'info' | 'danger';
  /** Optional manual override; true = force no backdrop */
  noBackdrop?: boolean;
};

export function GlassSurface({
  as = 'div',
  elevation = 'md',
  tone,
  className,
  children,
  noBackdrop: noBackdropProp,
  ...rest
}: GlassSurfaceProps) {
  const Tag = as as any;

  // null = unknown (matches server output); boolean after mount
  const [noBackdrop, setNoBackdrop] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    if (noBackdropProp != null) {
      setNoBackdrop(!!noBackdropProp);
      return;
    }
    let supported = false;
    try {
      // Only run on client; guard handles old browsers
      // eslint-disable-next-line no-restricted-globals
      const css = typeof CSS !== 'undefined' ? CSS : undefined;
      supported = !!(
        css?.supports?.('backdrop-filter', 'blur(0px)') ||
        css?.supports?.('-webkit-backdrop-filter', 'blur(0px)')
      );
    } catch {
      supported = false;
    }
    setNoBackdrop(!supported);
  }, [noBackdropProp]);

  return (
    <Tag
      // In case the attribute appears/disappears post-hydration
      suppressHydrationWarning
      data-no-backdrop={noBackdrop ? '' : undefined}
      className={clsx('ui-glass', `elev-${elevation}`, tone && `tone-${tone}`, className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}