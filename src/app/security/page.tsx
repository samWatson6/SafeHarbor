import SecurityScore from '@/components/dashboard/SecurityScore';
import ActionCenter from '@/components/dashboard/ActionCenter';

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Security Overview</h2>
        <p className="text-gray-600 mb-4">
          Monitor and improve your security posture across all accounts.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SecurityScore />
        <ActionCenter />
      </div>
    </div>
  );
}
