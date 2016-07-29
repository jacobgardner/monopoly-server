module.exports = {
    globals: {
        describe: true,
        it: true,
    },
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    settings: {
        react: {
            pragma: "React"
        }
    },
    plugins: [
        "react"
    ],
    parser: "babel-eslint",
    extends: ["eslint:recommended", "plugin:react/recommended"],
    parserOptions: {
        sourceType: "module",
        ecmaFeatures: {
            ecmaVersion: 6,
            jsx: true,
            experimentalObjectRestSpread: true,
        }
    },
    rules: {
        "comma-dangle": ['error', 'always-multiline'],
        indent: [
            "error",
            4
        ],
        "prop-types": 0,
        "linebreak-style": [
            "error",
            "unix"
        ],
        quotes: [
            "error",
            "single"
        ],
        semi: [
            "error",
            "always"
        ]
    }
};
