import AccountsList from '@/components/dashboard/AccountsList';

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Account Management</h2>
        <p className="text-gray-600 mb-4">
          Manage your connected accounts and their security settings.
        </p>
      </div>
      <AccountsList />
    </div>
  );
}
