import { appConfig } from '@/app-config';
import Image from 'next/image';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function Footer() {
  return (
    /**
     *     background-color: var(--footer-bg);
    color: var(--footer-text);
    padding: 60px 0 20px;
     */
    <footer className="bg-footer-bg text-footer-text pt-14 pb-4">
      <div className="mb-10 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-10">
        <div className="flex flex-col items-center gap-5 p-4">
          <div className="flex items-center justify-center gap-2">
            <Image
              src="/img/avatar.jpg"
              width={200}
              height={200}
              alt="Bocchi博客"
              className="max-w-20 rounded-2xl"
            />
            <span className="text-primary after:bg-primary after:border-radius-[3px] relative text-3xl font-bold after:absolute after:bottom-[-5px] after:left-0 after:h-[3px] after:w-full after:content-['']">
              ShunLin
            </span>
          </div>
          <div>
            <p>总感觉这里得写点东西但是不知道写啥🤷‍♀️</p>
          </div>
        </div>
        <div>
          <h3 className="mb-5 text-[1.2rem] font-bold">快速链接</h3>
          <ul className="flex flex-col gap-[10px]">
            {appConfig.navList.map((item) => (
              <li key={item.key}>
                <a
                  href={item.url}
                  className="hover:text-primary transition-[color] duration-300">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-5 text-[1.2rem] font-bold">联系方式</h3>
          <ul className="flex flex-col gap-[10px]">
            {appConfig.me.contact.map((item) => (
              <li key={item.title}>
                {item.link && (
                  <a
                    href={item.link}
                    className="hover:text-primary transition-[color] duration-300">
                    {item.title}
                  </a>
                )}
                {item.value && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="hover:text-primary cursor-pointer transition-[color] duration-300">
                        {item.title}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent side="bottom" align="center">
                      <p className="text-center text-2xl font-bold">{item.value}</p>
                    </PopoverContent>
                  </Popover>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="text-center text-[0.9rem]">© 2025 Shunlin. All Rights Reserved.</p>
    </footer>
  );
}
