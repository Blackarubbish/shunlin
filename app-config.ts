import path from 'path';
import { Friends } from './types';

interface AppConfig {
  title: string;
  me: {
    name: string;
    skills?: string[];
    expirience?: {
      period: string;
      organization: string;
      title: string;
      description: string;
    }[];
    email?: string;
    avatar?: string;
    contact: {
      title: string;
      link?: string;
      value?: string;
      key: string;
      icon: string;
    }[];
  };
  navList: {
    title: string;
    url: string;
    key: string;
    isActive?: boolean;
  }[];
  greeting: string;
  subGreeting: string;
  srcDir: string;
}

export const appConfig: AppConfig = {
  title: 'Bocchi Blog',
  me: {
    name: 'ShunLin',
    email: 'shunlin.li@qq.com',
    skills: [
      '做好吃的减脂餐🦐',
      '单手颠锅',
      '电吉他🎸',
      'React',
      'TypeScript',
      'Node.js',
      'Golang'
    ],
    contact: [
      {
        title: '掘金',
        key: 'juejin',
        link: '/',
        icon: 'Juejin'
      },
      {
        title: 'GitHub',
        key: 'github',
        link: '/',
        icon: 'Github'
      },
      {
        title: 'Email',
        key: 'email',
        value: 'shunlin.li@qq.com',
        icon: 'Email'
      },
      {
        title: 'bilibili',
        key: 'bilibili',
        link: '/',
        icon: 'Bilibili'
      }
    ],
    expirience: [
      {
        period: '2023 - 至今',
        organization: '某科技公司',
        title: '前端开发工程师',
        description:
          '参与各种前端项目的开发搭建，短暂参与过后端的开发，还使用golang为内部提供了一个开发者工具'
      },
      {
        period: '2019 - 2023',
        organization: '中国地质大学(武汉)',
        title: '本科学习',
        description:
          '毕业于中国地质大学(武汉)，软件工程专业，大二的时候发现Node.js也太全能了，果断选择JavaScript相关的就业方向'
      }
    ]
  },
  navList: [
    {
      title: '首页',
      url: '/',
      key: 'index'
    },
    {
      title: '文章',
      url: '/articles',
      key: 'articles'
    },
    {
      title: '分类',
      url: '/categories',
      key: 'categories'
    },
    {
      title: '关于',
      url: '/about',
      key: 'about'
    },
    {
      title: '友链',
      url: '/friends',
      key: 'friends'
    }
  ],
  greeting: "Hello, I'm Bocchi.",
  subGreeting: 'A web developer.',
  srcDir: path.join(process.cwd(), 'docs/blog')
};

export const friends: Friends[] = [];
