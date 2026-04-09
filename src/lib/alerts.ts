import { supabaseAdmin } from './supabase';

type AlertPriority = 'HIGH' | 'MEDIUM' | 'LOW';

interface AlertPayload {
  user?: {
    name: string;
    email: string;
    phone?: string;
    plan?: string;
  };
  event?: {
    type: string;
    amount?: number | string;
    method?: string;
    transactionId?: string;
    reason?: string;
    riskLevel?: string;
    count?: number;
    threshold?: number;
  };
  details?: Record<string, any>;
}

const WEBHOOK_URL = process.env.GOOGLE_CHAT_WEBHOOK_URL;

class AdminAlertService {
  /**
   * Sends a formatted alert to Google Chat.
   * This is designed to be fire-and-forget (non-blocking).
   */
  static async send(priority: AlertPriority, title: string, payload: AlertPayload) {
    if (!WEBHOOK_URL) {
      console.warn('Alert NOT sent: GOOGLE_CHAT_WEBHOOK_URL is missing in environment.');
      return;
    }

    try {
      const message = this.formatMessage(priority, title, payload);
      
      // Fire and forget, don't await to avoid blocking the main flow
      fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message }),
      }).catch(err => console.error('Error sending Google Chat alert:', err));

    } catch (error) {
      // Log error but don't crash
      console.error('Alert formatting failed:', error);
    }
  }

  /**
   * Formats the alert message based on priority and event data.
   */
  private static formatMessage(priority: AlertPriority, title: string, payload: AlertPayload): string {
    const timestamp = new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' });
    let text = `*${priority === 'HIGH' ? '🚨' : priority === 'MEDIUM' ? '🔔' : 'ℹ️'} [${priority}] ${title}*\n`;
    text += `Time: \`${timestamp}\`\n\n`;

    if (payload.user) {
      text += `👤 *User:* ${payload.user.name}\n`;
      text += `📧 *Email:* ${payload.user.email}\n`;
      if (payload.user.phone) text += `📞 *Phone:* ${payload.user.phone}\n`;
      if (payload.user.plan) text += `💎 *Plan:* ${payload.user.plan}\n`;
      text += '\n';
    }

    if (payload.event) {
      if (payload.event.amount) text += `💰 *Amount:* ${payload.event.amount}\n`;
      if (payload.event.method) text += `💳 *Method:* ${payload.event.method}\n`;
      if (payload.event.transactionId) text += `🆔 *Txn ID:* \`${payload.event.transactionId}\`\n`;
      if (payload.event.riskLevel) text += `⚠️ *Risk Level:* ${payload.event.riskLevel}\n`;
      if (payload.event.reason) text += `📝 *Reason:* ${payload.event.reason}\n`;
      if (payload.event.count !== undefined) text += `📊 *Count:* ${payload.event.count}\n`;
      if (payload.event.threshold !== undefined) text += `🚩 *Threshold:* ${payload.event.threshold}\n`;
    }

    if (payload.details) {
      text += '\n*Additional Specs:*\n';
      Object.entries(payload.details).forEach(([key, value]) => {
        text += `• ${key}: ${value}\n`;
      });
    }

    text += `\n🔗 _View in Admin Panel: ${process.env.NEXT_PUBLIC_APP_URL}/admin_`;
    
    return text;
  }

  // Helper methods for common alerts
  static async newUser(user: any) {
    return this.send('MEDIUM', 'New User Registered', {
      user: {
          name: user.name,
          email: user.email,
          phone: user.phone || 'N/A',
          plan: user.plan_id || 'Free'
      }
    });
  }

  static async paymentSubmitted(user: any, details: { plan: string, amount: number | string, method: string, txnId: string, proof?: boolean }) {
    return this.send('HIGH', 'New Paid Plan Payment Submitted', {
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      event: {
        type: 'payment',
        amount: details.amount,
        method: details.method,
        transactionId: details.txnId,
        reason: details.proof ? 'Proof Uploaded' : 'Proof Pending'
      },
      details: {
        'Target Plan': details.plan
      }
    });
  }

  static async withdrawalRequested(user: any, details: { amount: number | string, method: string, accountName: string, accountNumber: string }) {
    return this.send('HIGH', 'New Withdrawal Request Submitted', {
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      event: {
        type: 'withdrawal',
        amount: details.amount,
        method: details.method
      },
      details: {
        'Account Name': details.accountName,
        'Account Number': details.accountNumber,
        'Status': 'Pending'
      }
    });
  }

  static async suspiciousActivity(user: any, details: { type: string, risk: string, reason: string }) {
    return this.send('HIGH', 'Suspicious Activity Flagged', {
      user: {
        name: user?.name || 'Unknown',
        email: user?.email || 'N/A'
      },
      event: {
        type: 'fraud',
        riskLevel: details.risk,
        reason: `${details.type}: ${details.reason}`
      }
    });
  }

  static async pendingApprovalsThreshold(count: number, threshold: number) {
    return this.send('HIGH', 'Pending Approvals Threshold Reached', {
      event: {
        type: 'threshold',
        count,
        threshold,
        reason: `Urgent: ${count} users are waiting for approval!`
      }
    });
  }

  static async premiumPurchase(user: any, plan: string, amount: number) {
    return this.send('MEDIUM', 'Premium Plan Purchased', {
      user: {
        name: user.name,
        email: user.email
      },
      event: {
        type: 'purchase',
        amount: `₨ ${amount}`,
        reason: `User upgraded to ${plan}`
      }
    });
  }

  private static loginFailures = new Map<string, { count: number, lastTime: number }>();

  static async trackFailedLogin(email: string) {
    const now = Date.now();
    const windowMs = 10 * 60 * 1000; // 10 minutes
    const threshold = 5;

    let record = this.loginFailures.get(email);
    
    if (!record || (now - record.lastTime) > windowMs) {
      record = { count: 1, lastTime: now };
    } else {
      record.count += 1;
      record.lastTime = now;
    }

    this.loginFailures.set(email, record);

    if (record.count === threshold) {
      await this.send('HIGH', 'Security Alert: Multiple Failed Login Attempts', {
        event: {
          type: 'security',
          reason: `Too many failed login attempts for ${email}`,
          count: record.count,
          riskLevel: 'HIGH'
        },
        details: {
          'Target Email': email,
          'Window': '10 Minutes'
        }
      });
      // Reset after alert to avoid spam for every single subsequent failure
      this.loginFailures.delete(email);
    }
  }

  static async checkPendingThreshold() {
    try {
      const { count, error } = await supabaseAdmin
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (error) throw error;

      const threshold = 10; // Can be moved to env
      if (count !== null && count >= threshold) {
        // Only alert at specific multiples to avoid spam (10, 20, 30...)
        if (count % threshold === 0) {
          await this.pendingApprovalsThreshold(count, threshold);
        }
      }
    } catch (err) {
      console.error('Threshold check error:', err);
    }
  }
}

export default AdminAlertService;
