import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Shield, User, Truck } from 'lucide-react';

const RoleSwitcher: React.FC = () => {
  const { userRole, setRole } = useAppStore();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 glass-card flex gap-4 p-2 z-[1000] border-emerald-500/50">
      <button 
        onClick={() => setRole('user')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${userRole === 'user' ? 'bg-emerald-600 text-white' : 'hover:bg-emerald-900/30'}`}
      >
        <User size={18} /> User
      </button>
      <button 
        onClick={() => setRole('driver')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${userRole === 'driver' ? 'bg-emerald-600 text-white' : 'hover:bg-emerald-900/30'}`}
      >
        <Truck size={18} /> Driver
      </button>
      <button 
        onClick={() => setRole('admin')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${userRole === 'admin' ? 'bg-emerald-600 text-white' : 'hover:bg-emerald-900/30'}`}
      >
        <Shield size={18} /> Admin
      </button>
    </div>
  );
};

export default RoleSwitcher;
