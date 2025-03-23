export default function HeaderNavLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-screen bg-background xl:max-w-[1280px] mx-auto">{children}</div>;
}
