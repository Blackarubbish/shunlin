/* eslint-disable @typescript-eslint/no-explicit-any */
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
      // .use(this.remarkMoveImages.bind(this)) // 自定义插件处理图片
      .use(remarkFrontmatter, ['yaml']) // 支持 YAML Frontmatter
      .use(remarkRehype) // 转换为 HTML
      .use(rehypeSlug) // 为标题生成 id
      .use(rehypeAutolinkHeadings, { behavior: 'wrap' }) // 为标题添加链接
      .use(rehypeHighlight) // 支持代码高亮
      .use(rehypeStringify); // 转换为字符串
  }

  /**
   * 自定义插件：处理 Markdown 中的图片
   */
  // private remarkMoveImages() {
  //   const publicDir = path.resolve(process.cwd(), 'public'); // public 目录路径

  //   return (tree: any, file: any) => {
  //     visit(tree, 'image', (node: any) => {
  //       const imagePath = node.url;
  //       console.log('file', file);
  //       // 如果图片路径是本地路径
  //       if (!imagePath.startsWith('http')) {
  //         const sourcePath = path.resolve(this.options.srcDir, imagePath);
  //         const targetPath = path.resolve(publicDir, 'images', path.basename(imagePath));

  //         // 确保目标目录存在
  //         fs.mkdirSync(path.dirname(targetPath), { recursive: true });

  //         // 复制图片到 public/images
  //         fs.copyFileSync(sourcePath, targetPath);

  //         // 更新 Markdown 中的图片路径
  //         node.url = `/images/${path.basename(imagePath)}`;
  //       }
  //     });
  //   };
  // }

  async parseMarkdown(markdown: string): Promise<string> {
    const content = await this.remarkParser.process(markdown);
    return String(content);
  }
}
