import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  Truck, ArrowRight, Recycle,
  Zap, CheckCircle, Home, Building, Building2,
} from 'lucide-react';
import TopNav from '../../components/TopNav';

const STEPS = [
  { icon: <Recycle size={22} />, title: 'Schedule a Pickup', desc: 'Choose your waste type, weight, and preferred date. Takes under 60 seconds.' },
  { icon: <Truck size={22} />,   title: 'Driver Collects',   desc: 'A verified driver arrives at your address, weighs the waste, and loads it.' },
  { icon: <Zap size={22} />,     title: 'Energy & Earnings', desc: 'Waste is converted to energy. You earn ₹ credits and CO₂ offset points.' },
];

const PLANS = [
  {
    icon: <Home size={20} />,
    name: 'Basic', sub: 'House / Villa', price: '₹199', period: '/month',
    features: ['2 pickups/month', 'Up to 50 kg/pickup', 'Energy credit report', 'Email support'],
    cta: 'Get Started', highlight: false,
  },
  {
    icon: <Building size={20} />,
    name: 'Premium', sub: 'Flat / Apartment', price: '₹499', period: '/month',
    features: ['6 pickups/month', 'Up to 150 kg/pickup', 'Live tracking', 'Priority support', 'Reward cashback'],
    cta: 'Most Popular', highlight: true,
  },
  {
    icon: <Building2 size={20} />,
    name: 'Enterprise', sub: 'Society / Complex', price: '₹1,499', period: '/month',
    features: ['Unlimited pickups', 'Bulk weight support', 'Admin dashboard', 'Dedicated manager', 'Custom reporting'],
    cta: 'Contact Sales', highlight: false,
  },
];

const LandingPage: React.FC = () => {
  const { setView } = useAppStore();

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <TopNav
        right={
          <div className="hidden md:flex items-center gap-6 text-sm font-medium mr-2" style={{ color: 'var(--text-muted)' }}>
            <a href="#how"
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>How it works</a>
            <a href="#pricing"
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>Pricing</a>
          </div>
        }
      />

      {/* Hero */}
      <section className="px-6 md:px-12 pt-24 pb-28 max-w-5xl mx-auto text-center fade-up">
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-8"
          style={{ background: 'var(--green-dim)', border: '1px solid var(--border-green)', color: 'var(--green)' }}
        >
          <span className="live-dot"></span>
          Live in Bangalore · Mumbai · Pune
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
          Turn Waste into<br />
          <span style={{ color: 'var(--green)' }}>Energy & Earnings</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Schedule a waste pickup, watch it convert to clean energy, and earn real money — all from your phone.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="btn-green text-base py-3.5 px-8" onClick={() => setView('user')}>
            Schedule Pickup <ArrowRight size={18} />
          </button>
          <button className="btn-outline text-base py-3.5 px-8"
            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
            View Plans
          </button>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-4 max-w-xl mx-auto">
          {[
            { val: '1,240+', label: 'kWh Generated' },
            { val: '3,100+', label: 'kg CO₂ Offset' },
            { val: '₹84K+',  label: 'Paid to Users'  },
          ].map(s => (
            <div key={s.label} className="card text-center !py-4">
              <p className="text-2xl font-black" style={{ color: 'var(--green)' }}>{s.val}</p>
              <p className="label mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="px-6 md:px-12 py-20 max-w-5xl mx-auto" style={{ borderTop: '1px solid var(--border)' }}>
        <p className="label text-center mb-3">Process</p>
        <h2 className="text-3xl md:text-4xl font-black text-center tracking-tight mb-14">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <div key={i} className="card relative">
              <div className="flex items-start gap-4">
                <div className="icon-box-green">{step.icon}</div>
                <div>
                  <span className="label mb-1 block">Step {i + 1}</span>
                  <h3 className="font-bold text-base mb-2">{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10" style={{ color: 'var(--text-subtle)' }}>
                  <ArrowRight size={18} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 md:px-12 py-20 max-w-5xl mx-auto" style={{ borderTop: '1px solid var(--border)' }}>
        <p className="label text-center mb-3">Pricing</p>
        <h2 className="text-3xl md:text-4xl font-black text-center tracking-tight mb-14">Simple, transparent plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className="rounded-2xl p-6 flex flex-col gap-5"
              style={{
                background: 'var(--bg-card)',
                border: plan.highlight ? '1px solid var(--green)' : '1px solid var(--border)',
                boxShadow: plan.highlight ? '0 0 0 1px var(--green-dim)' : 'none',
              }}
            >
              {plan.highlight && <div className="badge-green w-fit">Most Popular</div>}
              <div className="flex items-center gap-3">
                <div className={plan.highlight ? 'icon-box-green' : 'icon-box-muted'}>{plan.icon}</div>
                <div>
                  <p className="font-black text-base">{plan.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{plan.sub}</p>
                </div>
              </div>
              <div>
                <span className="text-4xl font-black">{plan.price}</span>
                <span className="text-sm ml-1" style={{ color: 'var(--text-muted)' }}>{plan.period}</span>
              </div>
              <hr className="divider" />
              <ul className="space-y-2.5">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--text-muted)' }}>
                    <CheckCircle size={15} style={{ color: 'var(--green)', flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={plan.highlight ? 'btn-green w-full justify-center mt-auto' : 'btn-outline w-full justify-center mt-auto'}
                onClick={() => setView('user')}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        className="px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm"
        style={{ borderTop: '1px solid var(--border)', color: 'var(--text-subtle)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'var(--green)' }}>
            <Leaf size={12} style={{ color: '#fff' }} />
          </div>
          <span className="font-bold" style={{ color: 'var(--text-muted)' }}>DISPOSE</span>
        </div>
        <p>© 2026 Dispose Technologies. All rights reserved.</p>
        <div className="flex gap-6">
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <a key={l} href="#" style={{ color: 'var(--text-subtle)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-subtle)')}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
