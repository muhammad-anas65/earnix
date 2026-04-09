import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const transactionId = formData.get('transactionId') as string;
    const planId = formData.get('planId') as string;
    const amount = formData.get('amount') as string;
    const receipt = formData.get('receipt') as File;

    if (!transactionId || !planId || !amount || !receipt) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 1. Upload receipt to Storage
    const fileExt = receipt.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('receipts')
      .upload(filePath, receipt);

    if (uploadError) {
      console.error('Receipt upload error:', uploadError);
      return NextResponse.json(
        { success: false, error: 'Failed to upload receipt proof' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('receipts')
      .getPublicUrl(filePath);

    // 2. Insert into payment_submissions
    const { error: insertError } = await supabaseAdmin
      .from('payment_submissions')
      .insert({
        user_id: user.id,
        plan_id: planId,
        amount: parseFloat(amount),
        transaction_id: transactionId,
        receipt_url: publicUrl,
        status: 'pending'
      });

    if (insertError) {
      console.error('Payment submission insert error:', insertError);
      return NextResponse.json(
        { success: false, error: 'Failed to save payment information' },
        { status: 500 }
      );
    }

    // 3. Update user metadata to 'pending' if it was somehow different
    await supabase.auth.updateUser({
      data: { status: 'pending' }
    });

    return NextResponse.json({
      success: true,
      message: 'Payment proof submitted successfully'
    });

  } catch (error) {
    console.error('Payment submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
