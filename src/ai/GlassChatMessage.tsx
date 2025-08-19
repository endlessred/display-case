import * as React from 'react';
import clsx from 'clsx';
import { GlassTag } from '../tag';
import { GlassAvatar } from '../avatar';
import { Markdown } from '../utils/Markdown';
import { TypingDots } from './TypingDots';
import { GlassSpinner } from '../loading/GlassSpinner';

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
  /** Show subtle streaming caret (for live generation) */
  streaming?: boolean;
  /** Tone tint for assistant/tool bubbles */
  tone?: 'default' | 'primary' | 'success' | 'info' | 'danger';

  /** Plain text content of the message (preferred for Markdown rendering). */
  text?: string;

  /**
   * If true, render `text` (or string children) as Markdown (GFM, code fences).
   * Or pass a custom renderer `(text) => ReactNode`.
   */
  markdown?: boolean | ((text: string) => React.ReactNode);

  /**
   * When true, show a visible thinking indicator inside the bubble.
   * If omitted, we also show it when `streaming` is true AND body text is empty.
   */
  thinking?: boolean;
  /** Choose the thinking indicator style */
  thinkingStyle?: 'dots' | 'spinner' | 'skeleton';
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
  text,
  markdown,
  thinking,
  thinkingStyle = 'dots',
  className,
  children,
  ...rest
}: GlassChatMessageProps) {
  const isUser = role === 'user';
  const isTool = role === 'tool';
  const isSystem = role === 'system';

  // Pick the raw body text: prefer explicit `text`, otherwise string children
  const rawText =
    text !== undefined
      ? text
      : typeof children === 'string'
        ? children
        : '';

  // Render the body: markdown -> custom function -> plain text
  let body: React.ReactNode;
  if (markdown && rawText) {
    body =
      typeof markdown === 'function'
        ? markdown(rawText)
        : <Markdown>{rawText}</Markdown>;
  } else if (rawText) {
    body = rawText;
  } else {
    // No text; if there are non-string children, show them (e.g., custom JSX body)
    body = typeof children === 'string' ? null : children;
  }

  const isEmpty = !rawText || rawText.trim() === '';
  const showThinking = thinking ?? (streaming && isEmpty);

  return (
    <div
      className={clsx('dc-chat-msg', `role-${role}`, tone && `tone-${tone}`, className)}
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
          <strong className="dc-chat-msg__name">
            {name || (isUser ? 'You' : isTool ? 'Tool' : isSystem ? 'System' : 'Assistant')}
          </strong>
          <GlassTag
            tone={isTool ? 'info' : isSystem ? 'danger' : 'primary'}
            className="dc-chat-msg__role"
          >
            {role}
          </GlassTag>
          <div className="dc-chat-msg__spacer" />
          {actions}
        </div>

        <div className="dc-chat-msg__bubble ui-glass">
          {showThinking ? (
            <div className="dc-chat-msg__thinking">
              {thinkingStyle === 'spinner' ? (
                <GlassSpinner size="sm" label="Assistant is typing…" />
              ) : thinkingStyle === 'skeleton' ? (
                <div className="dc-typing-skel" aria-live="polite" aria-label="Assistant is typing…">
                  <span /><span /><span />
                </div>
              ) : (
                <TypingDots />
              )}
            </div>
          ) : (
            <>
              {body}
              {/* Keep caret when streaming real text */}
              {!isEmpty && streaming && <span className="dc-chat-caret" aria-hidden>▍</span>}
            </>
          )}
        </div>

        {chips && <div className="dc-chat-msg__chips">{chips}</div>}
      </div>
    </div>
  );
}
