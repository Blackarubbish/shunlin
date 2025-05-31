import Image from 'next/image';
import { cn } from '@/lib';
import Link from 'next/link';
import { appConfig } from '@/app-config';

const BTN_CLASS = `px-6 py-3 rounded-3xl font-semibold 
   inline-flex items-center justify-center gap-2 transition-all duration-300 
   hover:text-white hover:shadow-card-hover hover:translate-y-[-2px]
   `;
const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-between gap-10 py-16 lg:flex-row">
      <div className="flex flex-1 flex-col items-center justify-center lg:items-start lg:justify-start">
        <h2 className="text-text mb-5 text-3xl font-bold md:text-[2.5rem]">
          {appConfig.greeting.text}{' '}
          <span className="text-primary after:bg-primary after:border-radius-[3px] relative after:absolute after:bottom-[-5px] after:left-0 after:h-[3px] after:w-full after:content-['']">
            {appConfig.greeting.colorText}
          </span>
        </h2>
        <p className="text-text-secondary mb-8 text-center text-[1.2rem]">
          {appConfig.greeting.sub}
        </p>
        <div className="flex gap-4">
          <Link
            href="/articles"
            className={cn(
              BTN_CLASS,
              'text-text-btn-text bg-primary hover:bg-primary-dark'
            )}>
            浏览文章
          </Link>
          <a
            href="/about"
            className={cn(
              BTN_CLASS,
              'text-primary border-primary hover:bg-primary border-2 hover:text-white'
            )}>
            关于我
          </a>
        </div>
      </div>
      <div className="flex flex-1 justify-end">
        <Image
          src={appConfig.me.avatar}
          width={200}
          height={200}
          alt="ShunLin的秘密基地"
          className="animate-float max-w-60 rounded-3xl"
        />
      </div>
    </div>
  );
};
export default Hero;
