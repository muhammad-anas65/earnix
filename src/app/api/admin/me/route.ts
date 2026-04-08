import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const adminId = request.headers.get('x-user-id');
    
    if (!adminId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { data: admin, error } = await supabaseAdmin
      .from('admins')
      .select('id, email, name')
      .eq('id', adminId)
      .single();

    if (error || !admin) {
      return NextResponse.json({ success: false, error: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: admin
    });

  } catch (error) {
    console.error('Admin fetch error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
