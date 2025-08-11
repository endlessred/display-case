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
    "button/index": "src/button/index.ts"
  },
  external: ["react", "react-dom"],
  minify: true
});