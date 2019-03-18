module.exports = {
    'root': true,
    'env': {
      'node': true
    },
    'parserOptions': {
      'ecmaVersion': 2018
    },
    'extends': 'eslint-config-airbnb-base-mjs',
    'rules': {
      'no-cond-assign': 2,
      // 'no-console': 2,
      'no-debugger': 2,
      'no-dupe-keys': 2,
      // 'no-extra-semi': 2,
      'no-redeclare': 2, // this can get messy
      'no-undef': 2,
      'no-unreachable': 2,
      // 'linebreak-style': 'error',
      'semi': ['error', 'always'],
      'no-unused-vars': ['error', {'args': 'none'}],
      'no-shadow': 'error',
      'no-shadow-restricted-names': 'error',
   
      // Not ready for the entire Airbnb enchilada...
      'no-var': 'off',
      'max-len': 'off',
      'vars-on-top': 'off',
      'func-names': 'off',
      'prefer-template': 'off',
      'prefer-arrow-callback': 'off',
      'consistent-return': 'off',
      'object-shorthand': 'off',
      'no-use-before-define': ['error', { 'functions': false }],
      'strict': 'off',
      'global-require': 'off',
      'arrow-body-style': 'off',
      'no-param-reassign': ['error', { 'props': false }],
      'import/no-dynamic-require': 'off',
      'no-underscore-dangle': 'off',
      'import/prefer-default-export': 'off',
   
      // From eslint-config-airbnb-base/rules/best-practices.js, without the
      // rule forcing the exponentiation operator, which isn't supported in Node < v7
      'no-restricted-properties': ['error', {
        'object': 'arguments',
        'property': 'callee',
        'message': 'arguments.callee is deprecated',
      }, {
        'property': '__defineGetter__',
        'message': 'Please use Object.defineProperty instead.',
      }, {
        'property': '__defineSetter__',
        'message': 'Please use Object.defineProperty instead.',
      }],
   
      // From eslint-config-airbnb-base/rules/errors.js, but adjusting the
      // rule to prevent dangling commas in function params, which isn't supported in Node
      'comma-dangle': ['error', {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      }],
    }
   };