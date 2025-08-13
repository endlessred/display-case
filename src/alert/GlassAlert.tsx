import * as React from 'react';
import clsx from 'clsx';

export type AlertTone = 'default' | 'primary' | 'success' | 'info' | 'danger';

export type GlassAlertProps = React.HTMLAttributes<HTMLDivElement> & {
  tone?: AlertTone;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
};

export function GlassAlert({
  tone = 'info',
  title,
  children,
  actions,
  dismissible,
  onDismiss,
  className,
  ...rest
}: GlassAlertProps) {
  const role = tone === 'danger' ? 'alert' : 'status';

  return (
    <div
      role={role}
      className={clsx('ui-glass', 'dc-alert', tone !== 'default' && `tone-${tone}`, className)}
      {...rest}
    >
      <div className="dc-alert__main">
        {title && <div className="dc-alert__title">{title}</div>}
        {children && <div className="dc-alert__desc">{children}</div>}
      </div>
      <div className="dc-alert__side">
        {actions}
        {dismissible && (
          <button className="ui-glass dc-btn btn-ghost" aria-label="Dismiss alert" onClick={onDismiss}>
            ✕
          </button>
        )}
      </div>
    </div>
  );
}