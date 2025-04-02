"use client";

import { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

interface Account {
  id: string;
  name: string;
  email: string;
  provider: string;
  lastActivity: Date;
  securityScore: number;
  features: {
    has2FA: boolean;
    supportsPasskeys: boolean;
    isInPasswordManager: boolean;
    passwordStrength: number;
    breachStatus: boolean;
  };
}

export default function AccountsList() {
  const { data: session } = useSession();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const handleConnectGmail = () => {
    signIn('google');
  };

  const handleScanAccounts = async () => {
    try {
      setIsScanning(true);
      console.log('Starting account scan with session:', session);
      
      const response = await fetch('/api/accounts/scan', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for sending cookies
      });
      
      console.log('Raw response:', response);
      const data = await response.json();
      console.log('Scan response:', JSON.stringify(data, null, 2));
      
      if (response.status === 401) {
        console.error('Authentication error - Please reconnect your Gmail account');
        return;
      }

      if (!response.ok) {
        console.error('API error:', response.status, data.error);
        return;
      }

      if (data.error) {
        console.error('Scan error:', data.error);
        return;
      }

      if (data.accounts) {
        setAccounts(prevAccounts => {
          const newAccounts = data.accounts.map((account: any) => ({
            id: account.service,
            name: account.service,
            email: account.email,
            provider: 'discovered',
            lastActivity: new Date(account.lastActivity),
            securityScore: calculateSecurityScore(account.features),
            features: account.features,
          }));

          return [...prevAccounts, ...newAccounts];
        });
      }
    } catch (error) {
      console.error('Error scanning accounts:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const calculateSecurityScore = (features: Account['features']) => {
    let score = 50; // Base score
    if (features.has2FA) score += 20;
    if (features.supportsPasskeys) score += 10;
    if (features.isInPasswordManager) score += 10;
    if (features.passwordStrength > 70) score += 10;
    if (!features.breachStatus) score += 10;
    return Math.min(score, 100);
  };

  return (
    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
      <div className="px-4 py-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Connected Accounts</h2>
          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                Connected as: {session.user?.email}
              </span>
              <button
                onClick={handleScanAccounts}
                disabled={isScanning}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
              >
                {isScanning ? 'Scanning...' : 'Scan for Accounts'}
              </button>
              <button
                onClick={() => signOut()}
                className="rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnectGmail}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Connect Gmail Account
            </button>
          )}
        </div>

        <div className="mt-6 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Service</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Security Score</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">2FA</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Passkeys</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Password Manager</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {accounts.map((account) => (
                    <tr key={account.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {account.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{account.email}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                          account.securityScore >= 80 ? 'bg-green-50 text-green-700' :
                          account.securityScore >= 60 ? 'bg-yellow-50 text-yellow-700' :
                          'bg-red-50 text-red-700'
                        }`}>
                          {account.securityScore}%
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          account.features.has2FA ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {account.features.has2FA ? 'Enabled' : 'Disabled'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          account.features.supportsPasskeys ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {account.features.supportsPasskeys ? 'Supported' : 'Not Supported'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          account.features.isInPasswordManager ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                        }`}>
                          {account.features.isInPasswordManager ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          account.features.breachStatus ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                        }`}>
                          {account.features.breachStatus ? 'Compromised' : 'Secure'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!session && (
                <div className="text-center py-8 text-gray-500">
                  Connect your Gmail account to discover your online accounts.
                </div>
              )}
              {session && accounts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No accounts found. Click "Scan for Accounts" to discover your accounts.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
