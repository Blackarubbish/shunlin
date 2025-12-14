import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
	// 忽略的文件和目录
	{
		ignores: [
			"**/node_modules/**",
			"**/dist/**",
			"**/build/**",
			"**/.turbo/**",
			"**/coverage/**",
			"**/.next/**",
			"**/.vite/**",
		],
	},

	// JavaScript 推荐配置
	js.configs.recommended,

	// TypeScript 文件配置
	{
		files: ["**/*.ts", "**/*.tsx"],
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
				ecmaFeatures: {
					jsx: true,
				},
			},
			globals: {
				// 浏览器环境
				window: "readonly",
				document: "readonly",
				navigator: "readonly",
				console: "readonly",
				// Node.js 环境
				process: "readonly",
				__dirname: "readonly",
				__filename: "readonly",
				module: "readonly",
				require: "readonly",
				// ES2021
				Promise: "readonly",
				Set: "readonly",
				Map: "readonly",
			},
		},
		plugins: {
			"@typescript-eslint": typescript,
			prettier: prettier,
		},
		rules: {
			// TypeScript 规则
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
				},
			],
			"@typescript-eslint/explicit-module-boundary-types": "off",
			"@typescript-eslint/no-non-null-assertion": "warn",

			// 通用规则
			"no-console": ["warn", { allow: ["warn", "error"] }],
			"no-debugger": "warn",
			"no-unused-vars": "off", // 关闭基础规则，使用 TypeScript 的规则
			"prefer-const": "warn",
			"no-var": "error",

			// Prettier 规则
			"prettier/prettier": [
				"error",
				{
					endOfLine: "auto",
				},
			],
		},
	},

	// JavaScript 文件配置
	{
		files: ["**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs"],
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: {
				window: "readonly",
				document: "readonly",
				navigator: "readonly",
				console: "readonly",
				process: "readonly",
				__dirname: "readonly",
				__filename: "readonly",
				module: "readonly",
				require: "readonly",
			},
		},
		plugins: {
			prettier: prettier,
		},
		rules: {
			"no-console": ["warn", { allow: ["warn", "error"] }],
			"no-debugger": "warn",
			"no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
				},
			],
			"prefer-const": "warn",
			"no-var": "error",
			"prettier/prettier": [
				"error",
				{
					endOfLine: "auto",
				},
			],
		},
	},

	// 关闭与 Prettier 冲突的规则
	prettierConfig,
];
