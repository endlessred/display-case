import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";

const input = readFileSync("src/styles/index.css", "utf8");
mkdirSync(dirname("dist/styles.css"), { recursive: true });
writeFileSync("dist/styles.css", input);
console.log("✔ Copied styles.css to dist/");