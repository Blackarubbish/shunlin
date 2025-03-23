import FeaturedPostCard from './featured-post-card';
export default function FeaturedPosts() {
  return (
    <div className="py-14 text-center">
      <h2 className="text-text after:bg-primary after:border-radius-[2px] relative mb-10 inline-block text-[2rem] font-bold after:absolute after:bottom-[-10px] after:left-1/2 after:h-[4px] after:w-[60px] after:transform-[translateX(-50%)] after:content-['']">
        精选文章
      </h2>
      <div className="mb-10 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[30px]">
        <FeaturedPostCard
          article={{
            title: '这是一篇文章标题',
            date: '2021-09-01',
            excerpt: '这是一篇文章摘要',
            coverImage: '/img/avatar.jpg',
            tags: ['JavaScript', 'TypeScript'],
            summary: '这是一篇文章摘要',
            category: '技术'
          }}
        />
        <FeaturedPostCard
          article={{
            title: '这是一篇文章标题',
            date: '2021-09-01',
            excerpt: '这是一篇文章摘要',
            coverImage: '/img/avatar.jpg',
            tags: ['JavaScript', 'TypeScript'],
            summary: '这是一篇文章摘要',
            category: '技术'
          }}
        />
        <FeaturedPostCard
          article={{
            title: '这是一篇文章标题',
            date: '2021-09-01',
            excerpt: '这是一篇文章摘要',
            coverImage: '/img/avatar.jpg',
            tags: ['JavaScript', 'TypeScript'],
            summary: '这是一篇文章摘要',
            category: '技术'
          }}
        />
      </div>
      <div className="relative mt-5 h-14">
        <a
          href=""
          className="text-primary border-primary hover:bg-primary inline-flex items-center justify-center gap-2 rounded-3xl border-2 px-6 py-3 font-semibold transition-all duration-300 hover:text-white">
          查看更多文章
        </a>
      </div>
    </div>
  );
}
