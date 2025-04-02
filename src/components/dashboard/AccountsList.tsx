import { Account } from '@/types';

const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'Gmail',
    email: 'user@gmail.com',
    provider: 'google',
    lastActivity: new Date(),
    securityScore: 85,
    has2FA: true,
    isInPasswordManager: true,
    breachStatus: false,
    passwordReused: false,
  },
  {
    id: '2',
    name: 'Dropbox',
    email: 'user@gmail.com',
    provider: 'dropbox',
    lastActivity: new Date(),
    securityScore: 65,
    has2FA: false,
    isInPasswordManager: true,
    breachStatus: true,
    passwordReused: true,
  },
];

export default function AccountsList() {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Connected Accounts</h3>
      </div>
      <ul role="list" className="divide-y divide-gray-200">
        {mockAccounts.map((account) => (
          <li key={account.id} className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-xl font-medium text-gray-600">
                    {account.name[0]}
                  </span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {account.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{account.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {account.has2FA && (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    2FA
                  </span>
                )}
                {account.breachStatus && (
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                    Compromised
                  </span>
                )}
                <button
                  type="button"
                  className="rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="sr-only">View details</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
