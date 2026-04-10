const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Load env
const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();

const supabase = createClient(url, key);

const initialTasks = [
  {
    title: 'Daily Check-in',
    description: 'Claim your daily attendance reward.',
    instructions: 'Simply click the claim button to get your daily points.',
    type: 'daily_checkin',
    reward_points: 3,
    difficulty: 'Easy',
    estimated_time: '1m',
    is_active: true,
    plan_access: ['Free', 'Standard', 'Premium', 'Ultra Pro'],
    repeat_type: 'daily',
    daily_limit: 1,
    auto_approve: true
  },
  {
    title: 'Complete Profile',
    description: 'Finish setting up your account details.',
    instructions: 'Go to your profile page and fill in all required fields.',
    type: 'profile_completion',
    reward_points: 15,
    difficulty: 'Easy',
    estimated_time: '5m',
    is_active: true,
    plan_access: ['Free', 'Standard', 'Premium', 'Ultra Pro'],
    repeat_type: 'once_only',
    auto_approve: true
  },
  {
    title: 'Verify Phone',
    description: 'Ensure your account is linked to a valid phone number.',
    instructions: 'Verify your phone via OTP in the settings page.',
    type: 'phone_verification',
    reward_points: 5,
    difficulty: 'Medium',
    estimated_time: '2m',
    is_active: true,
    plan_access: ['Free', 'Standard', 'Premium', 'Ultra Pro'],
    repeat_type: 'once_only',
    auto_approve: true
  },
  {
    title: 'App Walkthrough',
    description: 'Learn how to use Earnix effectively.',
    instructions: 'Visit the tutorial section and watch the intro video.',
    type: 'onboarding_task',
    reward_points: 10,
    difficulty: 'Easy',
    estimated_time: '3m',
    is_active: true,
    plan_access: ['Free', 'Standard', 'Premium', 'Ultra Pro'],
    repeat_type: 'once_only',
    auto_approve: true
  },
  {
    title: 'Explore Wallet',
    description: 'Familiarize yourself with and secure your earnings.',
    instructions: 'Visit the wallet page to see your current balance and withdrawal options.',
    type: 'interaction_task',
    reward_points: 3,
    difficulty: 'Easy',
    estimated_time: '1m',
    is_active: true,
    plan_access: ['Free', 'Standard', 'Premium', 'Ultra Pro'],
    repeat_type: 'once_only',
    auto_approve: true
  },
  {
    title: 'Referral Hub Tour',
    description: 'Prepare for your referral campaign.',
    instructions: 'Visit the referral page and copy your unique link.',
    type: 'interaction_task',
    reward_points: 3,
    difficulty: 'Easy',
    estimated_time: '1m',
    is_active: true,
    plan_access: ['Free', 'Standard', 'Premium', 'Ultra Pro'],
    repeat_type: 'once_only',
    auto_approve: true
  },
  {
    title: 'Daily Earnix Quiz',
    description: 'Test your knowledge and earn points.',
    instructions: 'Answer 3 multiple choice questions about platform security.',
    type: 'quiz',
    reward_points: 15,
    difficulty: 'Medium',
    estimated_time: '5m',
    is_active: true,
    plan_access: ['Free', 'Standard', 'Premium', 'Ultra Pro'],
    repeat_type: 'daily',
    auto_approve: true
  },
  {
    title: 'First Deposit Bonus',
    description: 'Activate your premium earning potential.',
    instructions: 'Upgrade your plan by making your first deposit.',
    type: 'deposit_bonus',
    reward_points: 20,
    difficulty: 'Hard',
    estimated_time: '10m',
    is_active: true,
    plan_access: ['Standard', 'Premium', 'Ultra Pro'],
    repeat_type: 'once_only',
    auto_approve: false
  }
];

async function seed() {
  console.log('Seeding MVP tasks...');
  for (const task of initialTasks) {
    const { error } = await supabase.from('tasks').insert(task);
    if (error) console.error(`Error seeding ${task.title}:`, error.message);
    else console.log(`Seeded: ${task.title}`);
  }
}

seed();
