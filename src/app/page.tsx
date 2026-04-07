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
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100">
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-gradient">Earnix</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#how-it-works" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                How It Works
              </Link>
              <Link href="#plans" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                Plans
              </Link>
              <Link href="#features" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                Features
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                Login
              </Link>
              <Link href="/signup" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50" />
        <div className="absolute top-32 right-10 w-96 h-96 bg-primary-200 rounded-full blur-3xl opacity-30 animate-float" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-secondary-200 rounded-full blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="container-custom relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-5 py-2 bg-primary-100 rounded-full text-primary-700 font-semibold text-sm mb-8">
              <Star className="w-4 h-4 mr-2" />
              Trusted by 10,000+ Users Across Pakistan
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Earn Money by{' '}
              <span className="text-gradient">Completing Tasks</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Join Earnix today and start earning money through simple tasks. 
              Choose your plan, complete tasks daily, refer friends, and withdraw your earnings.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="btn-primary text-lg px-10 py-4 shadow-xl shadow-primary-500/25">
                Start Earning Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="#how-it-works" className="btn-outline text-lg px-10 py-4">
                <Play className="w-5 h-5 mr-2" />
                Learn More
              </Link>
            </div>
            
            <div className="mt-16 flex items-center justify-center space-x-10 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                No Hidden Fees
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                Instant Payouts
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                24/7 Support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start earning in four simple steps. No complicated processes, just straightforward earning opportunities.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="card-hover p-8 text-center relative">
                  <div className="absolute -top-5 -right-5 w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {step.number}
                  </div>
                  <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <step.icon className="w-10 h-10 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose Earnix?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide the best earning experience with features designed for your success.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card-hover p-8 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section id="plans" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select the plan that fits your earning goals. Start free or upgrade for maximum earnings.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {DEFAULT_PLANS.map((plan, index) => (
              <div
                key={plan.id}
                className={cn(
                  'card-hover p-8 relative',
                  plan.is_popular && 'ring-4 ring-primary-500'
                )}
              >
                {plan.is_popular && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-primary text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.display_name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price === 0 ? 'Free' : formatCurrency(plan.price)}
                    </span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">{plan.daily_task_limit} tasks per day</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">{plan.min_points_per_task}-{plan.max_points_per_task} points per task</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">Referral reward: {plan.referral_reward} points</span>
                  </li>
                  {plan.bonus_points > 0 && (
                    <li className="flex items-center">
                      <Gift className="w-5 h-5 text-secondary-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">
                        {plan.bonus_points_max 
                          ? `Welcome bonus: ${plan.bonus_points}-${plan.bonus_points_max} points`
                          : `Welcome bonus: ${plan.bonus_points} points`
                        }
                      </span>
                    </li>
                  )}
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">Min withdrawal: {formatCurrency(plan.withdrawal_threshold)}</span>
                  </li>
                </ul>
                
                <Link
                  href={`/signup?plan=${plan.id}`}
                  className={cn(
                    'w-full btn block text-center',
                    plan.is_popular ? 'btn-primary' : 'btn-outline'
                  )}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-gradient-to-br from-primary-600 to-secondary-600">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">What Our Users Say</h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Join thousands of satisfied users who are earning with Earnix every day.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-white/90 text-lg mb-6 leading-relaxed">{testimonial.text}</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-300 rounded-full flex items-center justify-center text-primary-900 font-bold text-lg mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-primary-200">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gray-900">
        <div className="container-custom text-center">
          <Gift className="w-20 h-20 text-primary-400 mx-auto mb-8" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Start Earning?</h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join Earnix today and get started on your earning journey. 
            Sign up now and get bonus points with our welcome offer!
          </p>
          <Link href="/signup" className="btn bg-white text-gray-900 hover:bg-gray-100 text-lg px-12 py-5">
            Create Your Account
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="container-custom py-16">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">Earnix</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Your trusted platform for earning money through simple tasks.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="#plans" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/refund" className="text-gray-400 hover:text-white transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-3 text-gray-400">
                <li>support@earnix.pk</li>
                <li>+92 300 1234567</li>
                <li>Available 24/7</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} Earnix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
