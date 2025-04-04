import FeaturedPosts from '@/components/home/featured-posts';
import Header from '@/components/header';
import Hero from '@/components/hero';
import CategoryList from '@/components/home/category-list';
import { getPostManager } from '@/lib/docs-manager';

export default async function Home() {
  const postManager = await getPostManager();

  const posts = postManager.getAllPosts();
  console.log('posts', posts);
  const categories = postManager.getAllCategories();
  console.log('categories', categories);
  return (
    <>
      <Header currentPath="/" />
      <Hero />
      <FeaturedPosts />
      <CategoryList />
    </>
  );
}
