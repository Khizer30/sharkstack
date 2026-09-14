import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    ignores: ["dist", "node_modules"]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    files: ["**/*.ts"],
    plugins: {
      import: eslintPluginImport
    },
    languageOptions: {
      globals: { ...globals.node },
      parser: tseslint.parser,
      parserOptions: {
        project: "tsconfig.json",
        sourceType: "module"
      }
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json"
        }
      }
    },
    rules: {
      "prettier/prettier": "warn",
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "prefer-const": "warn",
      "no-trailing-spaces": "warn",
      "no-var": "warn",
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "never",
          alphabetize: { order: "asc", caseInsensitive: true }
        }
      ],
      "import/no-duplicates": "warn",
      "import/no-unresolved": "off",
      "import/newline-after-import": "warn",
      eqeqeq: ["warn", "always"],
      curly: "warn"
    }
  }
]);
