import Link from 'next/link';
import { 
  TrendingUp, 
  Shield, 
  Users, 
  Wallet, 
  CheckCircle, 
  Star, 
  ArrowRight,
  Play,
  Gift,
  Clock,
  Smartphone,
  CreditCard,
  Zap,
  Target,
  Award
} from 'lucide-react';
import { cn, formatCurrency, DEFAULT_PLANS } from '@/lib/utils';

const features = [
  {
    icon: Zap,
    title: 'Instant Earnings',
    description: 'Complete tasks and earn points instantly. Watch your balance grow with every completed task.',
  },
  {
    icon: Users,
    title: 'Referral Bonuses',
    description: 'Invite friends and earn bonus points. The more friends you refer, the more you earn!',
  },
  {
    icon: Wallet,
    title: 'Easy Withdrawals',
    description: 'Cash out your earnings directly to EasyPaisa or JazzCash. No hidden fees.',
  },
  {
    icon: Shield,
    title: 'Secure & Trusted',
    description: 'Your data is protected with enterprise-grade security. Trusted by thousands of users.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Choose Your Plan',
    description: 'Select from our flexible plans. Start free or upgrade for more earning potential.',
    icon: CreditCard,
  },
  {
    number: '02',
    title: 'Get Approved',
    description: 'Submit your registration and wait for admin approval. Usually within 24 hours.',
    icon: CheckCircle,
  },
  {
    number: '03',
    title: 'Complete Tasks & Earn',
    description: 'Browse and complete simple tasks daily. Earn points with each completed task.',
    icon: Target,
  },
  {
    number: '04',
    title: 'Withdraw Earnings',
    description: 'Once you reach the minimum threshold, withdraw your earnings instantly.',
    icon: Smartphone,
  },
];

const testimonials = [
  {
    name: 'Ahmed Khan',
    location: 'Lahore',
    text: 'Earnix has been a great way to earn extra income. The tasks are simple and payouts are reliable.',
    rating: 5,
    avatar: 'AK',
  },
  {
    name: 'Fatima Bibi',
    location: 'Karachi',
    text: 'I started with the free plan and upgraded to Premium. Best decision I made. The earnings are real!',
    rating: 5,
    avatar: 'FB',
  },
  {
    name: 'Muhammad Ali',
    location: 'Islamabad',
    text: 'The referral system is amazing. I have earned a lot by simply sharing with friends.',
    rating: 5,
    avatar: 'MA',
  },
];

