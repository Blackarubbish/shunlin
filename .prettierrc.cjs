module.exports = {
  printWidth: 100, // 定义每行代码的最大长度为80个字符，有助于提高代码的可读性
  tabWidth: 2, // 设置缩进为2个空格，使代码结构清晰
  semi: true, // 要求在语句末尾添加分号，避免JavaScript的自动分号插入（ASI）可能导致的问题
  singleQuote: true, // 使用单引号，使代码风格更统一
  trailingComma: 'none', // 在多行结构（如数组和对象）的最后一个元素后面添加逗号，有助于版本控制系统的diff更清晰
  bracketSpacing: true, // 在对象的括号之间添加空格，提高代码的可读性
  jsxBracketSameLine: true, // 将多行JSX元素的关闭标签放在最后一行的末尾，使代码风格更统一
  proseWrap: 'preserve', // 当超出print width时，不对markdown文本进行换行，使得markdown文本的格式更一致
  arrowParens: 'always', // 在单参数箭头函数中始终包含括号，避免添加或删除参数时需要修改箭头函数的问题
  closeEmptyJsxElements: true, // 自动关闭空的JSX元素，使代码看起来更整洁
  closeEmptyJsxTags: true, // 自动关闭空的JSX标签，使代码看起来更整洁
  jsxSelfClosing: true, // 自动关闭JSX标签，使代码看起来更整洁
  endOfLine: 'lf' // 使用LF作为换行符，避免不同操作系统下换行符不一致的问题
};
