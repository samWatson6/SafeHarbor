import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export interface DetectedAccount {
  service: string;
  email: string;
  lastActivity: Date;
  confidence: number;
  features: {
    has2FA: boolean;
    supportsPasskeys: boolean;
    isInPasswordManager: boolean;
    passwordStrength: number;
    breachStatus: boolean;
  };
}

// Known service features and capabilities
const SERVICE_FEATURES = {
  'instagram': {
    has2FA: true,
    supportsPasskeys: false,
    defaultPasswordStrength: 70,
  },
  'facebook': {
    has2FA: true,
    supportsPasskeys: true,
    defaultPasswordStrength: 70,
  },
  'twitter': {
    has2FA: true,
    supportsPasskeys: true,
    defaultPasswordStrength: 70,
  },
  'linkedin': {
    has2FA: true,
    supportsPasskeys: false,
    defaultPasswordStrength: 70,
  },
  'github': {
    has2FA: true,
    supportsPasskeys: true,
    defaultPasswordStrength: 80,
  },
  'dropbox': {
    has2FA: true,
    supportsPasskeys: false,
    defaultPasswordStrength: 70,
  },
  'microsoft': {
    has2FA: true,
    supportsPasskeys: true,
    defaultPasswordStrength: 75,
  },
  'apple': {
    has2FA: true,
    supportsPasskeys: true,
    defaultPasswordStrength: 80,
  },
  'amazon': {
    has2FA: true,
    supportsPasskeys: false,
    defaultPasswordStrength: 70,
  },
  'tiktok': {
    has2FA: true,
    supportsPasskeys: false,
    defaultPasswordStrength: 65,
  }
};

const ACCOUNT_DOMAINS = {
  'instagram': ['instagram.com', 'mail.instagram.com'],
  'facebook': ['facebook.com', 'mail.facebook.com', 'facebookmail.com'],
  'twitter': ['twitter.com', 'x.com', 'mail.twitter.com'],
  'linkedin': ['linkedin.com', 'mail.linkedin.com'],
  'github': ['github.com', 'mail.github.com'],
  'dropbox': ['dropbox.com', 'mail.dropbox.com'],
  'microsoft': ['microsoft.com', 'outlook.com', 'live.com'],
  'apple': ['apple.com', 'icloud.com'],
  'amazon': ['amazon.com', 'marketplace.amazon.com'],
  'tiktok': ['tiktok.com', 'mail.tiktok.com'],
};

export class GmailService {
  private oauth2Client: OAuth2Client;

  constructor(accessToken: string) {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    this.oauth2Client.setCredentials({ access_token: accessToken });
  }

  private gmail() {
    return google.gmail({ version: 'v1', auth: this.oauth2Client });
  }

  async scanEmailsForAccounts(): Promise<DetectedAccount[]> {
    const detectedAccounts = new Map<string, DetectedAccount>();
    const gmail = this.gmail();

    try {
      console.log('Gmail Service: Starting scan with token:', this.oauth2Client.credentials.access_token?.slice(0, 10) + '...');
      
      // Test the token first
      try {
        await gmail.users.getProfile({ userId: 'me' });
      } catch (error: any) {
        console.error('Gmail Service: Token validation failed:', error.message);
        if (error.code === 401) {
          throw new Error('Gmail authentication failed. Please reconnect your account.');
        }
        throw error;
      }

      // Create a list of queries for each service domain
      const queries = Object.values(ACCOUNT_DOMAINS).flat().map(domain => `from:*@${domain}`);
      
      // Get messages for each domain in batches
      const allMessages = new Set<string>();
      for (const query of queries) {
        try {
          const response = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 10, // Limit per domain for faster results
            q: query,
            labelIds: ['INBOX'], // Only check inbox messages
          });

          if (response.data.messages) {
            response.data.messages.forEach(msg => msg.id && allMessages.add(msg.id));
          }
        } catch (error) {
          console.warn('Gmail Service: Error fetching messages for query:', query, error);
          continue; // Skip this domain on error
        }
      }

      console.log('Gmail Service: Found', allMessages.size, 'potential service-related messages');

      // Fetch message metadata in batches
      const messageIds = Array.from(allMessages);
      const batchSize = 10;
      const batches = [];

      for (let i = 0; i < messageIds.length; i += batchSize) {
        const batch = messageIds.slice(i, i + batchSize);
        batches.push(batch);
      }

      for (const batch of batches) {
        const messagePromises = batch.map(id =>
          gmail.users.messages.get({
            userId: 'me',
            id,
            format: 'metadata',
            metadataHeaders: ['From', 'Date', 'Subject'],
          }).catch(error => {
            console.warn('Gmail Service: Get message error for ID', id, ':', error);
            return null;
          })
        );

        const messageResults = (await Promise.all(messagePromises)).filter(result => result !== null);

        // Process each message's metadata
        for (const message of messageResults) {
          if (!message) continue;
          
          const headers = message.data.payload?.headers;
          const fromHeader = headers?.find(h => h.name === 'From');
          const dateHeader = headers?.find(h => h.name === 'Date');

          if (fromHeader?.value) {
            const fromEmail = fromHeader.value.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0];
            if (fromEmail) {
              const domain = fromEmail.split('@')[1].toLowerCase();

              // Check domain against known services
              for (const [service, domains] of Object.entries(ACCOUNT_DOMAINS)) {
                if (domains.some(d => domain.includes(d))) {
                  if (!detectedAccounts.has(service)) {
                    const features = SERVICE_FEATURES[service as keyof typeof SERVICE_FEATURES] || {
                      has2FA: false,
                      supportsPasskeys: false,
                      defaultPasswordStrength: 50,
                    };

                    detectedAccounts.set(service, {
                      service,
                      email: fromEmail,
                      lastActivity: dateHeader?.value ? new Date(dateHeader.value) : new Date(),
                      confidence: 0.9,
                      features: {
                        has2FA: features.has2FA,
                        supportsPasskeys: features.supportsPasskeys,
                        isInPasswordManager: false,
                        passwordStrength: features.defaultPasswordStrength,
                        breachStatus: false,
                      },
                    });
                  }
                  break;
                }
              }
            }
          }
        }
      }

      const results = Array.from(detectedAccounts.values());
      console.log('Gmail Service: Scan complete, found', results.length, 'accounts');
      return results;

    } catch (error) {
      console.error('Gmail Service: Error in scanEmailsForAccounts:', error);
      throw error;
    }
  }
}
