import * as React from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

export type ToastTone = 'default' | 'primary' | 'success' | 'info' | 'danger';
export type ToastPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

export type Toast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  tone?: ToastTone;
  duration?: number;               // ms (default 4000)
  action?: { label: string; onClick?: () => void };
  onClose?: () => void;
};

type Ctx = {
  toasts: Toast[];
  push: (t: Omit<Toast, 'id'> & { id?: string }) => string;
  dismiss: (id: string) => void;
  clear: () => void;
};
const ToastCtx = React.createContext<Ctx | null>(null);

export function useGlassToast() {
  const ctx = React.useContext(ToastCtx);
  if (!ctx) throw new Error('useGlassToast must be used within <GlassToastProvider>');
  return ctx;
}

export type GlassToastProviderProps = {
  children: React.ReactNode;
};
export function GlassToastProvider({ children }: GlassToastProviderProps) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const push: Ctx['push'] = (t) => {
    const id = t.id || Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, duration: 4000, ...t }]);
    return id;
  };
  const dismiss: Ctx['dismiss'] = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };
  const clear = () => setToasts([]);

  const value = React.useMemo(() => ({ toasts, push, dismiss, clear }), [toasts]);

  return <ToastCtx.Provider value={value}>{children}</ToastCtx.Provider>;
}

export type GlassToastViewportProps = {
  position?: ToastPosition;
  className?: string;
};
export function GlassToastViewport({ position = 'bottom-right', className }: GlassToastViewportProps) {
  const { toasts, dismiss } = useGlassToast();

  return createPortal(
    <div
      className={clsx('dc-toast-viewport', `pos-${position}`, className)}
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
      ))}
    </div>,
    document.body
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const { id, title, description, action, tone = 'default', duration = 4000, onClose } = toast;
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (paused) return;
    const tm = window.setTimeout(() => {
      onDismiss();
      onClose?.();
    }, duration);
    return () => window.clearTimeout(tm);
  }, [paused, duration, onDismiss, onClose]);

  const role = tone === 'danger' ? 'alert' : 'status';

  return (
    <div
      role={role}
      aria-live={tone === 'danger' ? 'assertive' : 'polite'}
      tabIndex={0}
      className={clsx('ui-glass', 'dc-toast', tone !== 'default' && `tone-${tone}`)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onDismiss(); toast.onClose?.();
        }
      }}
    >
      <div className="dc-toast__body">
        {title && <div className="dc-toast__title">{title}</div>}
        {description && <div className="dc-toast__desc">{description}</div>}
      </div>

      <div className="dc-toast__actions">
        {action && (
          <button
            className="ui-glass dc-btn btn-ghost"
            onClick={() => { action.onClick?.(); onDismiss(); toast.onClose?.(); }}
          >
            {action.label}
          </button>
        )}
        <button
          className="ui-glass dc-btn btn-ghost"
          aria-label="Dismiss notification"
          onClick={() => { onDismiss(); toast.onClose?.(); }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}