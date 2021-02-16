module.exports = {
  extends: "airbnb",
  parser: "babel-eslint",
  env: {
    browser: true,
    node: true,
  },
  rules: {
    "linebreak-style": "off",
    quotes: [2, "double"],
    indent: [
      "error",
      2,
      {
        SwitchCase: 0,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        FunctionDeclaration: {
          parameters: 1,
          body: 1,
        },
        FunctionExpression: {
          parameters: 1,
          body: 1,
        },
      },
    ],
    "react/jsx-closing-bracket-location": "off",
    "react/jsx-first-prop-new-line": ["error", "never"],
    "react/jsx-indent-props": ["error", "first"],
    "no-unused-vars": [
      "error",
      {
        varsIgnorePattern: "^_",
        argsIgnorePattern: "^_",
      },
    ],
  },
  overrides: [
    {
      files: ["**/*.jsx"],
      rules: {
        indent: "off",
      },
    },
  ],
};
