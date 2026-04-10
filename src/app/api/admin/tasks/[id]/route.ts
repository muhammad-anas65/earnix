import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: task, error } = await supabaseAdmin
      .from('tasks')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) throw error;
    if (!task) return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: task });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const { data, error } = await supabaseAdmin
      .from('tasks')
      .update({
        title: body.title,
        description: body.description,
        instructions: body.instructions,
        type: body.type,
        reward_points: body.reward_points,
        difficulty: body.difficulty,
        estimated_time: body.estimated_time,
        is_active: body.is_active,
        plan_access: body.plan_access,
        repeat_type: body.repeat_type,
        daily_limit: body.daily_limit,
        auto_approve: body.auto_approve,
        requires_proof: body.requires_proof,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabaseAdmin
      .from('tasks')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Task deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
