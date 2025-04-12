import { Processor, unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm'; // 支持 GitHub 风格的 Markdown
import remarkFrontmatter from 'remark-frontmatter'; // 支持 YAML Frontmatter
import rehypeHighlight from 'rehype-highlight'; // 支持代码高亮
import rehypeSlug from 'rehype-slug'; // 为标题生成 id
import rehypeAutolinkHeadings from 'rehype-autolink-headings'; // 为标题添加链接// 支持 Mermaid 图表

interface ParserOptions {
  filePath: string;
}
export interface MarkdownParser {
  parseMarkdown(markdown: string, options?: ParserOptions): Promise<string>;
}

export class MarkdownRemarkParser implements MarkdownParser {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private remarkParser: Processor<any, any, any, any, string>;
  private options: {
    srcDir: string;
    assetsDir?: string;
  };
  constructor(options: typeof this.options) {
    this.options = options;
    this.remarkParser = unified()
      .use(remarkParse) // 解析 Markdown
      .use(remarkGfm) // 支持 GitHub 风格的 Markdown
      .use(remarkFrontmatter, ['yaml']) // 支持 YAML Frontmatter
      .use(remarkRehype) // 转换为 HTML
      .use(rehypeSlug) // 为标题生成 id
      .use(rehypeAutolinkHeadings, { behavior: 'wrap' }) // 为标题添加链接
      .use(rehypeHighlight) // 支持代码高亮
      .use(rehypeStringify); // 转换为字符串
  }

  async parseMarkdown(markdown: string): Promise<string> {
    const content = await this.remarkParser.process(markdown);
    return String(content);
  }
}
