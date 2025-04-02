import { ActionItem } from '@/types';

const mockActions: ActionItem[] = [
  {
    id: '1',
    type: 'enable2fa',
    priority: 'high',
    account: {
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
    description: 'Enable 2FA for better security',
  },
  {
    id: '2',
    type: 'updatePassword',
    priority: 'high',
    account: {
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
    description: 'Update password due to breach',
  },
];

export default function ActionCenter() {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recommended Actions</h3>
      </div>
      <ul role="list" className="divide-y divide-gray-200">
        {mockActions.map((action) => (
          <li key={action.id} className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    action.priority === 'high'
                      ? 'bg-red-100'
                      : action.priority === 'medium'
                      ? 'bg-yellow-100'
                      : 'bg-blue-100'
                  }`}
                >
                  <svg
                    className={`h-5 w-5 ${
                      action.priority === 'high'
                        ? 'text-red-600'
                        : action.priority === 'medium'
                        ? 'text-yellow-600'
                        : 'text-blue-600'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {action.type === 'enable2fa' ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    )}
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">
                    {action.account.name}
                  </p>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </div>
              <button
                type="button"
                className="ml-4 flex-shrink-0 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Fix Now
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
