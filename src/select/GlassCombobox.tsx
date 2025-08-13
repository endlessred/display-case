import * as React from 'react';
import { createPortal } from 'react-dom';
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/react-dom';
import clsx from 'clsx';

export type ComboOption = {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
};

export type GlassComboboxProps = {
  options: ComboOption[];
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null, option: ComboOption | null) => void;
  placeholder?: string;
  tone?: 'default' | 'primary' | 'success' | 'info' | 'danger';
  clearable?: boolean;
  disabled?: boolean;
  className?: string;
  renderOption?: (opt: ComboOption, active: boolean, selected: boolean) => React.ReactNode;
  filter?: (opt: ComboOption, query: string) => boolean; // default: includes
  noResultsText?: React.ReactNode; // default: "No results"
};

export function GlassCombobox({
  options,
  value,
  defaultValue = null,
  onChange,
  placeholder,
  tone,
  clearable = true,
  disabled,
  className,
  renderOption,
  filter,
  noResultsText = 'No results',
}: GlassComboboxProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState<string | null>(defaultValue);
  const selectedValue = isControlled ? (value ?? null) : internalValue;

  const selectedOption = React.useMemo(() => options.find(o => o.value === selectedValue) || null, [options, selectedValue]);

  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState<string>(selectedOption?.label ?? '');
  const [activeIndex, setActiveIndex] = React.useState<number>(-1);

  const listId = React.useId().replace(/:/g, '') + '-listbox';
  const inputId = React.useId().replace(/:/g, '') + '-input';

  const { refs, x, y, strategy, update } = useFloating({ middleware: [offset(6), flip(), shift({ padding: 8 })] });

  // keep position updated
  React.useEffect(() => {
    if (!refs.reference.current || !refs.floating.current || !open) return;
    return autoUpdate(refs.reference.current, refs.floating.current, update);
  }, [open, refs.reference, refs.floating, update]);

  // Filtered options
  const norm = (s: string) => s.toLowerCase();
  const filterFn = filter || ((opt: ComboOption, q: string) => norm(opt.label).includes(norm(q)));
  const filtered = React.useMemo(() => options.filter(o => filterFn(o, query)), [options, query, filterFn]);

  // Open on focus/typing; close on outside click
  const wrapRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      const wrap = wrapRef.current;
      const flo = refs.floating.current as Node | null;
      if (wrap && (wrap.contains(t) || (flo && flo.contains(t)))) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDown, true);
    return () => document.removeEventListener('mousedown', onDown, true);
  }, [open, refs.floating]);

  // Sync query when external value changes
  React.useEffect(() => {
    if (!isControlled) return;
    const so = options.find(o => o.value === value);
    setQuery(so?.label ?? '');
  }, [isControlled, value, options]);

  const selectAt = (idx: number) => {
    const opt = filtered[idx];
    if (!opt || opt.disabled) return;
    if (!isControlled) setInternalValue(opt.value);
    onChange?.(opt.value, opt);
    setQuery(opt.label);
    setOpen(false);
  };

  const clear = () => {
    if (!isControlled) setInternalValue(null);
    onChange?.(null, null);
    setQuery('');
    setActiveIndex(-1);
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) { setOpen(true); setActiveIndex(0); return; }
      setActiveIndex(i => Math.min((i < 0 ? 0 : i) + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) { setOpen(true); setActiveIndex(Math.max(filtered.length - 1, 0)); return; }
      setActiveIndex(i => Math.max((i < 0 ? filtered.length - 1 : i) - 1, 0));
    } else if (e.key === 'Home') {
      if (open) { e.preventDefault(); setActiveIndex(0); }
    } else if (e.key === 'End') {
      if (open) { e.preventDefault(); setActiveIndex(Math.max(filtered.length - 1, 0)); }
    } else if (e.key === 'Enter') {
      if (open && activeIndex >= 0) { e.preventDefault(); selectAt(activeIndex); }
    } else if (e.key === 'Escape') {
      if (open) { e.preventDefault(); setOpen(false); }
    } else if (e.key === 'Tab') {
      // commit current query if it exactly matches an option
      const exact = filtered.findIndex(o => o.label === query);
      if (exact >= 0) selectAt(exact);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setOpen(true);
    setActiveIndex(0);
  };

  const activeId = activeIndex >= 0 && filtered[activeIndex] ? `${listId}-opt-${activeIndex}` : undefined;

  return (
    <div ref={wrapRef} className={clsx('ui-glass', 'dc-cbx', tone && `tone-${tone}`, className)}>
      <div className="dc-cbx__row">
        <input
          ref={refs.setReference as any}
          id={inputId}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeId}
          className="dc-cbx__input"
          placeholder={placeholder}
          value={query}
          onChange={onInputChange}
          onKeyDown={onInputKeyDown}
          onFocus={() => setOpen(true)}
          disabled={disabled}
        />
        {clearable && query && !disabled && (
          <button className="ui-glass dc-btn dc-cbx__clear" aria-label="Clear" onClick={clear}>✕</button>
        )}
        <button
          className="ui-glass dc-btn dc-cbx__caret"
          aria-label={open ? 'Close options' : 'Open options'}
          onClick={() => setOpen(o => !o)}
          disabled={disabled}
        >▾</button>
      </div>

      {open && createPortal(
        <div
          ref={refs.setFloating as any}
          className={clsx('ui-glass', 'dc-cbx__panel', tone && `tone-${tone}`)}
          role="presentation"
          style={{ position: strategy as any, top: y ?? 0, left: x ?? 0, minWidth: wrapRef.current?.offsetWidth || 200 }}
        >
          <ul id={listId} role="listbox" className="dc-cbx__list">
            {filtered.length === 0 && (
              <li className="dc-cbx__empty" role="status" aria-live="polite">{noResultsText}</li>
            )}
            {filtered.map((opt, i) => {
              const selected = selectedValue === opt.value;
              const active = i === activeIndex;
              return (
                <li key={opt.value} role="option" id={`${listId}-opt-${i}`} aria-selected={selected || active}>
                  <button
                    type="button"
                    className={clsx('dc-cbx__item', 'ui-glass', active && 'is-active', selected && 'is-selected')}
                    disabled={opt.disabled}
                    onMouseEnter={() => setActiveIndex(i)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectAt(i)}
                  >
                    {renderOption ? renderOption(opt, active, selected) : (
                      <>
                        {opt.icon && <span className="dc-cbx__icon">{opt.icon}</span>}
                        <span>{opt.label}</span>
                      </>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>,
        document.body
      )}
    </div>
  );
}