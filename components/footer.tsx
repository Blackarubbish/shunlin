import { appConfig } from '@/app-config';
import Image from 'next/image';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function Footer() {
  return (
    <footer className="bg-footer-bg text-footer-text pt-8 pb-4 md:pt-14">
      <div className="container mx-auto px-4">
        <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mb-10 md:gap-10 lg:grid-cols-3">
          {/* Logo and Intro Section */}
          <div className="flex flex-col items-center gap-3 p-2 sm:items-start md:gap-5 md:p-4">
            <div className="flex items-center gap-2">
              <Image
                src={appConfig.me.avatar}
                width={200}
                height={200}
                alt="Bocchi博客"
                className="w-12 rounded-xl md:w-16 md:rounded-2xl lg:max-w-20"
              />
              <span className="text-primary after:bg-primary relative text-xl font-bold after:absolute after:bottom-[-3px] after:left-0 after:h-[2px] after:w-full after:content-[''] md:text-2xl md:after:bottom-[-5px] md:after:h-[3px] lg:text-3xl">
                ShunLin
              </span>
            </div>
            <div className="text-center text-sm sm:text-left md:text-base">
              <p>总感觉这里得写点东西但是不知道写啥🤷‍♀️</p>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="text-center sm:text-left">
            <h3 className="mb-3 text-lg font-bold md:mb-5 md:text-[1.2rem]">快速链接</h3>
            <ul className="flex flex-col gap-2 md:gap-[10px]">
              {appConfig.navList.map((item) => (
                <li key={item.key}>
                  <a
                    href={item.url}
                    className="hover:text-primary text-sm transition-[color] duration-300 md:text-base">
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="text-center sm:text-left">
            <h3 className="mb-3 text-lg font-bold md:mb-5 md:text-[1.2rem]">联系方式</h3>
            <ul className="flex flex-col gap-2 md:gap-[10px]">
              {appConfig.me.contact.map((item) => (
                <li key={item.title} className="text-sm md:text-base">
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
                      <PopoverContent
                        side="bottom"
                        align="center"
                        className="w-[200px] sm:w-auto">
                        <p className="text-center text-lg font-bold break-all md:text-2xl">
                          {item.value}
                        </p>
                      </PopoverContent>
                    </Popover>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <p className="mt-6 text-center text-xs md:text-[0.9rem]">
        © 2025 Shunlin. All Rights Reserved.
      </p>
    </footer>
  );
}
