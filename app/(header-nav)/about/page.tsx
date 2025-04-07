import { appConfig } from '@/app-config';
import Header from '@/components/header';
import { CustomIconNames, CustomIcons } from '@/components/icons';
import Image from 'next/image';
import Link from 'next/link';

export default function About() {
  return (
    <>
      <Header currentPath="/about" />
      <div className="py-14">
        <div className="mb-10 text-center">
          <h1 className="text-text mb-3.5 text-[2.5rem] font-bold">关于我</h1>
          <p className="text-text-secondary mx-auto my-0 max-w-[700px] text-[1.1rem]">
            了解更多关于我的信息和我的技术栈
          </p>
        </div>

        <div className="mb-16 flex flex-col items-center justify-center gap-10 md:flex-row">
          <div className="relative h-72 w-72 overflow-hidden rounded-xl">
            <Image src="/img/avatar.jpg" alt="Bocchi" fill className="object-cover" />
          </div>
          <div className="max-w-xl">
            <h2 className="text-text mb-4 text-3xl font-bold">{appConfig.me.name}</h2>
            <p className="text-text-secondary mb-6">
              菜鸡前端开发工程师一枚，抽象大师，轻度二刺螈，正在练习电吉他🎸(不想玩抽象的电吉他选手不是好程序员)。
            </p>
            <p className="text-text-secondary mb-6">
              目前主要使用的技术栈包括React、Next.js、Node.js和TypeScript。我相信技术应该服务于创造价值，而不仅仅是为了技术而技术(👈这句话是copilot帮我写的)。
            </p>
            <h3 className="text-text/90 mb-4 text-2xl font-bold">关于这个网站</h3>
            <p className="text-text-secondary mb-6">
              因为太喜欢《孤独摇滚》所以搭建博客的时候希望以主角团四人的颜色来构建整个网站。使用的是Next.js+本地文件系统管理Markdown的形式来搭建。
            </p>
            <div className="flex flex-wrap gap-4">
              {appConfig.me.contact.map((item) => {
                return (
                  <Link
                    className="bg-card-bg text-text border-border hover:border-primary hover:text-primary inline-flex items-center gap-2 rounded-full border px-4 py-2 transition-all duration-300"
                    key={item.key}
                    href={item.link || '/'}>
                    <CustomIcons
                      size={24}
                      name={(item.icon as CustomIconNames) || 'Book2'}
                    />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-text mb-8 text-center text-2xl font-bold">我的技能</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {appConfig.me.skills?.map((skill) => (
              <div
                key={skill}
                className="bg-card-bg border-border hover:border-primary flex items-center justify-center rounded-lg border p-4 text-center font-medium transition-all duration-300">
                {skill}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-text mb-8 text-center text-2xl font-bold">我的经历</h2>
          <div className="flex flex-col gap-6">
            {appConfig.me.expirience?.map((experience, index) => (
              <div
                key={index}
                className="bg-card-bg border-border hover:border-primary relative rounded-lg border p-6 transition-all duration-300 hover:shadow-md">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-text text-xl font-bold">
                    {experience.organization}
                  </h3>
                  <span className="bg-primary-light text-primary rounded-full px-3 py-1 text-sm font-medium">
                    {experience.period}
                  </span>
                </div>
                <p className="text-text mb-2 font-medium">{experience.title}</p>
                <p className="text-text-secondary">{experience.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
