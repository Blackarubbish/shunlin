import path from 'path';

interface AppConfig {
  title: string;
  navList: {
    title: string;
    url: string;
    key: string;
    isActive?: boolean;
  }[];
  greeting: string;
  subGreeting: string;
  contact: {
    title: string;
    link?: string;
    value?: string;
  }[];
  srcDir: string;
}

export const appConfig: AppConfig = {
  title: 'Bocchi Blog',
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
  contact: [
    {
      title: '掘金',
      link: '/'
    },
    {
      title: 'GitHub',
      link: '/'
    },
    {
      title: 'Email',
      value: 'shunlin.li@qq.com'
    }
  ],
  srcDir: path.join(process.cwd(), 'docs/blog')
};
