import * as React from 'react';
import clsx from 'clsx';

export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline' | undefined;

export type GlassAvatarProps = React.HTMLAttributes<HTMLDivElement> & {
  src?: string;
  alt?: string;
  name?: string;                 // used for initials fallback
  size?: 'sm' | 'md' | 'lg' | number;  // px if number
  square?: boolean;              // default circle
  tone?: 'default' | 'primary' | 'success' | 'info' | 'danger';
  status?: AvatarStatus;
};

const initialsFrom = (name?: string) => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map(p => p[0]?.toUpperCase() ?? '').join('');
};

export function GlassAvatar({
  src,
  alt,
  name,
  size = 'md',
  square,
  tone,
  status,
  className,
  ...rest
}: GlassAvatarProps) {
  const px = typeof size === 'number' ? size : size === 'sm' ? 28 : size === 'lg' ? 56 : 40;
  const [loaded, setLoaded] = React.useState(false);
  const initials = initialsFrom(name);

  return (
    <div
      className={clsx('ui-glass', 'dc-avatar', square && 'is-square', tone && `tone-${tone}`, className)}
      style={{ width: px, height: px }}
      {...rest}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={clsx('dc-avatar__img', loaded && 'is-loaded')}
          src={src}
          alt={alt || name || 'Avatar'}
          width={px}
          height={px}
          onLoad={() => setLoaded(true)}
        />
      ) : (
        <span className="dc-avatar__fallback" aria-hidden={!!name}>
          {initials || '•'}
        </span>
      )}

      {status && <span className={clsx('dc-avatar__status', `st-${status}`)} aria-hidden="true" />}
    </div>
  );
}