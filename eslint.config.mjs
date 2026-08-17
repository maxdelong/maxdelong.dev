import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "coverage/**",
    ],
  },
  ...tseslint.configs.recommended,
  nextPlugin.configs["core-web-vitals"],
];

export default eslintConfig;
