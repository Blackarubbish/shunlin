import Header from '@/components/header';
import { appConfig } from '@/app-config';
import { Github, Mail, Twitter } from 'lucide-react';
import Image from 'next/image';

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
            <Image
              src="/img/avatar.jpg"
              alt="Bocchi"
              fill
              className="object-cover"
            />
          </div>
          <div className="max-w-xl">
            <h2 className="mb-4 text-3xl font-bold text-text">李顺林</h2>
            <p className="mb-6 text-text-secondary">
              我是一名热爱技术的全栈开发工程师，专注于Web开发领域。通过这个博客，我希望能够分享我的技术心得、学习经验以及对行业的思考。
            </p>
            <p className="mb-6 text-text-secondary">
              目前主要使用的技术栈包括React、Next.js、Node.js和TypeScript。我相信技术应该服务于创造价值，而不仅仅是为了技术而技术。
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-card-bg text-text border-border hover:border-primary hover:text-primary inline-flex items-center gap-2 rounded-full border px-4 py-2 transition-all duration-300"
              >
                <Github size={18} />
                <span>GitHub</span>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-card-bg text-text border-border hover:border-primary hover:text-primary inline-flex items-center gap-2 rounded-full border px-4 py-2 transition-all duration-300"
              >
                <Twitter size={18} />
                <span>Twitter</span>
              </a>
              <a 
                href="mailto:shunlin.li@qq.com" 
                className="bg-card-bg text-text border-border hover:border-primary hover:text-primary inline-flex items-center gap-2 rounded-full border px-4 py-2 transition-all duration-300"
              >
                <Mail size={18} />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-text">我的技能</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {[
              '前端开发', 'React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS',
              'JavaScript', 'CSS', 'HTML', 'Git', 'UI/UX', '响应式设计'
            ].map((skill) => (
              <div 
                key={skill} 
                className="bg-card-bg border-border hover:border-primary flex items-center justify-center rounded-lg border p-4 text-center font-medium transition-all duration-300"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="mb-8 text-center text-2xl font-bold text-text">我的经历</h2>
          <div className="flex flex-col gap-6">
            {[
              {
                period: '2022 - 至今',
                company: '某科技公司',
                title: '高级前端开发工程师',
                description: '负责公司核心产品的前端架构设计和开发，优化用户体验，提升产品性能。'
              },
              {
                period: '2020 - 2022',
                company: '某互联网公司',
                title: '前端开发工程师',
                description: '参与多个Web应用的开发，负责UI组件库的维护和迭代。'
              },
              {
                period: '2018 - 2020',
                company: '某创业公司',
                title: '初级前端开发',
                description: '从事Web应用开发，积累了丰富的实战经验。'
              }
            ].map((experience, index) => (
              <div
                key={index}
                className="bg-card-bg border-border hover:border-primary relative rounded-lg border p-6 transition-all duration-300 hover:shadow-md"
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-xl font-bold text-text">{experience.company}</h3>
                  <span className="bg-primary-light text-primary rounded-full px-3 py-1 text-sm font-medium">
                    {experience.period}
                  </span>
                </div>
                <p className="mb-2 font-medium text-text">{experience.title}</p>
                <p className="text-text-secondary">{experience.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
