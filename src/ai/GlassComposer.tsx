import * as React from 'react';
import clsx from 'clsx';
import { GlassTextarea } from '../form';

export type GlassComposerProps = React.HTMLAttributes<HTMLFormElement> & {
  value: string;
  onChange: (v: string) => void;
  onSend: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  endAdornment?: React.ReactNode;
};

export function GlassComposer({
  value,
  onChange,
  onSend,
  placeholder = 'Ask anything…',
  disabled,
  endAdornment,
  className,
  ...rest
}: GlassComposerProps) {
  const [isComposing, setIsComposing] = React.useState(false);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value);
  };

  return (
    <form className={clsx('dc-composer', className)} onSubmit={submit} {...rest}>
      <GlassTextarea
        value={value}
        onInput={(e) => onChange((e.target as HTMLTextAreaElement).value)}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
            e.preventDefault();
            // submit via form API so parent handlers run consistently
            (e.currentTarget.form as HTMLFormElement | null)?.requestSubmit();
          }
        }}
        placeholder={placeholder}
        rows={1}
        autoGrow
        aria-label="Message"
        // nicer mobile keyboard label (Chrome/Edge/Safari)
        enterKeyHint="send"
      />
      <div className="dc-composer__actions">
        {endAdornment}
        <button type="submit" className="ui-glass dc-btn tone-primary" disabled={disabled || !value.trim()}>
          Send
        </button>
      </div>
    </form>
  );
}