import FeaturedPosts from '@/components/home/featured-posts';
import Header from '@/components/header';
import Hero from '@/components/hero';
import CategoryList from '@/components/home/category-list';

export default function Home() {
  return (
    <>
      <Header currentPath="/" />
      <Hero />
      <FeaturedPosts />
      <CategoryList />
    </>
  );
}
