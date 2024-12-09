import fs              from 'node:fs'

import ts_eslint       from '@typescript-eslint/eslint-plugin'
import ts_parser       from '@typescript-eslint/parser'
import no_only_tests   from 'eslint-plugin-no-only-tests'
import eslint_comments from '@eslint-community/eslint-plugin-eslint-comments'
import nb_eslint       from '@nothing-but/eslint-plugin'

const git_ignored_paths = fs
    .readFileSync('.gitignore', 'utf-8')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))

/** @type {import('eslint').Linter.Config[]} */
export default [{

	files: ['**/*.{js,mjs,jsx,ts,tsx}'],

	plugins: {
		'@typescript-eslint': ts_eslint,
		'@no-only-tests':     no_only_tests,
		'@eslint-comments':   eslint_comments,
		'@nothing-but':       /** @type {*} */(nb_eslint),
	},

	languageOptions: {
		parser: ts_parser,
		ecmaVersion: 5,
		sourceType: 'module',

		parserOptions: {
			project: './tsconfig.json',
			tsconfigRootDir: '.',
		},
	},

	rules: {
		/*
		forgot to remove/implement
		*/
		'no-console'                       : 'warn',
		'no-debugger'                      : 'warn',
		'prefer-const'                     : 'warn',
		'require-await'                    : 'warn',
		'no-empty'                         : 'warn',
		'@typescript-eslint/no-unused-vars': ['warn', {
			'argsIgnorePattern'        : '^_',
			'varsIgnorePattern'        : '^_',
			'caughtErrorsIgnorePattern': '^_'
		}],
		'@typescript-eslint/no-unnecessary-boolean-literal-compare': 'warn',
		'@typescript-eslint/no-unnecessary-condition'              : 'warn',
		'@typescript-eslint/no-unnecessary-qualifier'              : 'warn',
		'@typescript-eslint/no-unnecessary-type-arguments'         : 'warn',
		'@typescript-eslint/no-unnecessary-type-assertion'         : 'warn',
		'@typescript-eslint/no-unnecessary-type-constraint'        : 'warn',
		'@typescript-eslint/no-useless-empty-export'               : 'warn',
		'@typescript-eslint/no-empty-function'                     : 'warn',
		'@typescript-eslint/no-unused-expressions'                 : ['warn', {
			'allowShortCircuit': true,
			'allowTernary'     : true,
		}],
		'@eslint-comments/no-unused-disable': 'warn',
		  /*
		code style | readability
		*/
		  // to many voids
		  // "@typescript-eslint/explicit-function-return-type": [
		  //     "warn",
		  //     {
		  //         "allowExpressions": true,
		  //         "allowTypedFunctionExpressions": true,
		  //         "allowHigherOrderFunctions": true,
		  //         "allowDirectConstAssertionInArrowFunctions": true,
		  //         "allowConciseArrowFunctionExpressionsStartingWithVoid": true,
		  //         "allowIIFEs": true
		  //     }
		  // ],
		  /*
		prevent unexpected behavior
		*/
		'@typescript-eslint/no-empty-object-type'       : 'warn',
		'@typescript-eslint/no-unsafe-function-type'    : 'warn',
		'@typescript-eslint/no-wrapper-object-types'    : 'warn',
		'@typescript-eslint/switch-exhaustiveness-check': 'warn',
		'no-fallthrough'                                : ['warn', {'allowEmptyCase': true}],
		  // '@nothing-but/no-ignored-return': 'warn',
		  // '@nothing-but/no-return-to-void': 'warn',
		  /*
		tests
		*/
		'@no-only-tests/no-only-tests': 'warn',
	},
}, {
    // ignores need to be in a separate config for some reason
    // https://github.com/eslint/eslint/issues/17400
	ignores: ['**/{dist,node_modules,__snapshots__}/**/*', 'examples/**/*', ...git_ignored_paths],
}]
