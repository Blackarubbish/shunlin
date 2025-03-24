import FeaturedPosts from '@/components/home/featured-posts';
import Header from '@/components/header';
import Hero from '@/components/hero';
import CategoryList from '@/components/home/category-list';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <>
      <Header currentPath="/" />
      <Hero />
      <FeaturedPosts />
      <CategoryList />
      <Footer />
    </>
  );
}
