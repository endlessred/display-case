# display-case

Glassmorphism React UI components — accessible, token-driven, and tree-shakable.

## Quick start (dev)
```bash
pnpm i
pnpm dev # Storybook at http://localhost:6006
```

## Build the library
```bash
pnpm run build
```

## Usage (in another app)
```ts
import { GlassCard, GlassButton } from "display-case";
import "display-case/styles.css";
```

## Themes
Swap data attributes on `<html>` or a wrapper:
```html
<div data-theme="dark">...</div>
<div data-theme="solid">...</div>
```

## License
MIT