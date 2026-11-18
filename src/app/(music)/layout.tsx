import MainLayout from '@/components/MainLayout/MainLayout';

export default function MusicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
