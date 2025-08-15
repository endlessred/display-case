import * as React from 'react';
import clsx from 'clsx';

export type GlassChatProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Auto-scroll to last message when children change */
  autoscroll?: boolean;
};

export function GlassChat({ className, children, autoscroll = true, ...rest }: GlassChatProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!autoscroll || !ref.current) return;
    ref.current.scrollTop = ref.current.scrollHeight;
  }, [children, autoscroll]);

  return (
    <div ref={ref} className={clsx('dc-chat', className)} {...rest}>
      {children}
    </div>
  );
}