import * as React from 'react';
import type { ElementType, ComponentPropsWithoutRef, PropsWithChildren } from 'react';
import clsx from 'clsx';

type SurfaceOwnProps = {
  elevation?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  noise?: boolean;
};

type AsProp<C extends ElementType> = { as?: C };
type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);

export type PolymorphicProps<C extends ElementType, P> =
  PropsWithChildren<P & AsProp<C>> &
  Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, P>>;

export type GlassSurfaceProps<C extends ElementType = 'div'> =
  PolymorphicProps<C, SurfaceOwnProps>;

const supportsBackdrop =
  typeof CSS !== 'undefined' &&
  (CSS.supports('backdrop-filter: blur(1px)') ||
   CSS.supports('-webkit-backdrop-filter: blur(1px)'));

export function GlassSurface<C extends ElementType = 'div'>(
  { as, elevation = 'md', interactive, className, children, ...rest }:
  GlassSurfaceProps<C>
) {
  const Tag = (as || 'div') as ElementType;
  return (
    <Tag
      data-no-backdrop={supportsBackdrop ? undefined : ''}
      className={clsx('ui-glass', `elev-${elevation}`, interactive && 'interactive', className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}