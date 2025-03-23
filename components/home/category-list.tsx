const CategoryCard = () => {
  return (
    <div className="bg-card-bg shadow-card flex flex-col items-center gap-[15px] rounded-2xl px-5 py-[30px] transition-[transform,box-shadow] duration-300 ease-in-out hover:-translate-y-2.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)]">
      <div className="bg-primary-light text-primary mb-[10px] flex h-[60px] w-[60px] items-center justify-center rounded-full text-[24px]"></div>
    </div>
  );
};

export default function CategoryList() {
  return (
    <div className="py-14 text-center">
      <h2 className="text-text after:bg-primary after:border-radius-[2px] relative mb-10 inline-block text-[2rem] font-bold after:absolute after:bottom-[-10px] after:left-1/2 after:h-[4px] after:w-[60px] after:transform-[translateX(-50%)] after:content-['']">
        文章分类
      </h2>
      {/* 这里添加类别卡片网格 */}
      <div className="mt-1 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-[30px]">
        {/* 添加卡片实例 */}
        <CategoryCard />
      </div>
    </div>
  );
}
