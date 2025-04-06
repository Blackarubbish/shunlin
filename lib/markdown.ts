import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm'; // 支持 GitHub 风格的 Markdown
import remarkFrontmatter from 'remark-frontmatter'; // 支持 YAML Frontmatter
import rehypeHighlight from 'rehype-highlight'; // 支持代码高亮
import rehypeSlug from 'rehype-slug'; // 为标题生成 id
import rehypeAutolinkHeadings from 'rehype-autolink-headings'; // 为标题添加链接// 支持 Mermaid 图表

const parser = unified()
  .use(remarkParse) // 解析 Markdown
  .use(remarkGfm) // 支持 GitHub 风格的 Markdown
  .use(remarkFrontmatter, ['yaml']) // 支持 YAML Frontmatter
  .use(remarkRehype) // 转换为 HTML
  // .use(remarkStaticMermaid)
  // .use(rehypeMermaid)
  .use(rehypeSlug) // 为标题生成 id
  .use(rehypeAutolinkHeadings, { behavior: 'wrap' }) // 为标题添加链接
  .use(rehypeHighlight) // 支持代码高亮
  .use(rehypeStringify); // 转换为字符串

/**
 * 将 Markdown 转换为 HTML
 * @param markdown - 输入的 Markdown 字符串
 * @returns 转换后的 HTML 字符串
 */
export async function parseMarkdown(markdown: string): Promise<string> {
  const file = await parser.process(markdown);
  return String(file);
}
