import FeaturedPosts from '@/components/featured-posts';
import Header from '@/components/header';
import Hero from '@/components/hero';

export default function Home() {
  return (
    <>
      <Header currentPath="/" />
      <Hero />
      <FeaturedPosts />
    </>
  );
}
