import { cn } from '@/lib';
import { appConfig } from '@/app-config';
import Image from 'next/image';

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
    console.log('isActive', currentPath, url);
    return currentPath === url;
  };
  return (
    <header className="border-border flex flex-col items-center justify-between border-b border-solid py-5 md:flex-row">
      <div className="flex items-center gap-4">
        <Image
          src="/img/avatar.jpg"
          alt="Bocchi博客"
          className="h-12 w-12 rounded-lg object-contain"
          height={48}
          width={48}
        />
        <h1 className="text-text text-2xl font-bold">
          Bocchi<span>博客</span>
        </h1>
      </div>
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
    </header>
  );
};

export default Header;
