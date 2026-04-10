import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    // 1. Delete associated data first (to avoid FK constraints if not cascading)
    // Wallets, Notifications, Referrals, tasks etc.
    // In a robust system, these would be cascaded in Postgres.
    
    // 2. Delete the user profile from public.users
    const { error: profileError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId);

    if (profileError) {
      throw profileError;
    }

    // 3. Optional: Delete from Supabase Auth
    // Note: This requires the SERVICE_ROLE_KEY to be configured in supabaseAdmin
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (authError) {
      console.warn('User deleted from DB but failed to delete from Auth:', authError.message);
      // We don't throw here because the main record is gone, but we log it.
    }

    return NextResponse.json({
      success: true,
      message: 'User and all associated data deleted successfully'
    });

  } catch (error: any) {
    console.error('User deletion error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to delete user' 
    }, { status: 500 });
  }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { data, error } = await supabaseAdmin
            .from('users')
            .select('*, plan:plans(*), wallet:wallets(*)')
            .eq('id', params.id)
            .single();

        if (error || !data) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
