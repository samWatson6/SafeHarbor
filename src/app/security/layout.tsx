import DashboardLayout from '@/components/layout/DashboardLayout';

export default function SecurityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
