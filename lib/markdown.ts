/* eslint-disable @typescript-eslint/no-explicit-any */
import { Processor, unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm'; // 支持 GitHub 风格的 Markdown
import remarkFrontmatter from 'remark-frontmatter'; // 支持 YAML Frontmatter
import rehypeHighlight from 'rehype-highlight'; // 支持代码高亮
import rehypeSlug from 'rehype-slug'; // 为标题生成 id
import rehypeAutolinkHeadings from 'rehype-autolink-headings'; // 为标题添加链接
import remarkDirective from 'remark-directive'; // 支持 :::info ::: 语法
import rehypeRaw from 'rehype-raw'; // 支持原始HTML标签
import { visit } from 'unist-util-visit'; // 用于遍历语法树
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
      .use(remarkDirective) // 支持指令语法
      .use(this.remarkAdmonitions) // 自定义插件处理 admonitions
      // .use(this.remarkMoveImages.bind(this)) // 自定义插件处理图片
      .use(remarkFrontmatter, ['yaml']) // 支持 YAML Frontmatter
      .use(remarkRehype, { allowDangerousHtml: true }) // 转换为 HTML，允许危险的HTML
      .use(rehypeRaw) // 处理原始HTML标签
      .use(rehypeSlug) // 为标题生成 id
      .use(rehypeAutolinkHeadings, { behavior: 'wrap' }) // 为标题添加链接
      .use(rehypeHighlight) // 支持代码高亮
      .use(rehypeStringify); // 转换为字符串
  }

  /**
   * 自定义插件：处理 :::info ::: 语法
   */
  private remarkAdmonitions() {
    return (tree: any) => {
      visit(tree, (node) => {
        if (
          node.type === 'containerDirective' ||
          node.type === 'leafDirective' ||
          node.type === 'textDirective'
        ) {
          const type = node.name;
          // 支持的容器类型
          const supportedTypes = ['info', 'warning', 'error', 'tip', 'note', 'caution'];

          if (supportedTypes.includes(type)) {
            // 将容器指令转换为div元素
            const data = node.data || (node.data = {});
            const tagName = 'div';

            data.hName = tagName;
            data.hProperties = {
              className: [`admonition`, `admonition-${type}`]
            };

            // 如果有标题，添加标题元素
            if (node.attributes?.title) {
              const titleNode = {
                type: 'paragraph',
                data: {
                  hName: 'div',
                  hProperties: { className: 'admonition-title' }
                },
                children: [{ type: 'text', value: node.attributes.title }]
              };

              node.children.unshift(titleNode);
            } else {
              // 添加默认标题
              const titleNode = {
                type: 'paragraph',
                data: {
                  hName: 'div',
                  hProperties: { className: 'admonition-title' }
                },
                children: [
                  { type: 'text', value: type.charAt(0).toUpperCase() + type.slice(1) }
                ]
              };

              node.children.unshift(titleNode);
            }
          }
        }
      });
    };
  }

  async parseMarkdown(markdown: string): Promise<string> {
    const content = await this.remarkParser.process(markdown);
    return String(content);
  }
}
