const rule = {
  off: 0,
  warn: 1,
  error: 2,
}

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["react", "react-native", "@typescript-eslint", "react-hooks"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    project: "tsconfig.json",
  },
  env: {
    "react-native/react-native": true,
  },
  rules: {
    "react-native/no-unused-styles": rule.error,
    "react-native/split-platform-components": rule.error,
    "react-native/no-single-element-style-arrays": rule.error,
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",
    "@typescript-eslint/switch-exhaustiveness-check": "error",
    "@typescript-eslint/ban-ts-comment": rule.off,
    "@typescript-eslint/no-empty-function": rule.off,
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/consistent-type-imports": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
  },
  settings: {
    "import/resolver": {
      node: {
        paths: ["src"],
      },
    },
  },
}
