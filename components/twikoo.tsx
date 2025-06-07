'use client';

import React, { useEffect } from 'react';
import { appConfig } from '@/app-config';
import '@/assets/styles/twikoo.css';

export const Twikoo: React.FC = () => {
  useEffect(() => {
    // 通过 CDN 引入 twikoo js 文件
    const cdnScript = document.createElement('script');
    cdnScript.src =
      'https://registry.npmmirror.com/twikoo/1.6.44/files/dist/twikoo.min.js';
    cdnScript.async = true;

    const loadSecondScript = () => {
      // 执行 twikoo.init() 函数
      const initScript = document.createElement('script');
      initScript.innerHTML = `
            twikoo.init({
              envId: "${appConfig.twikooEnvId}",
              el: '#twikoo-comment',
              lang: 'zh-CN',
              // 自定义CSS类名，便于样式覆盖
              region: 'ap-shanghai'
            });
          `;
      initScript.id = 'twikoo-init-id';
      document.body.appendChild(initScript);
    };

    cdnScript.addEventListener('load', loadSecondScript);
    document.body.appendChild(cdnScript);

    return () => {
      if (loadSecondScript) {
        cdnScript.removeEventListener('load', loadSecondScript);
      }
      if (cdnScript) {
        document.body.removeChild(cdnScript);
      }
      const secondScript = document.querySelector('#twikoo-init-id');
      if (secondScript) {
        document.body.removeChild(secondScript);
      }
    };
  }, []);

  return <div id="twikoo-comment" className="twikoo"></div>;
};
