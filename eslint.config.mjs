import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Local reference material, not part of the app:
    "Read This I like This one more/**",
  ]),
  {
    /*
     * Simulation widgets use an imperative canvas idiom: mutable refs hold the
     * physics state, Math.random seeds ensembles, and telemetry is read during
     * render for live readouts. The React-compiler purity/refs rules target
     * declarative UI data flow and would force a full state-machine rewrite
     * with zero user-facing benefit — so they are scoped off here only.
     */
    files: ["src/components/sims/**/*.tsx"],
    rules: {
      "react-hooks/refs": "off",
      "react-hooks/purity": "off",
      "react-hooks/immutability": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
]);

export default eslintConfig;
