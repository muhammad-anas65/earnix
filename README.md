# Earnix - Task-to-Earn Platform

A complete full-stack web platform for earning money through task completion, referrals, and controlled withdrawals.

## 📋 Features

### User Features
- **Plan Selection** - Choose from Free, Standard, Premium, or Ultra Pro plans
- **Task System** - Complete daily tasks based on your plan limits
- **Points Economy** - Earn points (100 pts = 10 PKR conversion rate)
- **Referral System** - Invite friends and earn bonus points
- **Withdrawal System** - Cash out via EasyPaisa or JazzCash
- **Wallet Management** - Track available, pending, and locked points

### Admin Features
- **Dashboard** - Real-time stats and metrics
- **User Management** - Approve/reject registrations
- **Payment Verification** - Review payment proofs
- **Withdrawal Processing** - Approve/reject payout requests
- **Fraud Protection** - Device/IP tracking and duplicate detection

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Firebase Auth
- **Forms**: React Hook Form + Zod
- **State**: Zustand

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase account
- Firebase project

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd earnix

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local with your credentials
```

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Security
JWT_SECRET=your_secret_key_minimum_32_chars
```

### Database Setup

1. Create a new Supabase project
2. Go to SQL Editor
3. Run the migration from `supabase/migrations/001_initial_schema.sql`

### Running the App

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── signup/               # Signup page
│   ├── login/                # Login page
│   ├── payment/              # Payment submission
│   ├── pending-approval/     # Pending approval page
│   ├── dashboard/            # User dashboard
│   │   ├── tasks/            # Tasks page
│   │   ├── referrals/        # Referrals page
│   │   └── withdraw/         # Withdraw page
│   └── admin/                # Admin panel
│       ├── page.tsx           # Admin dashboard
│       └── approvals/        # Approvals page
├── components/               # Shared components
├── lib/                     # Utilities & configs
│   ├── supabase.ts          # Supabase client
│   ├── firebase.ts          # Firebase config
│   ├── store.ts             # Zustand stores
│   └── utils.ts             # Helper functions
└── types/                   # TypeScript types
```

## 📊 Plans Configuration

| Plan | Price | Daily Tasks | Points/Task | Min Withdrawal |
|------|-------|-------------|-------------|----------------|
| Free | 0 PKR | 2 | 5-12 | 800 PKR |
| Standard | 500 PKR | 5 | 10-25 | 500 PKR |
| Premium | 1199 PKR | 10 | 20-50 | 300 PKR |
| Ultra Pro | 1699 PKR | 15 | 30-80 | 200 PKR |

## 🔐 Business Rules

### Points Economy
- 100 points = 10 PKR
- Points earned go to pending → available after validation
- Withdrawal locks points until processed

### Referral System
- Referral qualifies after 3 tasks completed
- Rewards: 100-350 points based on plan
- Self-referral and duplicate device detection

### Fraud Protection
- Device ID tracking
- IP address logging
- Duplicate account detection
- Suspicious activity flags

## 📱 Pages

### Public
- `/` - Landing page with hero, features, pricing
- `/signup` - Registration with plan selection
- `/login` - User authentication
- `/payment` - Payment submission for paid plans

### User Dashboard
- `/dashboard` - Overview with stats, tasks, referrals
- `/dashboard/tasks` - Available tasks list
- `/dashboard/referrals` - Referral management
- `/dashboard/withdraw` - Withdrawal request form

### Admin Panel
- `/admin` - Dashboard with platform metrics
- `/admin/approvals` - User approval management
- `/admin/withdrawals` - Withdrawal processing
- `/admin/users` - User management

## 🔒 Security

- Passwords hashed with bcrypt (12 rounds)
- JWT-based API authentication
- Protected admin routes
- Input validation on all forms
- RLS (Row Level Security) in Supabase
- Device fingerprinting for fraud detection

## 📄 License

Proprietary software. All rights reserved.

## 🤝 Support

For support: support@earnix.pk
