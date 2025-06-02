import { cn } from '@/lib';
import { appConfig } from '@/app-config';
import Image from 'next/image';
import Link from 'next/link';

const Nav = ({ title, url, isActive }: (typeof appConfig)['navList'][number]) => {
  return (
    <li>
      <a
        href={url}
        className={cn(
          'hover:bg-primary hover:text-text-hover rounded-2xl px-3 py-2 transition-all duration-300',
          isActive && 'bg-primary text-text-hover'
        )}>
        {title}
      </a>
    </li>
  );
};

interface Props {
  currentPath: string;
}
const Header = ({ currentPath }: Props) => {
  const isActive = (url: string) => {
    return currentPath === url;
  };
  return (
    <>
      <header className="bg-background fixed top-0 left-0 z-30 flex w-full items-center justify-center">
        <div className="w-full px-5 xl:max-w-[1200px]">
          <div className="border-border shadow-primary/45 shadow-[0 4px 6px -4px rgba(0, 0, 0, 0.1)] flex w-full flex-col items-center justify-between border-b border-solid py-5 md:flex-row">
            <Link href="/" className="flex items-center gap-4">
              <Image
                src={appConfig.me.avatar}
                alt="avatar"
                className="h-12 w-12 rounded-lg object-contain"
                height={48}
                width={48}
              />
              <h1 className="text-text text-2xl font-bold">
                <span>{appConfig.me.name}</span>
                <span className="text-primary ml-1">的秘密基地</span>
              </h1>
            </Link>
            <nav className="items-center md:flex">
              <button className="mobile-menu-toggle">
                <span></span>
                <span></span>
                <span></span>
              </button>
              <ul className="flex gap-5">
                {appConfig.navList.map((item) => (
                  <Nav
                    isActive={isActive(item.url)}
                    key={item.key}
                    title={item.title}
                    url={item.url}
                  />
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <div className="h-[89px]"></div>
    </>
  );
};

export default Header;
