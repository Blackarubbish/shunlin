import Header from '@/components/header';
import { Code } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { appConfig, friends } from '@/app-config';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import EmailTemplateBox from './email';
import { Comment } from '@/components/comment';

// 强制页面使用静态生成
export const dynamic = 'force-static';

// 可选：添加生成元数据
export const metadata = {
  title: '友链 | ' + appConfig.title,
  description: '欢迎互换友链，我们一起变强💪'
};
export default function Friends() {
  return (
    <>
      <Header currentPath="/friends" />
      <div className="min-h-2/3 py-14">
        <div className="mb-10 text-center">
          <h1 className="text-text mb-3.5 text-[2.5rem] font-bold">友情链接</h1>
          <p className="text-text-secondary mx-auto my-0 max-w-[700px] text-[1.1rem]">
            在每个新的一年三百六十五天 每天进步一点点💪
          </p>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {friends.map((friend, index) => (
            <a
              key={index}
              href={friend.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card-bg border-border hover:border-primary group flex items-start gap-4 rounded-xl border p-6 transition-all duration-300 hover:shadow-md">
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
                    <Code size={16} />
                  </span>
                </div>
                <p className="text-text-secondary text-sm">{friend.description}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="border-primary-light bg-primary-light/10 mx-auto max-w-2xl rounded-xl border border-dashed p-8 text-center">
          <h2 className="text-text mb-4 text-xl font-bold">想要添加友链？</h2>
          <p className="text-text-secondary mb-6">
            欢迎与我交换友链，您可以通过以下方式联系我。
          </p>
          <div className="flex justify-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <div className="bg-primary hover:bg-primary/90 cursor-pointer rounded-full px-6 py-2 text-white transition-all duration-300">
                  发送邮件
                </div>
              </PopoverTrigger>
              <PopoverContent side="top" align="center">
                <p className="text-center text-2xl font-bold">
                  {appConfig.me.email || ''}
                </p>
              </PopoverContent>
            </Popover>

            <a
              href={
                appConfig.me.contact.find((item) => item.key === 'github')?.link || ''
              }
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card-bg text-text border-border hover:border-primary hover:text-primary rounded-full border px-6 py-2 transition-all duration-300">
              GitHub
            </a>
          </div>
        </div>

        {/* 新增：友链申请邮件模板板块 */}
        <div className="border-primary-light bg-primary-light/5 mx-auto mt-8 max-w-2xl rounded-xl border p-8">
          <h2 className="text-text mb-4 text-center text-xl font-bold">
            邮件内容辛苦附带上以下信息🧎‍♂️
          </h2>
          <EmailTemplateBox />
        </div>
      </div>
      <Comment />
    </>
  );
}
