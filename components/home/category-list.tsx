import { Category } from '@/types';
import Link from 'next/link';
import { Icon } from '../icons';

const CategoryCard = ({ category }: { category: Category }) => {
  return (
    <Link
      href={`/categories/${category.key}`}
      className="group bg-card-bg shadow-card flex flex-col items-center gap-[15px] rounded-2xl px-5 py-[30px] transition-all duration-300 ease-in-out hover:-translate-y-2.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)]">
      <div className="bg-primary-light text-primary group-hover:bg-primary mb-[10px] flex h-[60px] w-[60px] items-center justify-center rounded-full text-[24px] transition-colors duration-300 group-hover:rotate-6 group-hover:text-white">
        <Icon iconKey="book" strokeWidth={3} />
      </div>
      <h3 className="text-text text-[1.2rem] font-black">{category.name}</h3>
      <p className="text-text-tertiary text-[0.9rem]">{`${category.count || 0}篇文章`}</p>
    </Link>
  );
};

export default function CategoryList() {
  return (
    <div className="py-14 text-center">
      <h2 className="text-text after:bg-primary after:border-radius-[2px] relative mb-10 inline-block text-[2rem] font-bold after:absolute after:bottom-[-10px] after:left-1/2 after:h-[4px] after:w-[60px] after:transform-[translateX(-50%)] after:content-['']">
        文章分类
      </h2>
      {/* 这里添加类别卡片网格 */}
      <div className="mt-1 grid grid-cols-2 gap-[30px] sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
        <CategoryCard
          category={{
            name: 'JavaScript',
            count: 10,
            icon: 'javascript',
            key: 'javascript'
          }}
        />
        <CategoryCard
          category={{
            name: 'JavaScript',
            count: 10,
            icon: 'javascript',
            key: 'javascript'
          }}
        />
        <CategoryCard
          category={{
            name: 'v',
            count: 10,
            icon: 'javascript',
            key: 'javascript'
          }}
        />
        <CategoryCard
          category={{
            name: 'JavaScript',
            count: 10,
            icon: 'javascript',
            key: 'javascript'
          }}
        />
        <CategoryCard
          category={{
            name: 'JavaScript',
            count: 10,
            icon: 'javascript',
            key: 'javascript'
          }}
        />
      </div>
    </div>
  );
}
