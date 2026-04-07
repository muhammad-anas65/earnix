# Earnix Platform - Technical Specification

## 1. Project Overview

**Project Name:** Earnix
**Type:** Task-to-Earn Platform (Full-Stack)
**Core Functionality:** A professional earning platform where users register, choose membership plans, complete tasks, earn points, refer others, and withdraw earnings under controlled rules.
**Target Users:** General users seeking to earn through task completion, and administrators managing the platform.

---

## 2. Tech Stack

### Frontend
- **Website:** Next.js 14 (App Router) with TypeScript
- **Mobile App:** React Native with Expo
- **UI Library:** TailwindCSS + Custom Components
- **State Management:** Zustand (web), React Context (mobile)
- **Forms:** React Hook Form + Zod validation

### Backend & Services
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Firebase Authentication (Phone + Email)
- **Storage:** Supabase Storage (receipts, images)
- **Notifications:** Firebase Cloud Messaging
- **Email:** Resend API / Nodemailer (transactional emails)

### Development
- **Monorepo:** Turbo/Turborepo
- **Package Manager:** npm/pnpm
- **Version Control:** Git

---

## 3. Database Schema

### Tables

#### `users`
```sql
- id: UUID (PK)
- firebase_uid: VARCHAR(128) UNIQUE
- name: VARCHAR(100)
- email: VARCHAR(255) UNIQUE
- phone: VARCHAR(20) UNIQUE
- password_hash: VARCHAR(255)
- referral_code: VARCHAR(20) UNIQUE
- referred_by: UUID (FK -> users.id) NULLABLE
- plan_id: UUID (FK -> plans.id)
- status: ENUM('pending', 'active', 'suspended', 'rejected')
- device_id: VARCHAR(255)
- ip_address: VARCHAR(45)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### `plans`
```sql
- id: UUID (PK)
- name: VARCHAR(50)
- price: DECIMAL(10,2)
- daily_task_limit: INT
- min_points_per_task: INT
- max_points_per_task: INT
- daily_earning_cap: INT
- withdrawal_threshold: INT
- referral_reward: INT
- bonus_points: INT
- is_popular: BOOLEAN DEFAULT false
- is_active: BOOLEAN DEFAULT true
- created_at: TIMESTAMP
```

#### `wallets`
```sql
- id: UUID (PK)
- user_id: UUID (FK -> users.id) UNIQUE
- available_points: INT DEFAULT 0
- pending_points: INT DEFAULT 0
- locked_points: INT DEFAULT 0
- total_earned: INT DEFAULT 0
- total_withdrawn: INT DEFAULT 0
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### `tasks`
```sql
- id: UUID (PK)
- title: VARCHAR(255)
- description: TEXT
- points_min: INT
- points_max: INT
- task_type: ENUM('click', 'watch', 'survey', 'download', 'signup')
- is_active: BOOLEAN DEFAULT true
- created_at: TIMESTAMP
```

#### `user_tasks`
```sql
- id: UUID (PK)
- user_id: UUID (FK -> users.id)
- task_id: UUID (FK -> tasks.id)
- status: ENUM('available', 'completed', 'pending_verification', 'rejected')
- points_earned: INT
- completed_at: TIMESTAMP NULLABLE
- created_at: TIMESTAMP
```

#### `daily_task_logs`
```sql
- id: UUID (PK)
- user_id: UUID (FK -> users.id)
- date: DATE
- tasks_completed: INT DEFAULT 0
- points_earned: INT DEFAULT 0
- PRIMARY KEY (user_id, date)
```

#### `referrals`
```sql
- id: UUID (PK)
- referrer_id: UUID (FK -> users.id)
- referred_id: UUID (FK -> users.id)
- status: ENUM('pending', 'qualified', 'expired')
- tasks_completed: INT DEFAULT 0
- reward_sent: BOOLEAN DEFAULT false
- reward_points: INT
- created_at: TIMESTAMP
- qualified_at: TIMESTAMP NULLABLE
```

#### `payments`
```sql
- id: UUID (PK)
- user_id: UUID (FK -> users.id)
- plan_id: UUID (FK -> plans.id)
- transaction_id: VARCHAR(100)
- amount: DECIMAL(10,2)
- receipt_image: VARCHAR(500)
- status: ENUM('pending', 'approved', 'rejected')
- admin_notes: TEXT
- processed_by: UUID (FK -> admins.id) NULLABLE
- processed_at: TIMESTAMP NULLABLE
- created_at: TIMESTAMP
```

