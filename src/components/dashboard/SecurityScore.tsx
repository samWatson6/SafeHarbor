import { SecurityScore as SecurityScoreType } from '@/types';

const mockScore: SecurityScoreType = {
  overall: 85,
  accounts2FA: 8,
  accountsInManager: 7,
  compromisedAccounts: 2,
  reusedPasswords: 3,
};

export default function SecurityScore() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900">Security Score</h3>
      <div className="mt-4 flex items-center justify-between">
        <div className="relative h-32 w-32">
          <svg className="h-full w-full" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#10B981"
              strokeWidth="3"
              strokeDasharray={`${mockScore.overall}, 100`}
            />
            <text x="18" y="20.35" className="text-3xl" textAnchor="middle" fill="#111827">
              {mockScore.overall}
            </text>
          </svg>
        </div>
        <div className="space-y-3 ml-6 flex-1">
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">2FA Enabled</span>
              <span className="font-medium text-gray-900">{mockScore.accounts2FA}/10</span>
            </div>
            <div className="mt-1 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-green-500"
                style={{ width: `${(mockScore.accounts2FA / 10) * 100}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Password Manager</span>
              <span className="font-medium text-gray-900">{mockScore.accountsInManager}/10</span>
            </div>
            <div className="mt-1 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-blue-500"
                style={{ width: `${(mockScore.accountsInManager / 10) * 100}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Compromised Accounts</span>
              <span className="font-medium text-gray-900">{mockScore.compromisedAccounts}</span>
            </div>
            <div className="mt-1 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-red-500"
                style={{ width: `${(mockScore.compromisedAccounts / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
