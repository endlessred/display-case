import * as React from 'react';

/** Generic mouse handler for any HTMLElement (works with asChild/as polymorphism). */
export type DOMClickHandler<T extends HTMLElement = HTMLElement> =
  React.MouseEventHandler<T>;

/** Generic keyboard handler for any HTMLElement. */
export type DOMKeyHandler<T extends HTMLElement = HTMLElement> =
  React.KeyboardEventHandler<T>;

/** Props we expect from a “trigger-like” element, regardless of the actual tag. */
export type TriggerLikeProps = {
  onClick?: DOMClickHandler<HTMLElement>;
  onKeyDown?: DOMKeyHandler<HTMLElement>;
  role?: string;
  tabIndex?: number;
  'aria-haspopup'?: string | boolean;
  'aria-expanded'?: boolean;
};

/** Compose two event handlers; ours runs only if user didn’t preventDefault. */
export function composeMouseHandlers<T extends HTMLElement = HTMLElement>(
  user?: React.MouseEventHandler<T>,
  ours?: React.MouseEventHandler<T>
) {
  return (e: React.MouseEvent<T>) => {
    user?.(e);
    if (!e.defaultPrevented) ours?.(e);
  };
}

export function composeKeyHandlers<T extends HTMLElement = HTMLElement>(
  user?: React.KeyboardEventHandler<T>,
  ours?: React.KeyboardEventHandler<T>
) {
  return (e: React.KeyboardEvent<T>) => {
    user?.(e);
    if (!e.defaultPrevented) ours?.(e);
  };
}