import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config} */
const config = {
  ...nextJsConfig,
  rules: {
    ...nextJsConfig.rules,
    // Disable the rule that prevents using async components
    "@typescript-eslint/no-explicit-any": "off",
    // Add a custom rule to allow async server components
    "react/jsx-no-undef": ["error", { "allowAsync": true }],
  },
};

export default config;
