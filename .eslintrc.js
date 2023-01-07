module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    extends: 'airbnb-base',
    overrides: [
    ],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        'no-alert': 'off',
        indent: ['error', 4],
        'no-param-reassign': 0,
        'no-use-before-define': ['error', {
            functions: false,
            classes: true,
            variables: true,
            allowNamedExports: true,
        }],
    },
};
