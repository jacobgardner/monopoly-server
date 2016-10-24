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
    parser: 'babel-eslint',
    extends: ['eslint:recommended'],
    parserOptions: {
        sourceType: 'module',
        ecmaFeatures: {
            ecmaVersion: 6,
            experimentalObjectRestSpread: true,
        }
    },
    rules: {
        'comma-dangle': ['error', 'always-multiline'],
        'keyword-spacing': ['error'],
        'brace-style': ['error', '1tbs'],
        'no-console': 0,
        'space-before-blocks': ['error'],
        indent: [
            'error',
            4
        ],
        'linebreak-style': 0,
        quotes: [
            'error',
            'single'
        ],
        semi: [
            'error',
            'always'
        ]
    }
};
