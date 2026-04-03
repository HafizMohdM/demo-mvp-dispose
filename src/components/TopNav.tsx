import React from 'react';
import { useAppStore } from '../store/useAppStore';
import type { AppView } from '../store/useAppStore';
import { Leaf, Home, User, Truck, Shield, Sun, Moon } from 'lucide-react';

interface TopNavProps {
  /** Extra content to render on the right side (e.g. avatar, export button) */
  right?: React.ReactNode;
  /** Current page label shown after the breadcrumb slash */
  pageLabel?: string;
}

const NAV_ITEMS: { v: AppView; icon: React.ReactNode; label: string }[] = [
  { v: 'landing', icon: <Home size={13} />,   label: 'Home'   },
  { v: 'user',    icon: <User size={13} />,   label: 'User'   },
  { v: 'driver',  icon: <Truck size={13} />,  label: 'Driver' },
  { v: 'admin',   icon: <Shield size={13} />, label: 'Admin'  },
];

const TopNav: React.FC<TopNavProps> = ({ right, pageLabel }) => {
  const { view, theme, setView, toggleTheme } = useAppStore();

  return (
    <header
      className="px-6 md:px-10 py-3 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md"
      style={{ borderBottom: '1px solid var(--border)', background: 'color-mix(in srgb, var(--bg) 92%, transparent)' }}
    >
      {/* Left: logo + breadcrumb */}
      <div className="flex items-center gap-3">
        <button onClick={() => setView('landing')} className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--green)' }}>
            <Leaf size={14} style={{ color: '#fff' }} />
          </div>
          <span className="font-black tracking-tight text-sm">DISPOSE</span>
        </button>
        {pageLabel && (
          <>
            <span className="text-sm" style={{ color: 'var(--text-subtle)' }}>/</span>
            <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{pageLabel}</span>
          </>
        )}
      </div>

      {/* Right: role pill + theme + optional slot */}
      <div className="flex items-center gap-3">
        {/* Role + theme pill */}
        <div
          className="flex items-center gap-0.5 rounded-2xl p-1"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          {NAV_ITEMS.map(({ v, icon, label }) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
              style={
                view === v
                  ? { background: 'var(--green)', color: '#fff' }
                  : { color: 'var(--text-muted)' }
              }
              onMouseEnter={e => { if (view !== v) (e.currentTarget as HTMLButtonElement).style.color = 'var(--text)'; }}
              onMouseLeave={e => { if (view !== v) (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; }}
            >
              {icon} <span className="hidden sm:inline">{label}</span>
            </button>
          ))}

          {/* divider */}
          <div style={{ width: 1, height: 18, background: 'var(--border)', margin: '0 3px' }} />

          {/* theme toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--yellow)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; }}
          >
            {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
            <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
        </div>

        {/* Optional right slot (avatar, export btn, etc.) */}
        {right}
      </div>
    </header>
  );
};

export default TopNav;
