import FeaturedPosts from '@/components/home/featured-posts';
import Header from '@/components/header';
import Hero from '@/components/hero';
import CategoryList from '@/components/home/category-list';
import { getPostManager } from '@/lib/docs-manager';

export default async function Home() {
  const postManager = await getPostManager();

  const featuredPosts = postManager.getFeaturedPosts(5);
  const categories = postManager.getAllCategories();
  return (
    <>
      <Header currentPath="/" />
      <Hero />
      <FeaturedPosts posts={featuredPosts} />
      <CategoryList categories={categories} />
    </>
  );
}
