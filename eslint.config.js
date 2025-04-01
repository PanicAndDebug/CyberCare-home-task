import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import playwright from "eslint-plugin-playwright";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      globals: {
        console: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": ts,
      playwright: playwright,
      prettier: prettier,
    },
    rules: {
      "no-console": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "playwright/no-skipped-test": "error",
      "prettier/prettier": "error",
    },
  },
  prettierConfig,
  {
    ignores: ["node_modules/", "playwright-report/", "test-results/"],
  },
];
