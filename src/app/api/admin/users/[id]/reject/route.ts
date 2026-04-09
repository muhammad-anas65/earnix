import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import AdminAlertService from '@/lib/alerts';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    const body = await request.json();
    const { reason } = body;

    const { error: userError } = await supabaseAdmin
      .from('users')
      .update({ status: 'rejected' })
      .eq('id', userId);

    if (userError) {
      return NextResponse.json({ success: false, error: 'Failed to reject user' }, { status: 500 });
    }

    await supabaseAdmin.from('notifications').insert({
      user_id: userId,
      title: 'Account Rejected',
      body: reason || 'Your account registration was not approved. Please contact support for more details.',
      type: 'approval',
    });

    // Update Auth Metadata status
    await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { status: 'rejected' }
    });

    // Send Alert for Rejection
    const { data: user } = await supabaseAdmin.from('users').select('*, plan:plans(*)').eq('id', userId).single();
    if (user) {
      AdminAlertService.send('MEDIUM', 'Rejected Payment Submission', {
        user: { name: user.name, email: user.email },
        event: { 
          type: 'rejection', 
          reason: reason || 'Information verification failed',
          plan: user.plan?.display_name 
        }
      });
    }

    return NextResponse.json({ success: true, message: 'User rejected successfully' });

  } catch (error) {
    console.error('Admin rejection error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
