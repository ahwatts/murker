module.exports = {
  "extends": "airbnb",
  "installedESLint": true,
  "plugins": [
    "import",
    "jsx-a11y",
    "react",
  ],
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "node": true,
  },
  "rules": {
    "linebreak-style": "off",
    "quotes": [2, "double"],
    "indent": [
      "error",
      2,
      {
        "SwitchCase": 0,
        "VariableDeclarator": 1,
        "outerIIFEBody": 1,
        "FunctionDeclaration": {
          "parameters": 1,
          "body": 1
        },
        "FunctionExpression": {
          "parameters": 1,
          "body": 1
        }
      }
    ],
    "react/jsx-first-prop-new-line": "off",
    "react/jsx-closing-bracket-location": "off",
    "react/jsx-indent-props": "off",
  }
};
