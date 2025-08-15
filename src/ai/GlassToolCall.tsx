import * as React from 'react';
import clsx from 'clsx';
import { GlassAccordion, GlassAccordionItem, GlassAccordionTrigger, GlassAccordionContent } from '../accordion';

export type GlassToolCallProps = {
  name: string;
  args?: unknown;
  result?: unknown;
  status?: 'pending' | 'ok' | 'error';
  className?: string;
};

export function GlassToolCall({ name, args, result, status = 'pending', className }: GlassToolCallProps) {
  return (
    <div className={clsx('dc-toolcall', className)}>
      <GlassAccordion type="single" collapsible defaultValue="tool">
        <GlassAccordionItem value="tool">
          <GlassAccordionTrigger itemValue="tool" className="dc-toolcall__trigger">
            {name}
            <span className={clsx('dc-toolcall__status', `st-${status}`)} aria-label={status} />
          </GlassAccordionTrigger>
          <GlassAccordionContent itemValue="tool">
            <div className="dc-toolcall__body ui-glass">
              {args !== undefined && (
                <section>
                  <h4>Args</h4>
                  <pre className="dc-code"><code>{JSON.stringify(args, null, 2)}</code></pre>
                </section>
              )}
              {result !== undefined && (
                <section>
                  <h4>Result</h4>
                  <pre className="dc-code"><code>{JSON.stringify(result, null, 2)}</code></pre>
                </section>
              )}
            </div>
          </GlassAccordionContent>
        </GlassAccordionItem>
      </GlassAccordion>
    </div>
  );
}