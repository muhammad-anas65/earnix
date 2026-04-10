import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data: tasks, error } = await supabaseAdmin
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data: tasks });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.reward_points) {
      return NextResponse.json({ success: false, error: 'Title and Reward Points are required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('tasks')
      .insert({
        title: body.title,
        description: body.description || '',
        instructions: body.instructions || '',
        type: body.type || 'custom',
        reward_points: body.reward_points,
        points_min: body.points_min || body.reward_points,
        points_max: body.points_max || body.reward_points,
        difficulty: body.difficulty || 'Easy',
        estimated_time: body.estimated_time || '5m',
        is_active: body.is_active ?? true,
        plan_access: body.plan_access || ['Free', 'Standard', 'Premium', 'Ultra Pro'],
        repeat_type: body.repeat_type || 'once_only', // once_only, daily, weekly
        daily_limit: body.daily_limit || 1,
        completion_method: body.completion_method || 'backend_validated',
        requires_proof: body.requires_proof || false,
        auto_approve: body.auto_approve ?? true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Admin Task Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
