import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ 
        success: false, 
        error: 'SupabaseAdmin client not initialized. Check your environment variables (SUPABASE_SERVICE_ROLE_KEY).' 
      }, { status: 500 });
    }

    // Attempt a simple query to verify connection
    const { data, error } = await supabaseAdmin
      .from('plans')
      .select('count')
      .limit(1);

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: 'Database connection failed: ' + error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully connected to Supabase!',
      details: 'Able to query plans table.'
    });

  } catch (err: any) {
    return NextResponse.json({ 
      success: false, 
      error: 'Unexpected error: ' + err.message 
    }, { status: 500 });
  }
}
