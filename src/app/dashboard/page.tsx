import SecurityScore from '@/components/dashboard/SecurityScore';
import AccountsList from '@/components/dashboard/AccountsList';
import ActionCenter from '@/components/dashboard/ActionCenter';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SecurityScore />
        <ActionCenter />
      </div>
      <div>
        <AccountsList />
      </div>
    </div>
  );
}
