import { favicons } from 'favicons';
import fs from 'fs';

// 输入文件路径
const inputFile = process.argv[2] || 'icon.png';
if (!fs.existsSync(inputFile)) {
  console.error(`Input file "${inputFile}" does not exist.`);
  process.exit(1);
}
// 输出目录
const outputDir = process.argv[3] || './icon-output';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 配置选项
const config = {
  path: '/', // 图标的公共路径
  appName: 'My App', // 应用名称
  appShortName: 'App', // 短名称
  appDescription: 'This is my application', // 应用描述
  developerName: 'Developer', // 开发者名称
  developerURL: null, // 开发者 URL
  icons: {
    android: true, // 生成 Android 图标
    appleIcon: true, // 生成 Apple 图标
    favicons: true, // 生成 favicon
    windows: true, // 生成 Windows 图标
    yandex: false // 不生成 Yandex 图标
  }
};

async function generateIcons() {
  try {
    const response = await favicons(inputFile, config);
    response.images.forEach((image) => {
      const outputPath = `${outputDir}/${image.name}`;
      fs.writeFileSync(outputPath, image.contents);
      console.log(`Generated ${outputPath}`);
    });
    fs.writeFileSync(`${outputDir}/index.html`, response.html.join('\n'));
    console.log('Generated HTML references');
  } catch (error) {
    console.error('Error during icon generation:', error);
  }
}

generateIcons();
