import * as React from 'react';
import clsx from 'clsx';

export type SortDir = 'asc' | 'desc';
export type CellAlign = 'left' | 'center' | 'right';

export type GlassTableColumn<Row> = {
  key: string;
  header: React.ReactNode;
  /** Cell renderer. Defaults to `(row as any)[key]`. */
  cell?: (row: Row, rowIndex: number) => React.ReactNode;
  /** Primitive accessor used for sorting; defaults to `cell` value, or raw field. */
  sortAccessor?: (row: Row) => string | number | boolean | null | undefined;
  sortable?: boolean;
  width?: number | string;
  align?: CellAlign;
};

export type GlassTableProps<Row> = {
  columns: GlassTableColumn<Row>[];
  data: Row[];
  tone?: 'default' | 'primary' | 'success' | 'info' | 'danger';
  /** Sticky header (default true). Works when the wrapper scrolls. */
  stickyHeader?: boolean;
  /** Zebra rows (default true). */
  zebra?: boolean;
  /** Compact paddings (dense mode). */
  dense?: boolean;
  /** Loading state shows a single status row. */
  loading?: boolean;
  /** Custom empty element; shown when not loading and data.length === 0. */
  empty?: React.ReactNode;

  /** Controlled sort */
  sortBy?: string | null;
  sortDir?: SortDir | null;
  onSortChange?: (key: string | null, dir: SortDir | null) => void;

  /** Uncontrolled sort defaults */
  defaultSortBy?: string | null;
  defaultSortDir?: SortDir;

  /** Keys/props */
  rowKey?: (row: Row, index: number) => React.Key;
  rowProps?: (row: Row, index: number) => React.HTMLAttributes<HTMLTableRowElement>;
  className?: string;
  style?: React.CSSProperties;
};

function defaultAccessor(val: any): string | number | boolean | null | undefined {
  if (val == null) return val;
  if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') return val;
  if (React.isValidElement(val)) return (val as any).props?.children ?? '';
  if (Array.isArray(val)) return val.join(', ');
  return String(val);
}

export function GlassTable<Row>({
  columns,
  data,
  tone,
  stickyHeader = true,
  zebra = true,
  dense,
  loading,
  empty = <span>No data</span>,
  sortBy,
  sortDir,
  onSortChange,
  defaultSortBy = null,
  defaultSortDir = 'asc',
  rowKey,
  rowProps,
  className,
  style,
}: GlassTableProps<Row>) {
  const isControlled = sortBy !== undefined || sortDir !== undefined;

  const [innerSort, setInnerSort] = React.useState<{ by: string | null; dir: SortDir | null }>({
    by: defaultSortBy,
    dir: defaultSortBy ? defaultSortDir : null,
  });

  const by = isControlled ? (sortBy ?? null) : innerSort.by;
  const dir = isControlled ? (sortDir ?? null) : innerSort.dir;

  const toggleSort = (key: string) => {
    let nextBy: string | null = key;
    let nextDir: SortDir | null = 'asc';

    if (by === key) {
      nextDir = dir === 'asc' ? 'desc' : dir === 'desc' ? null : 'asc';
      if (nextDir === null) nextBy = null;
    }

    if (!isControlled) setInnerSort({ by: nextBy, dir: nextDir });
    onSortChange?.(nextBy, nextDir);
  };

  const sorted = React.useMemo(() => {
    if (!by || !dir) return data;
    const col = columns.find(c => c.key === by);
    if (!col) return data;
    const acc = (row: Row) => {
      if (col.sortAccessor) return col.sortAccessor(row);
      const raw = col.cell ? col.cell(row, -1) : (row as any)[col.key];
      return defaultAccessor(raw ?? (row as any)[col.key]);
    };
    const copy = data.slice();
    copy.sort((a, b) => {
      const av = acc(a);
      const bv = acc(b);
      // nulls last
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      let cmp = 0;
      if (typeof av === 'number' && typeof bv === 'number') cmp = av - bv;
      else cmp = String(av).localeCompare(String(bv), undefined, { numeric: true, sensitivity: 'base' });
      return dir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [data, columns, by, dir]);

  const thAriaSort = (key: string): React.AriaAttributes['aria-sort'] => {
    if (by !== key || !dir) return 'none';
    return dir === 'asc' ? 'ascending' : 'descending';
    // 'other' not used
  };

  return (
    <div className={clsx('ui-glass', 'dc-table', tone && `tone-${tone}`, className)} style={style}>
      <div className="dc-table__wrap">
        <table className={clsx('dc-table__tbl', dense && 'is-dense', stickyHeader && 'is-sticky', zebra && 'is-zebra')}>
          <thead className="dc-table__head">
            <tr>
              {columns.map(col => {
                const sortable = !!col.sortable;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    style={{ width: col.width }}
                    aria-sort={thAriaSort(col.key)}
                    className={clsx(
                      'dc-table__th',
                      sortable && 'is-sortable',
                      col.align && `al-${col.align}`
                    )}
                  >
                    {sortable ? (
                      <button
                        type="button"
                        className={clsx('dc-table__sort')}
                        onClick={() => toggleSort(col.key)}
                        aria-label={
                          by === col.key
                            ? dir === 'asc' ? `Sort ${String(col.header)} descending` :
                              dir === 'desc' ? `Clear sort on ${String(col.header)}` :
                              `Sort ${String(col.header)} ascending`
                            : `Sort ${String(col.header)} ascending`
                        }
                      >
                        <span className="dc-table__th-label">{col.header}</span>
                        <span aria-hidden className={clsx('dc-table__sort-ico', by === col.key && dir)} />
                      </button>
                    ) : (
                      <span className="dc-table__th-label">{col.header}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="dc-table__body">
            {loading ? (
              <tr className="dc-table__row is-loading" role="status" aria-live="polite">
                <td className="dc-table__cell" colSpan={columns.length}>Loading…</td>
              </tr>
            ) : sorted.length === 0 ? (
              <tr className="dc-table__row is-empty">
                <td className="dc-table__cell" colSpan={columns.length}>
                  {empty}
                </td>
              </tr>
            ) : (
              sorted.map((row, i) => {
                const key = rowKey ? rowKey(row, i) : (row as any)?.id ?? i;
                const rp = rowProps?.(row, i);
                return (
                  <tr key={key} className={clsx('dc-table__row', rp?.className)} {...rp}>
                    {columns.map((col, ci) => {
                      const content = col.cell ? col.cell(row, i) : (row as any)[col.key];
                      return (
                        <td key={col.key ?? ci} className={clsx('dc-table__cell', col.align && `al-${col.align}`)}>
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
