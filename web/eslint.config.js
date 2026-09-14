import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginImport from "eslint-plugin-import";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{js,jsx}"],
    extends: [js.configs.recommended, reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } }
    },
    plugins: {
      import: eslintPluginImport
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
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
  },
  eslintConfigPrettier
]);