#### `withdrawals`
```sql
- id: UUID (PK)
- user_id: UUID (FK -> users.id)
- amount: DECIMAL(10,2)
- points_used: INT
- method: ENUM('easypaisa', 'jazzcash')
- recipient_name: VARCHAR(100)
- recipient_phone: VARCHAR(20)
- status: ENUM('pending', 'approved', 'rejected', 'paid')
- admin_notes: TEXT
- processed_by: UUID (FK -> admins.id) NULLABLE
- processed_at: TIMESTAMP NULLABLE
- created_at: TIMESTAMP
```

#### `admins`
```sql
- id: UUID (PK)
- firebase_uid: VARCHAR(128) UNIQUE
- name: VARCHAR(100)
- email: VARCHAR(255) UNIQUE
- role: ENUM('super_admin', 'approver', 'finance', 'support')
- is_active: BOOLEAN DEFAULT true
- created_at: TIMESTAMP
```

#### `notifications`
```sql
- id: UUID (PK)
- user_id: UUID (FK -> users.id)
- title: VARCHAR(255)
- body: TEXT
- type: ENUM('approval', 'task', 'referral', 'withdrawal', 'system')
- is_read: BOOLEAN DEFAULT false
- fcm_sent: BOOLEAN DEFAULT false
- created_at: TIMESTAMP
```

#### `system_settings`
```sql
- id: UUID (PK)
- key: VARCHAR(100) UNIQUE
- value: JSONB
- updated_at: TIMESTAMP
```

#### `fraud_logs`
```sql
- id: UUID (PK)
- user_id: UUID (FK -> users.id)
- event_type: VARCHAR(100)
- details: JSONB
- ip_address: VARCHAR(45)
- device_id: VARCHAR(255)
- created_at: TIMESTAMP
```

---

## 4. Feature Specifications

### 4.1 Landing Page
- Hero section with "Get Started" CTA
- "How It Works" (3 steps)
- Pricing plans preview
- Trust indicators
- Footer with links

### 4.2 Plans System
| Plan | Price (PKR) | Daily Tasks | Points/Task | Daily Cap | Withdrawal Min | Referral Reward | Bonus |
|------|-------------|-------------|-------------|-----------|-----------------|-----------------|-------|
| Free | 0 | 2 | 5-12 | 50 | 800 PKR | 100 pts | 0-20 pts |
| Standard | 500 | 5 | 10-25 | 150 | 500 PKR | 150 pts | 300 pts |
| Premium | 1199 | 10 | 20-50 | 300 | 300 PKR | 250 pts | 900 pts |
| Ultra Pro | 1699 | 15 | 30-80 | 500 | 200 PKR | 350 pts | 1500 pts |

### 4.3 Authentication Flow
1. User enters phone number
2. Firebase sends OTP
3. User enters OTP
4. If new user: redirect to signup with phone pre-filled
5. If existing user: redirect to dashboard

### 4.4 Signup Process
- Fields: Name, Email, Phone, Password
- Password validation: 8+ chars, uppercase, lowercase, number, special char
- Referral code input (optional)
- Selected plan displayed at top

### 4.5 Payment Submission (Paid Plans)
- Display admin-configured payment details (EasyPaisa/JazzCash)
- User submits:
  - Transaction ID (required)
  - Receipt image upload (required)
- Status: Pending until admin approval

### 4.6 Pending Approval Page
- Message: "Your account is under review"
- Display selected plan
- 24-hour countdown timer
- Tips for faster approval

### 4.7 User Dashboard
- Wallet overview (available, pending, locked points)
- Points balance in PKR
- Today's tasks progress
- Recent activity
- Quick actions

### 4.8 Task System
- Daily task list based on plan limits
- Task types: Click, Watch, Survey, Download, Signup
- Random point allocation within range
- Completion tracking
- Daily reset at midnight

### 4.9 Referral System
- Unique referral code per user
- Shareable link
- Referral dashboard showing referrals and status
- Rewards: Released when referred user completes 3 tasks
- Monthly cap: 50 referrals max per month

### 4.10 Withdrawal System
- Minimum withdrawal based on plan
- 100 points = 10 PKR conversion
- Methods: EasyPaisa, JazzCash
- Required fields: Name, Phone, Amount
- Points locked during processing
- Email notification on status change

