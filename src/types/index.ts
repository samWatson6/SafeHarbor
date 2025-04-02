export interface Account {
  id: string;
  name: string;
  email: string;
  provider: string;
  lastActivity: Date;
  securityScore: number;
  has2FA: boolean;
  isInPasswordManager: boolean;
  breachStatus: boolean;
  passwordReused: boolean;
}

export interface SecurityScore {
  overall: number;
  accounts2FA: number;
  accountsInManager: number;
  compromisedAccounts: number;
  reusedPasswords: number;
}

export interface ActionItem {
  id: string;
  type: 'delete' | 'enable2fa' | 'updatePassword' | 'addToManager';
  priority: 'high' | 'medium' | 'low';
  account: Account;
  description: string;
}
