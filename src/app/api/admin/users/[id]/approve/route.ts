import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import AdminAlertService from '@/lib/alerts';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .update({ status: 'active' })
      .eq('id', userId)
      .select()
      .single();

    if (userError || !user) {
      return NextResponse.json({ success: false, error: 'Failed to approve user' }, { status: 500 });
    }

    // Optionally award bonus points here if specified in plan
    const { data: plan } = await supabaseAdmin.from('plans').select('*').eq('id', user.plan_id).single();
    if (plan && plan.bonus_points > 0) {
      const { data: wallet } = await supabaseAdmin.from('wallets').select('*').eq('user_id', userId).single();
      if (wallet) {
        await supabaseAdmin.from('wallets')
          .update({
            available_points: wallet.available_points + plan.bonus_points,
            total_earned: wallet.total_earned + plan.bonus_points
          })
          .eq('user_id', userId);
      }
    }

    // Update payment submission status if exists
    const { data: payment } = await supabaseAdmin
      .from('payment_submissions')
      .update({ status: 'approved' })
      .eq('user_id', userId)
      .select()
      .single();
    if (payment) {
      await supabaseAdmin.from('payment_submissions')
        .update({ status: 'approved' })
        .eq('user_id', userId);
    }

    // Create in-app notification
    await supabaseAdmin.from('notifications').insert({
      user_id: userId,
      title: 'Account Approved! 🚀',
      body: `Your account has been approved! You can now access the ${plan?.display_name || 'Standard'} plan features and start earning.`,
      type: 'approval',
    });

    // Update Auth Metadata so middleware immediately sees the new status
    await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { status: 'active' }
    });

    // Send activation email
    await sendActivationEmail(user.email, user.name, plan?.display_name || 'Standard');

    // Send Alert for Premium Activation
    if (plan && plan.price > 0) {
      AdminAlertService.premiumPurchase(user, plan.display_name, plan.price);
    }

    return NextResponse.json({ success: true, message: 'User approved successfully' });

  } catch (error) {
    console.error('Admin approval error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

async function sendActivationEmail(email: string, name: string, planName: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://earnix.pk';
  
  // Try to send via Resend if configured, otherwise use Supabase magic link for notification
  const resendApiKey = process.env.RESEND_API_KEY;
  
  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: 'Earnix <noreply@earnix.pk>',
          to: email,
          subject: '🎉 Your Earnix Account is Approved!',
          html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; margin: 0; padding: 20px;">
  <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 40px 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">🎉 Congratulations!</h1>
    </div>
    <div style="padding: 40px 30px;">
      <p style="color: #1e293b; font-size: 16px; margin: 0 0 20px;">Hi <strong>${name}</strong>,</p>
      <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
        Great news! Your <strong>${planName}</strong> plan has been approved. Your account is now fully active!
      </p>
      <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 30px;">
        You can now log in and start completing tasks to earn points and rewards.
      </p>
      <a href="${appUrl}/login" style="display: inline-block; background: #4f46e5; color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px;">Login to Earnix</a>
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
        <p style="color: #94a3b8; font-size: 13px; margin: 0;">Best regards,<br>The Earnix Team</p>
      </div>
    </div>
  </div>
</body>
</html>
          `,
        }),
      });
      
      if (!res.ok) {
        const err = await res.json();
        console.error('Resend error:', err);
      }
    } catch (err) {
      console.error('Failed to send activation email:', err);
    }
  } else {
    // Fallback: Send password reset email as notification mechanism
    try {
      const supabase = supabaseAdmin;
      await supabase.auth.admin.generateLink({
        type: 'recovery',
        email: email,
      });
    } catch (err) {
      console.error('Fallback email error:', err);
    }
    console.log('Activation email would be sent to:', email, 'Plan:', planName);
  }
}
