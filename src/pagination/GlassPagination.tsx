import * as React from 'react';
import clsx from 'clsx';

export type GlassPaginationProps = React.HTMLAttributes<nav> & {
  page: number;                       // 1-based
  pageCount: number;                  // >= 1
  onPageChange: (page: number) => void;
  siblingCount?: number;              // pages around current (default 1)
  boundaryCount?: number;             // pages at edges (default 1)
  tone?: 'default' | 'primary' | 'success' | 'info' | 'danger';
  showEdges?: boolean;                // show « and » buttons (default true)
  showPrevNext?: boolean;             // show ‹ and › buttons (default true)
  compact?: boolean;                  // smaller chips
};

const DOTS = '…';

function useRange(page: number, count: number, sibling = 1, boundary = 1) {
  const totalNumbers = sibling * 2 + 3 + boundary * 2;
  const totalBlocks = totalNumbers + 2; // with two DOTS

  if (count <= totalNumbers) {
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  const left = Math.max(page - sibling, boundary + 2);
  const right = Math.min(page + sibling, count - boundary - 1);
  const showLeftDots = left > boundary + 2;
  const showRightDots = right < count - boundary - 1;

  const range: (number | typeof DOTS)[] = [];

  // left boundary
  for (let i = 1; i <= boundary; i++) range.push(i);

  if (showLeftDots) range.push(DOTS);
  else for (let i = boundary + 1; i < left; i++) range.push(i);

  // middle
  for (let i = left; i <= right; i++) range.push(i);

  if (showRightDots) range.push(DOTS);
  else for (let i = right + 1; i < count - boundary + 1; i++) range.push(i);

  // right boundary
  for (let i = count - boundary + 1; i <= count; i++) range.push(i);

  // sanity cap
  return range.slice(0, totalBlocks);
}

export function GlassPagination({
  page,
  pageCount,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  tone,
  showEdges = true,
  showPrevNext = true,
  compact,
  className,
  ...rest
}: GlassPaginationProps) {
  const p = Math.max(1, Math.min(page, Math.max(1, pageCount)));
  const range = useRange(p, Math.max(1, pageCount), siblingCount, boundaryCount);

  const go = (n: number) => {
    const clamped = Math.max(1, Math.min(n, pageCount));
    if (clamped !== p) onPageChange(clamped);
  };

  const chip = (content: React.ReactNode, opts: { active?: boolean; disabled?: boolean; aria?: string; onClick?: () => void } = {}) => (
    <li>
      <button
        className={clsx(
          'ui-glass',
          'dc-btn',
          'dc-page',
          compact && 'dc-page--sm',
          opts.active && 'is-active',
          tone && `tone-${tone}`
        )}
        aria-current={opts.active ? 'page' : undefined}
        aria-label={opts.aria}
        disabled={opts.disabled}
        onClick={opts.onClick}
      >
        {content}
      </button>
    </li>
  );

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={clsx('dc-pager', className)}
      {...rest}
    >
      <ul className="dc-pager__list">
        {showEdges && chip('«', { aria: 'First page', disabled: p === 1, onClick: () => go(1) })}
        {showPrevNext && chip('‹', { aria: 'Previous page', disabled: p === 1, onClick: () => go(p - 1) })}

        {range.map((it, i) =>
          it === DOTS
            ? <li key={`d-${i}`} className="dc-page__dots" aria-hidden>{DOTS}</li>
            : chip(it, { active: it === p, aria: `Page ${it}`, onClick: () => go(Number(it)) })
        )}

        {showPrevNext && chip('›', { aria: 'Next page', disabled: p === pageCount, onClick: () => go(p + 1) })}
        {showEdges && chip('»', { aria: 'Last page', disabled: p === pageCount, onClick: () => go(pageCount) })}
      </ul>
    </nav>
  );
}