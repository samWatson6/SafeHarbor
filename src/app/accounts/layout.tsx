import DashboardLayout from '@/components/layout/DashboardLayout';

export default function AccountsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
