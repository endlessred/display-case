import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Safe markdown renderer:
 * - Supports GFM (tables, task lists, strikethrough)
 * - No raw HTML injection (default in react-markdown)
 * - Nice code block / inline code classNames for styling in CSS
 */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="dc-md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }) {
            // className includes `language-xxx` when a fence like ```js is used
            if (inline) {
              return (
                <code className={`dc-code-inline ${className || ''}`} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <pre className="dc-code-block">
                <code className={className || ''} {...props}>
                  {/* trim a trailing newline that some MD parsers include */}
                  {String(children).replace(/\n$/, '')}
                </code>
              </pre>
            );
          },
          table({ children }) {
            return <table className="dc-md-table">{children}</table>;
          },
          th({ children }) {
            return <th className="dc-md-th">{children}</th>;
          },
          td({ children }) {
            return <td className="dc-md-td">{children}</td>;
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
