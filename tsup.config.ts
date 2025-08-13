import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  sourcemap: true,
  format: ["esm", "cjs"],
  entry: {
    index: "src/index.ts",
    "surface/index": "src/surface/index.ts",
    "card/index": "src/card/index.ts",
    "button/index": "src/button/index.ts",
    "tabs/index": "src/tabs/index.ts",
    "tooltip/index": "src/tooltip/index.ts",
    "form/index": "src/form/index.ts",
    "navbar/index": "src/navbar/index.ts",
    "popover/index": "src/popover/index.ts",
    "menu/index": "src/menu/index.ts",
    "select/index": "src/select/index.ts"
  },
  external: ["react", "react-dom"],
  minify: true
});