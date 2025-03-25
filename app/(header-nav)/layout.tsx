import Footer from '@/components/footer';

export default function HeaderNavLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-background mx-auto min-h-screen px-5 xl:max-w-[1200px]">
      {children}
      <Footer />
    </div>
  );
}