const stats = [
  { label: 'Active Users', value: '10,000+' },
  { label: 'Points Earned', value: '5M+' },
  { label: 'Withdrawals', value: '₨ 10M+' },
  { label: 'Tasks Completed', value: '1M+' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 nav-blur">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-24">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">Earnix</span>
            </Link>
            
            <div className="hidden lg:flex items-center space-x-10">
              {['Features', 'How It Works', 'Plans'].map((item) => (
                <Link key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors tracking-tight uppercase">
                  {item}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center space-x-6">
              <Link href="/login" className="text-sm font-black text-slate-900 hover:text-indigo-600 transition-colors uppercase tracking-widest">
                Sign In
              </Link>
              <Link href="/signup" className="hidden sm:flex px-6 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 lg:pt-64 lg:pb-48 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
           <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-100 rounded-full blur-[120px] opacity-60 animate-float"></div>
           <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[120px] opacity-60 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative text-center">
          <div className="inline-flex items-center px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em] mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
            <Star className="w-3 h-3 mr-2 fill-current" />
            Pakistan's #1 Earning Platform
          </div>
          
          <h1 className="text-5xl lg:text-8xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-700">
            Earn Money with <span className="text-gradient">Total Freedom.</span>
          </h1>
          
          <p className="text-lg lg:text-2xl text-slate-500 mb-14 max-w-3xl mx-auto font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-1000">
            Join thousands of users earning daily through simple verified tasks. 
            No complex skills required. Just your computer or phone and a few minutes a day.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <Link href="/signup" className="btn-premium w-full sm:w-auto">
              Start Earning Today <ArrowRight className="w-5 h-5 ml-3" />
            </Link>
            <Link href="#how-it-works" className="btn-ghost w-full sm:w-auto">
              See How It Works
            </Link>
          </div>

          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 max-w-5xl mx-auto border-t border-slate-100 pt-16">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group">
                <p className="text-3xl lg:text-4xl font-black text-slate-900 mb-2 group-hover:scale-110 transition-transform">{stat.value}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Cards stacked cleanly on mobile */}
      <section id="how-it-works" className="py-24 lg:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20 lg:mb-32">
            <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-6">Four Steps to Success</h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">Everything is designed for simplicity. From signup to payout, we've removed every barrier.</p>
          </div>
          
          <div className="grid lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="premium-card relative group">
                <div className="absolute top-8 right-8 text-6xl font-black text-slate-50 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">{step.number}</div>
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8 border border-indigo-100 group-hover:scale-110 transition-transform duration-500">
                  <step.icon className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed uppercase tracking-tight">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Premium card layout */}
      <section id="features" className="py-24 lg:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-end justify-between mb-20 lg:mb-32 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl lg:text-6xl font-black text-slate-900 mb-6">Designed for <br/> <span className="text-gradient">Maximum Earnings.</span></h2>
              <p className="text-lg text-slate-500 font-medium">Earnix combines state-of-the-art security with a clean user experience to give you the platform you deserve.</p>
            </div>
            <Link href="/signup" className="group flex items-center text-sm font-black text-indigo-600 uppercase tracking-widest">
              Join the community <div className="ml-4 w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all"><ArrowRight className="w-5 h-5"/></div>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="premium-card">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl flex items-center justify-center mb-8 shadow-xl">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - Most critical for mobile conversion */}
      <section id="plans" className="py-24 lg:py-32 bg-slate-900 text-white rounded-[3rem] lg:rounded-[5rem] mx-4 lg:mx-10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
          <div className="text-center max-w-3xl mx-auto mb-20 lg:mb-32">
            <h2 className="text-3xl lg:text-6xl font-black text-white mb-6">Choose Your Growth</h2>
            <p className="text-lg text-slate-400 font-medium">Select the plan that matches your ambition. Upgrade anytime to unlock higher limits.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {DEFAULT_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  'relative p-10 rounded-[2.5rem] border transition-all duration-500 hover:-translate-y-2 group',
                  plan.is_popular 
                    ? 'bg-indigo-600 border-indigo-400 shadow-2xl shadow-indigo-500/30' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                )}
              >
                {plan.is_popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-5 py-2 bg-white text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-xl font-bold mb-6">{plan.display_name}</h3>
                <div className="mb-8">
                  <span className="text-4xl lg:text-5xl font-black">
                    {plan.price === 0 ? 'Free' : `₨ ${plan.price.toLocaleString()}`}
                  </span>
                </div>
                
                <div className="space-y-5 mb-10">
                  <div className="flex items-center text-sm font-medium text-slate-300">
                    <CheckCircle className="w-5 h-5 text-indigo-400 mr-4" />
                    {plan.daily_task_limit} daily tasks
                  </div>
                  <div className="flex items-center text-sm font-medium text-slate-300">
                    <CheckCircle className="w-5 h-5 text-indigo-400 mr-4" />
                    Up to {plan.max_points_per_task} points/task
                  </div>
                </div>
                
                <Link
                  href={`/signup?plan=${plan.id}`}
                  className={cn(
                    'w-full py-4 rounded-2xl text-center font-black uppercase tracking-widest text-xs transition-all block',
                    plan.is_popular 
                      ? 'bg-white text-indigo-600 shadow-xl' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-500'
                  )}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Glassmorphism */}
      <section className="py-24 lg:py-40 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-8 items-center">
            <div className="max-w-lg">
               <h2 className="text-4xl lg:text-6xl font-black text-slate-900 mb-8 leading-tight">Voices of the <br/> <span className="text-secondary tracking-tighter">Community.</span></h2>
               <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10">Real users, real earnings. Join Pakistan's fastest growing digital community.</p>
               <div className="flex -space-x-4 mb-4">
                  {[1,2,3,4].map(i => <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200"></div>)}
                  <div className="w-12 h-12 rounded-full border-4 border-white bg-indigo-600 flex items-center justify-center text-white text-[10px] font-black">+10k</div>
               </div>
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Global Payout Verified</p>
            </div>
            
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-6 lg:gap-8">
                {testimonials.map((t, i) => (
                  <div key={i} className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 shadow-sm first:lg:mt-12 group hover:bg-white hover:shadow-2xl transition-all duration-500">
                    <div className="flex mb-6">
                      {[1,2,3,4,5].map(j => <Star key={j} className="w-4 h-4 text-amber-500 fill-current" />)}
                    </div>
                    <p className="text-slate-700 font-medium leading-relaxed mb-8 italic">"{t.text}"</p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-lg mr-4">
                        {t.avatar}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-sm tracking-tight">{t.name}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 lg:px-12">
           <div className="bg-gradient-primary rounded-[3rem] p-12 lg:p-32 text-center text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
             <div className="relative z-10">
                <Gift className="w-20 h-20 mx-auto mb-10 animate-float" />
                <h2 className="text-4xl lg:text-7xl font-black mb-8 tracking-tighter">Ready to Build Your Passive Income?</h2>
                <p className="text-lg lg:text-2xl text-indigo-100 mb-14 max-w-3xl mx-auto font-medium">Create your Earnix account in seconds and unlock your first set of tasks immediately.</p>
                <Link href="/signup" className="inline-flex px-12 py-5 bg-white text-indigo-600 text-sm font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:scale-105 transition-transform">
                  Get Started Now <ArrowRight className="w-5 h-5 ml-4" />
                </Link>
             </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-4 gap-16 lg:gap-24">
            <div className="col-span-2">
               <Link href="/" className="flex items-center space-x-3 mb-8">
                 <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                   <Zap className="w-6 h-6 text-white" />
                 </div>
                 <span className="text-2xl font-black text-slate-900 tracking-tight">Earnix</span>
               </Link>
               <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-sm">
                 The most trusted digital earning ecosystem in Pakistan. Helping thousands build a better financial future.
               </p>
            </div>
            
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Ecosystem</h4>
              <ul className="space-y-4">
                {['Home', 'Features', 'Pricing', 'Legal'].map(item => (
                  <li key={item}><Link href="#" className="text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Connect</h4>
              <ul className="space-y-4">
                <li className="text-sm font-bold text-slate-700">support@earnix.pk</li>
                <li className="text-sm font-bold text-slate-700">Lahore, Pakistan</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-24 pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">&copy; 2024 Earnix Global Ltd.</p>
            <div className="flex space-x-8">
               {['Privacy', 'Terms', 'Security'].map(item => (
                 <Link key={item} href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-indigo-600 transition-colors">{item}</Link>
               ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
