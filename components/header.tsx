import { cn } from '@/lib';
import { appConfig } from '@/app-config';
import Image from 'next/image';

const Nav = ({ title, url, isActive }: (typeof appConfig)['navList'][number]) => {
  return (
    <li>
      <a
        href={url}
        className={cn(
          'transition-all  duration-300 hover:bg-primary hover:text-text-hover px-3 py-2 rounded-2xl',
          isActive && 'bg-primary text-text-hover'
        )}
      >
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
    <header className="py-5 justify-between flex items-center border-b border-solid border-border md:flex-row flex-col">
      <div className="flex items-center gap-4">
        <Image
          src="/img/avatar.jpg"
          alt="Bocchi博客"
          className="w-12 h-12 object-contain rounded-lg"
          height={48}
          width={48}
        />
        <h1 className="text-2xl font-bold text-text">
          Bocchi<span>博客</span>
        </h1>
      </div>
      <nav className="md:flex   items-center ">
        <button className="mobile-menu-toggle">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className="flex gap-5">
          {appConfig.navList.map((item) => (
            <Nav isActive={isActive(item.url)} key={item.key} title={item.title} url={item.url} />
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
