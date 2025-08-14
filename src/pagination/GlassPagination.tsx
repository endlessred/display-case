import * as React from 'react';
import clsx from 'clsx';

const ELLIPSIS = '…' as const;

type Tone = 'default' | 'primary' | 'success' | 'info' | 'danger';

export type GlassPaginationProps = Omit<React.ComponentPropsWithoutRef<'nav'>, 'children'> & {
  /** 1-based current page */
  page: number;
  /** total number of pages (>=1) */
  pageCount: number;
  onPageChange: (page: number) => void;
  /** how many siblings to show around the current page */
  siblingCount?: number;
  /** how many boundary pages to always show at the start/end */
  boundaryCount?: number;
  tone?: Tone;
  /** show « and » */
  showEdges?: boolean;
  /** show ‹ and › */
  showPrevNext?: boolean;
  /** compact sizing (sm buttons) */
  compact?: boolean;
  className?: string;
};

/** Build a pagination range with ellipses. */
function buildRange(
  current: number,
  total: number,
  siblingCount = 1,
  boundaryCount = 1
): Array<number | typeof ELLIPSIS> {
  const totalNumbers = siblingCount * 2 + 3 + boundaryCount * 2;
  const totalBlocks = totalNumbers + 2; // including two ellipses

  if (total <= totalNumbers) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(current - siblingCount, boundaryCount + 2);
  const rightSibling = Math.min(current + siblingCount, total - boundaryCount - 1);

  const showLeftDots = leftSibling > boundaryCount + 2;
  const showRightDots = rightSibling < total - (boundaryCount + 1);

  const range: Array<number | typeof ELLIPSIS> = [];

  // Left boundary
  for (let i = 1; i <= boundaryCount; i++) range.push(i);

  // Left dots or additional pages
  if (showLeftDots) {
    range.push(ELLIPSIS);
  } else {
    for (let i = boundaryCount + 1; i < leftSibling; i++) range.push(i);
  }

  // Middle
  for (let i = leftSibling; i <= rightSibling; i++) range.push(i);

  // Right dots or additional pages
  if (showRightDots) {
    range.push(ELLIPSIS);
  } else {
    for (let i = rightSibling + 1; i <= total - boundaryCount; i++) range.push(i);
  }

  // Right boundary
  for (let i = total - boundaryCount + 1; i <= total; i++) range.push(i);

  // Guard against overlong output in extreme cases
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
  const current = Math.max(1, Math.min(page, Math.max(1, pageCount)));
  const items = buildRange(current, Math.max(1, pageCount), siblingCount, boundaryCount);

  const go = (p: number) => {
    const clamped = Math.max(1, Math.min(p, pageCount));
    if (clamped !== current) onPageChange(clamped);
  };

  const renderBtn = (
    label: React.ReactNode,
    opts: { key?: React.Key; active?: boolean; aria?: string; disabled?: boolean; onClick?: () => void }
  ) => (
    <li key={opts.key ?? String(label)}>
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
        {label}
      </button>
    </li>
  );

  return (
    <nav role="navigation" aria-label="Pagination" className={clsx('dc-pager', className)} {...rest}>
      <ul className="dc-pager__list">
        {showEdges &&
          renderBtn('«', {
            key: 'first',
            aria: 'First page',
            disabled: current === 1,
            onClick: () => go(1),
          })}
        {showPrevNext &&
          renderBtn('‹', {
            key: 'prev',
            aria: 'Previous page',
            disabled: current === 1,
            onClick: () => go(current - 1),
          })}

        {items.map((item, i) =>
          item === ELLIPSIS ? (
            <li key={`dots-${i}`} className="dc-page__dots" aria-hidden>
              {ELLIPSIS}
            </li>
          ) : (
            renderBtn(item, {
              key: `p-${item}-${i}`,
              active: item === current,
              aria: `Page ${item}`,
              onClick: () => go(Number(item)),
            })
          )
        )}

        {showPrevNext &&
          renderBtn('›', {
            key: 'next',
            aria: 'Next page',
            disabled: current === pageCount,
            onClick: () => go(current + 1),
          })}
        {showEdges &&
          renderBtn('»', {
            key: 'last',
            aria: 'Last page',
            disabled: current === pageCount,
            onClick: () => go(pageCount),
          })}
      </ul>
    </nav>
  );
}