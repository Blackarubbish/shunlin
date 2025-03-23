import Image from 'next/image';
import { cn } from '@/lib';

const BTN_CLASS = `px-6 py-3 rounded-3xl font-semibold 
   inline-flex items-center justify-center gap-2 transition-all duration-300 
   hover:text-white hover:shadow-card-hover hover:translate-y-[-2px]
   `;
const Hero = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between py-16 gap-10">
      <div className="flex-1 flex justify-center items-center flex-col lg:justify-start lg:items-start">
        <h2 className="md:text-[2.5rem] text-3xl font-bold mb-5 text-text">
          Welcome to{' '}
          <span
            className="text-primary relative after:content-[''] after:absolute after:bottom-[-5px] 
          after:left-0 after:w-full after:h-[3px] after:bg-primary after:border-radius-[3px]"
          >
            Bocchi Blog
          </span>
        </h2>
        <p className="text-text-secondary text-[1.2rem] mb-8">分享生活、技术、音乐、动漫等内容</p>
        <div className="flex gap-4">
          <a
            href="/articles"
            className={cn(BTN_CLASS, 'text-text-btn-text bg-primary hover:bg-primary-dark')}
          >
            浏览文章
          </a>
          <a
            href="/about"
            className={cn(
              BTN_CLASS,
              'text-primary border-2 border-primary hover:bg-primary hover:text-white'
            )}
          >
            关于我
          </a>
        </div>
      </div>
      <div className="flex-1 flex justify-end">
        <Image
          src="/img/avatar.jpg"
          width={200}
          height={200}
          alt="Bocchi博客"
          className="animate-float max-w-60 rounded-3xl"
        />
      </div>
    </div>
  );
};
export default Hero;
