import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { User, Truck, Shield, Home, Sun, Moon } from 'lucide-react';

const RoleSwitcher: React.FC = () => {
  const { view, theme, setView, toggleTheme } = useAppStore();

  const items = [
    { v: 'landing' as const, icon: <Home size={14} />,   label: 'Home'   },
    { v: 'user'    as const, icon: <User size={14} />,   label: 'User'   },
    { v: 'driver'  as const, icon: <Truck size={14} />,  label: 'Driver' },
    { v: 'admin'   as const, icon: <Shield size={14} />, label: 'Admin'  },
  ];

  return (
    <div
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 rounded-2xl p-1.5 shadow-2xl"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
      }}
    >
      {/* Role nav */}
      {items.map(({ v, icon, label }) => (
        <button
          key={v}
          onClick={() => setView(v)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all"
          style={
            view === v
              ? { background: 'var(--green)', color: '#fff' }
              : { color: 'var(--text-muted)' }
          }
          onMouseEnter={e => { if (view !== v) (e.currentTarget as HTMLButtonElement).style.color = 'var(--text)'; }}
          onMouseLeave={e => { if (view !== v) (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; }}
        >
          {icon} {label}
        </button>
      ))}

      {/* Divider */}
      <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 4px' }} />

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all"
        style={{ color: 'var(--text-muted)' }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--yellow)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; }}
      >
        {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        {theme === 'dark' ? 'Light' : 'Dark'}
      </button>
    </div>
  );
};

export default RoleSwitcher;
