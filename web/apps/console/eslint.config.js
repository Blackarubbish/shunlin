import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
	// 忽略的文件和目录
	{
		ignores: [
			"node_modules/**",
			"dist/**",
			"build/**",
			".turbo/**",
			"coverage/**",
			".vite/**",
		],
	},

	// JavaScript 推荐配置
	js.configs.recommended,

	// React 和 TypeScript 文件配置
	{
		files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
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
        localStorage: "readonly",
        sessionStorage: "readonly",
        fetch: "readonly",
        Request: "readonly",
        Response: "readonly",
        Headers: "readonly",
        FormData: "readonly",
        File: "readonly",
        Blob: "readonly",
        FileReader: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        setTimeout: "readonly",
        setInterval: "readonly",
        clearTimeout: "readonly",
        clearInterval: "readonly",
        // Node.js 环境
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        module: "readonly",
        require: "readonly",
        // ES2021+
        Promise: "readonly",
        Set: "readonly",
        Map: "readonly",
        WeakMap: "readonly",
        WeakSet: "readonly",
        Symbol: "readonly",
        BigInt: "readonly",
        // React
        React: "readonly",
        JSX: "readonly",
      },
		},
		plugins: {
			"@typescript-eslint": typescript,
			react: react,
			"react-hooks": reactHooks,
			prettier: prettier,
		},
		settings: {
			react: {
				version: "detect",
			},
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
			"@typescript-eslint/ban-ts-comment": "warn",

			// React 规则
			"react/react-in-jsx-scope": "off", // React 17+ 不需要
			"react/prop-types": "off", // 使用 TypeScript
			"react/jsx-uses-react": "off",
			"react/jsx-uses-vars": "error",
			"react/jsx-key": "error",
			"react/no-unescaped-entities": "warn",

			// React Hooks 规则
			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": "warn",

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

	// 关闭与 Prettier 冲突的规则
	prettierConfig,
];
