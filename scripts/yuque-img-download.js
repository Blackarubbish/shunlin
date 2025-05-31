/**
 * 脚本功能：处理 Yuque Markdown 文档中的图片链接
 * 1. 下载 Markdown 中的图片到本地指定目录
 * 2. 替换 Markdown 中的图片链接为本地路径
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

// 配置项
const config = {
  // 要处理的 Markdown 文件路径，可以是单个文件或目录
  markdownPath: path.join(__dirname, 'docs/blog'),
  // 图片保存的目录
  imagesDir: path.join(__dirname, 'public/blog/ts'),
  // 是否替换 Markdown 中的图片链接为本地路径
  replaceLinks: true,
  // 本地图片URL前缀（相对于网站根目录）
  localUrlPrefix: '/blog/ts'
};

// 从 Markdown 文本中提取图片 URL
function extractImageUrls(markdownText) {
  // 匹配 Markdown 图片语法: ![alt text](image_url)
  const markdownImageRegex = /!\[.*?\]\((.*?)\)/g;
  // 匹配 HTML img 标签: <img src="image_url" />
  const htmlImageRegex = /<img.*?src=["'](.*?)["'].*?>/g;

  const urls = [];
  let match;

  // 提取 Markdown 格式的图片链接
  while ((match = markdownImageRegex.exec(markdownText)) !== null) {
    if (match[1] && match[1].startsWith('http')) {
      urls.push(match[1]);
    }
  }

  // 提取 HTML 格式的图片链接
  while ((match = htmlImageRegex.exec(markdownText)) !== null) {
    if (match[1] && match[1].startsWith('http')) {
      urls.push(match[1]);
    }
  }

  return [...new Set(urls)]; // 去重
}

// 下载图片
// 下载图片 - 使用 fetch API
async function downloadImage(url, outputPath) {
  console.log('start download image:', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
        Referer: 'https://www.yuque.com/',
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      },
      timeout: 10000, // 需要 Node.js v17.5+ 支持
      redirect: 'follow' // 自动处理重定向
    });

    // 检查响应状态
    console.log('response status code:', response.status);
    if (!response.ok) {
      throw new Error(`Failed to download image, status code: ${response.status}`);
    }

    // 创建写入流
    const fileStream = fs.createWriteStream(outputPath);

    // 获取响应流并写入文件
    const responseBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(responseBuffer);

    // 写入文件
    return new Promise((resolve, reject) => {
      fileStream.write(buffer, (err) => {
        if (err) {
          fileStream.close();
          fs.unlink(outputPath, () => {}); // 删除可能部分写入的文件
          reject(err);
          return;
        }

        fileStream.close();
        resolve();
      });
    });
  } catch (error) {
    console.error(`Error downloading ${url}:`, error.message);
    throw error;
  }
}
// 生成本地文件名
function generateLocalFilename(url) {
  // 从 URL 中提取文件名
  const urlPath = new URL(url).pathname;
  const filename = path.basename(urlPath);

  // 如果 URL 没有明确的文件名，则使用 URL 的哈希作为文件名
  if (!filename || filename === '' || !filename.includes('.')) {
    const hash = require('crypto').createHash('md5').update(url).digest('hex');
    return `image-${hash}.png`;
  }

  // 添加时间戳以避免文件名冲突
  const timestamp = Date.now();
  const extension = path.extname(filename);
  const nameWithoutExt = path.basename(filename, extension);

  return `${nameWithoutExt}-${timestamp}${extension}`;
}

// 处理单个 Markdown 文件
async function processMarkdownFile(filePath) {
  console.log(`Processing: ${filePath}`);

  try {
    // 确保图片目录存在
    await mkdirAsync(config.imagesDir, { recursive: true });

    // 读取 Markdown 内容
    const markdownContent = await readFileAsync(filePath, 'utf8');

    // 提取图片 URL
    const imageUrls = extractImageUrls(markdownContent);
    console.log(`Found ${imageUrls.length} images in ${filePath}`);

    if (imageUrls.length === 0) {
      return;
    }

    // 下载图片并获取映射关系
    const urlToLocalPathMap = {};

    const mdFile = path.basename(filePath, '.md'); // 获取文件名，不需要
    let count = 0;

    for (const url of imageUrls) {
      const filename = `${count}-${mdFile}.png`;
      const outputPath = path.join(config.imagesDir, filename);
      const localUrl = `${config.localUrlPrefix}/${filename}`;
      count++;
      try {
        await downloadImage(url, outputPath);
        urlToLocalPathMap[url] = localUrl;
        console.log(`Downloaded: ${url} -> ${outputPath}`);
      } catch (error) {
        console.error(`Failed to download ${url}: ${error.message}`);
      }
    }

    // 替换 Markdown 中的图片链接
    if (config.replaceLinks && Object.keys(urlToLocalPathMap).length > 0) {
      let updatedContent = markdownContent;

      // 替换 Markdown 格式的图片链接
      for (const [originalUrl, localUrl] of Object.entries(urlToLocalPathMap)) {
        const markdownRegex = new RegExp(
          `!\\[(.*?)\\]\\(${escapeRegExp(originalUrl)}\\)`,
          'g'
        );
        updatedContent = updatedContent.replace(markdownRegex, `![$1](${localUrl})`);
      }

      // 替换 HTML 格式的图片链接
      for (const [originalUrl, localUrl] of Object.entries(urlToLocalPathMap)) {
        const htmlRegex = new RegExp(
          `<img(.*?)src=["']${escapeRegExp(originalUrl)}["'](.*?)>`,
          'g'
        );
        updatedContent = updatedContent.replace(htmlRegex, `<img$1src="${localUrl}"$2>`);
      }

      // 只有当内容有变化时才写入文件
      if (updatedContent !== markdownContent) {
        await writeFileAsync(filePath, updatedContent, 'utf8');
        console.log(`Updated links in ${filePath}`);
      }
    }
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
  }
}

// 转义正则表达式中的特殊字符
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 递归处理目录中的所有 Markdown 文件
async function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (entry.isFile() && /\.md$/i.test(entry.name)) {
      await processMarkdownFile(fullPath);
    }
  }
}

// 主函数
async function main() {
  try {
    const pathStats = fs.statSync(config.markdownPath);

    if (pathStats.isDirectory()) {
      await processDirectory(config.markdownPath);
    } else if (pathStats.isFile() && /\.md$/i.test(config.markdownPath)) {
      await processMarkdownFile(config.markdownPath);
    } else {
      console.error('The specified path is not a Markdown file or directory');
    }

    console.log('Done!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

// 执行主函数
main();
