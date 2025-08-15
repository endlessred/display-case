import * as React from 'react';
import clsx from 'clsx';
import { GlassTag } from '../tag';
import { GlassAvatar } from '../avatar';

type Role = 'user' | 'assistant' | 'system' | 'tool';

export type GlassChatMessageProps = React.HTMLAttributes<HTMLDivElement> & {
  role: Role;
  name?: string;
  avatarSrc?: string;
  /** Optional compact header with name / role tag */
  header?: React.ReactNode;
  /** Right-aligned actions row (copy, retry, …) */
  actions?: React.ReactNode;
  /** Optional inline chips (e.g., sources) */
  chips?: React.ReactNode;
  /** Show subtle streaming caret */
  streaming?: boolean;
  /** Tone tint for assistant/tool bubbles */
  tone?: 'default' | 'primary' | 'success' | 'info' | 'danger';
};

export function GlassChatMessage({
  role,
  name,
  avatarSrc,
  header,
  actions,
  chips,
  streaming,
  tone,
  className,
  children,
  ...rest
}: GlassChatMessageProps) {
  const isUser = role === 'user';
  const isTool = role === 'tool';
  const isSystem = role === 'system';

  return (
    <div
      className={clsx(
        'dc-chat-msg',
        `role-${role}`,
        tone && `tone-${tone}`,
        className
      )}
      {...rest}
    >
      <div className="dc-chat-msg__side">
        <GlassAvatar
          src={avatarSrc}
          name={name || role}
          size="sm"
          tone={isUser ? undefined : 'info'}
        />
      </div>

      <div className="dc-chat-msg__main">
        <div className="dc-chat-msg__meta">
          <strong className="dc-chat-msg__name">{name || (isUser ? 'You' : isTool ? 'Tool' : isSystem ? 'System' : 'Assistant')}</strong>
          <GlassTag tone={isTool ? 'info' : isSystem ? 'danger' : 'primary'} className="dc-chat-msg__role">
            {role}
          </GlassTag>
          <div className="dc-chat-msg__spacer" />
          {actions}
        </div>

        <div className="dc-chat-msg__bubble ui-glass">
          {children}
          {streaming && <span className="dc-chat-caret" aria-hidden>▍</span>}
        </div>

        {chips && <div className="dc-chat-msg__chips">{chips}</div>}
      </div>
    </div>
  );
}