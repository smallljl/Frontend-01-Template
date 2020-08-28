module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  settings: {
    "react": {
      "createClass":"createReactClass",
      "pragma":"createElement",
      "version":"detect",
      "flowVersion":"0.53"
    }
  },
  rules: {
    "semi":"error",
    "no-unused-vars":"error",
  } 
};
