import Header from '@/components/header';
import { BookOpen, Code, Github, Globe } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

// 模拟友链数据
const friends = [
  {
    name: '张三的博客',
    avatar: '/img/avatar.jpg',
    description: '前端开发工程师，热爱分享技术知识',
    url: 'https://example.com',
    icon: <Globe size={16} />
  },
  {
    name: '李四的技术小站',
    avatar: '/img/avatar.jpg',
    description: '全栈开发者，专注于React和Node.js',
    url: 'https://example.com',
    icon: <Code size={16} />
  },
  {
    name: '王五的代码世界',
    avatar: '/img/avatar.jpg',
    description: '后端工程师，Java和Spring Boot专家',
    url: 'https://example.com',
    icon: <Github size={16} />
  },
  {
    name: '赵六的学习笔记',
    avatar: '/img/avatar.jpg',
    description: '产品经理，记录产品设计和用户体验思考',
    url: 'https://example.com', 
    icon: <BookOpen size={16} />
  }
];

export default function Friends() {
  return (
    <>
      <Header currentPath="/friends" />
      <div className="py-14">
        <div className="mb-10 text-center">
          <h1 className="text-text mb-3.5 text-[2.5rem] font-bold">友情链接</h1>
          <p className="text-text-secondary mx-auto my-0 max-w-[700px] text-[1.1rem]">
            这些是我的朋友们，他们都是很棒的博主和开发者
          </p>
        </div>
        
        <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {friends.map((friend, index) => (
            <a
              key={index}
              href={friend.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card-bg border-border hover:border-primary group flex items-start gap-4 rounded-xl border p-6 transition-all duration-300 hover:shadow-md"
            >
              <div className="relative h-16 w-16 overflow-hidden rounded-full">
                <Image
                  src={friend.avatar}
                  alt={friend.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-text text-lg font-bold">{friend.name}</h2>
                  <span className="text-text-tertiary group-hover:text-primary transition-colors duration-300">
                    {friend.icon}
                  </span>
                </div>
                <p className="text-text-secondary text-sm">{friend.description}</p>
              </div>
            </a>
          ))}
        </div>
        
        <div className="mx-auto max-w-2xl rounded-xl border border-dashed border-primary-light bg-primary-light/10 p-8 text-center">
          <h2 className="text-text mb-4 text-xl font-bold">想要添加友链？</h2>
          <p className="text-text-secondary mb-6">
            如果您也是博主或开发者，欢迎与我交换友链。请通过以下方式联系我：
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="mailto:shunlin.li@qq.com"
              className="bg-primary hover:bg-primary/90 rounded-full px-6 py-2 text-white transition-all duration-300"
            >
              发送邮件
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card-bg text-text border-border hover:border-primary hover:text-primary rounded-full border px-6 py-2 transition-all duration-300"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </>
  );
} 