### 4.11 Notifications
- In-app notifications
- Push notifications via FCM
- Types: Approval, Task reward, Referral reward, Withdrawal update, Inactivity reminder

### 4.12 Admin Panel
Modules:
- **Dashboard:** Stats overview, recent activity
- **Users:** User list, details, status management
- **Approvals:** Pending approvals, payment review
- **Payments:** Payment records, approval actions
- **Withdrawals:** Withdrawal requests, processing
- **Plans:** Plan management, pricing control
- **Tasks:** Task management, point ranges
- **Referrals:** Referral tracking, abuse detection
- **Reports:** Earnings, withdrawals, user growth
- **Settings:** System configuration, fraud rules

---

## 5. Security & Fraud Protection

### Device & IP Tracking
- Store device_id and IP on signup
- Detect duplicate devices/IPs
- Flag suspicious patterns

### Fraud Detection Rules
- Same device multiple signups
- Same IP multiple accounts
- Rapid task completion (bot detection)
- Self-referral prevention
- Withdrawal amount validation
- Pattern analysis for suspicious activity

### Security Measures
- Password hashing (bcrypt)
- JWT tokens for API auth
- Rate limiting on all endpoints
- Input validation and sanitization
- CORS configuration
- Admin role-based access control

---

## 6. API Endpoints

### Auth
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-phone` - Phone verification
- `POST /api/auth/logout` - Logout

### Users
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update profile
- `GET /api/users/referrals` - Get user's referrals

### Wallet
- `GET /api/wallet` - Get wallet balance
- `GET /api/wallet/transactions` - Transaction history

### Tasks
- `GET /api/tasks` - Get available tasks
- `POST /api/tasks/:id/complete` - Complete a task
- `GET /api/tasks/daily-status` - Get daily task status

### Payments
- `POST /api/payments` - Submit payment proof
- `GET /api/payments/:id` - Get payment status

### Withdrawals
- `POST /api/withdrawals` - Request withdrawal
- `GET /api/withdrawals` - Get withdrawal history
- `GET /api/withdrawals/:id` - Get withdrawal status

### Admin
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id/status` - Update user status
- `GET /api/admin/approvals` - Pending approvals
- `PUT /api/admin/approvals/:id` - Process approval
- `GET /api/admin/withdrawals` - All withdrawal requests
- `PUT /api/admin/withdrawals/:id` - Process withdrawal
- `GET /api/admin/plans` - List plans
- `PUT /api/admin/plans/:id` - Update plan
- `GET /api/admin/tasks` - List tasks
- `PUT /api/admin/tasks/:id` - Update task
- `GET /api/admin/stats` - Dashboard statistics

---

## 7. Environment Variables

### Web App
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
```

### Backend
```
SUPABASE_SERVICE_ROLE_KEY=
FIREBASE_ADMIN_SDK_PATH=
JWT_SECRET=
RESEND_API_KEY=
```

---

## 8. Deployment Structure

```
earnix-platform/
├── apps/
│   ├── web/              # Next.js website
│   │   ├── src/
│   │   │   ├── app/      # App Router pages
│   │   │   ├── components/
│   │   │   ├── lib/
│   │   │   ├── hooks/
│   │   │   └── types/
│   │   ├── public/
│   │   └── package.json
│   │
│   ├── mobile/           # React Native Expo app
│   │   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   └── package.json
│   │
│   └── admin/            # Admin panel
│       ├── src/
│       └── package.json
│
├── packages/
│   └── shared/           # Shared types and utilities
│       ├── types/
│       └── utils/
│
├── supabase/
│   ├── migrations/       # Database migrations
│   └── seed.sql          # Seed data
│
└── turbo.json            # Turborepo config
```

---

## 9. Implementation Priority

1. **Phase 1 - Core Setup**
   - Project structure
   - Supabase schema
   - Firebase config
   - Basic auth flow

2. **Phase 2 - User Flow**
   - Landing page
   - Signup/Select plan
   - Payment submission
   - Pending approval page
   - User dashboard

3. **Phase 3 - Core Features**
   - Task system
   - Points economy
   - Wallet management
   - Referral system

4. **Phase 4 - Admin & Withdrawals**
   - Admin panel
   - Withdrawal system
   - Notification system

5. **Phase 5 - Mobile App**
   - Expo setup
   - Core screens
   - Push notifications

6. **Phase 6 - Polish**
   - Fraud protection
   - Performance optimization
   - Security hardening
