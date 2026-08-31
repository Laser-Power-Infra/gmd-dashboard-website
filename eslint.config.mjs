import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Images use legacy root-relative paths (e.g. "/valve img/...") with spaces,
      // so plain <img> is intentional for 1:1 parity with the original Vite app.
      "@next/next/no-img-element": "off",
    },
  },
  {
    ignores: ["scripts/**", "public/**"],
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
