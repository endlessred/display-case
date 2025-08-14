import * as React from 'react';

export function setRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (!ref) return;
  if (typeof ref === 'function') {
    ref(value);
  } else {
    // RefObject<T> has readonly current in types, so cast to MutableRefObject
    (ref as React.MutableRefObject<T | null>).current = value;
  }
}

export function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (value: T | null) => refs.forEach((r) => setRef(r, value));
}