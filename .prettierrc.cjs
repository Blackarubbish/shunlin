module.exports = {
  plugins: ['prettier-plugin-tailwindcss'],
  printWidth: 90,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  trailingComma: 'none',
  bracketSpacing: true,
  bracketSameLine: true, // 替代 jsxBracketSameLine（更新的名称）
  proseWrap: 'preserve',
  arrowParens: 'always',
  jsxSingleQuote: false, // 控制 JSX 中是否使用单引号
  endOfLine: 'lf'
};
