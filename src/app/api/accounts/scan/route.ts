import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { GmailService } from '@/services/gmail';

export async function GET() {
  try {
    console.log('API: Starting account scan...');
    const session = await getServerSession(authOptions);
    console.log('API: Session:', {
      exists: !!session,
      user: session?.user,
      hasAccessToken: !!session?.accessToken,
    });
    
    if (!session) {
      console.log('API: No session found');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (!session.accessToken) {
      console.log('API: No access token in session');
      return NextResponse.json(
        { error: 'No access token' },
        { status: 401 }
      );
    }

    console.log('API: Creating Gmail service...');
    const gmailService = new GmailService(session.accessToken);
    
    console.log('API: Starting email scan...');
    const accounts = await gmailService.scanEmailsForAccounts().catch(error => {
      console.error('API: Gmail service error:', error);
      throw error;
    });
    
    console.log('API: Scan complete, found accounts:', accounts);
    return NextResponse.json({ accounts });

  } catch (error: any) {
    console.error('API: Error in scan route:', error);
    console.error('API: Error stack:', error.stack);
    return NextResponse.json(
      { error: error.message || 'Failed to scan accounts' },
      { status: 500 }
    );
  }
}
