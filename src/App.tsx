import { useAppStore } from './store/useAppStore';
import AdminDashboard from './features/admin/AdminDashboard';
import UserPortal from './features/user/UserPortal';
import DriverInterface from './features/driver/DriverInterface';
import RoleSwitcher from './components/RoleSwitcher';
import { Bell, Leaf, Settings, HelpCircle } from 'lucide-react';

function App() {
  const { userRole, notifications } = useAppStore();

  return (
    <div className="min-h-screen bg-[#060a09] text-white selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Nav */}
      <nav className="glass-card !rounded-none !border-t-0 !border-x-0 sticky top-0 z-[1000] flex justify-between items-center px-10 py-5 backdrop-blur-3xl bg-black/40 border-b border-white/5">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-2.5 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-transform group-hover:rotate-12">
             <Leaf className="text-white" size={24} />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tighter text-white">DISPOSE</span>
            <div className="h-[2px] w-0 group-hover:w-full bg-emerald-500 transition-all duration-300"></div>
          </div>
        </div>

        <div className="flex items-center gap-8">
           <div className="hidden md:flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              <span className="hover:text-emerald-500 cursor-pointer transition-colors">Network</span>
              <span className="hover:text-emerald-500 cursor-pointer transition-colors">Security</span>
              <span className="hover:text-emerald-500 cursor-pointer transition-colors">Impact</span>
           </div>

           <div className="h-6 w-[1px] bg-white/10 mx-2 hidden md:block"></div>

           <div className="flex items-center gap-5">
              <HelpCircle className="text-white/30 hover:text-white cursor-pointer transition-all" size={20} />
              <Settings className="text-white/30 hover:text-white cursor-pointer transition-all" size={20} />
              
              <div className="relative group cursor-pointer">
                <div className="relative">
                  <Bell className="text-emerald-500 group-hover:scale-110 transition-transform" size={22} />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-600 border-2 border-[#060a09] w-4.5 h-4.5 rounded-full text-[9px] flex items-center justify-center font-black">
                      {notifications.length}
                    </span>
                  )}
                </div>
                
                {/* Premium Notification Dropdown */}
                <div className="absolute right-0 mt-6 w-80 glass-card !p-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-[0_20px_80px_rgba(0,0,0,0.8)] border-white/10">
                   <div className="p-5 border-b border-white/5 flex justify-between items-center">
                     <h4 className="font-black text-xs uppercase tracking-widest text-emerald-500">Logistics Alerts</h4>
                     <span className="text-[10px] font-bold text-white/30">LATEST</span>
                   </div>
                   <div className="p-4 space-y-3 max-h-[350px] overflow-y-auto">
                      {notifications.length > 0 ? notifications.map((n, i) => (
                        <div key={i} className="text-[11px] font-bold text-emerald-100/80 bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-emerald-500/20 transition-all flex gap-3 items-start">
                           <div className="mt-1 w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0 animate-pulse"></div>
                           <span>{n}</span>
                        </div>
                      )) : (
                        <p className="text-[10px] text-center text-white/20 py-10 uppercase tracking-widest font-black">No active alerts</p>
                      )}
                   </div>
                   <div className="p-4 bg-white/5 text-center cursor-pointer hover:bg-white/10 transition-colors">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">View All Systems</span>
                   </div>
                </div>
              </div>
           </div>
           
           <div className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-xs text-emerald-500 hover:border-emerald-500/30 cursor-pointer transition-all">
              {userRole[0].toUpperCase()}
           </div>
        </div>
      </nav>

      <main className="relative z-10">
        {userRole === 'admin' && <AdminDashboard />}
        {userRole === 'user' && <UserPortal />}
        {userRole === 'driver' && <DriverInterface />}
      </main>

      <div className="fixed bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#060a09] to-transparent pointer-events-none z-[999]"></div>
      <RoleSwitcher />
    </div>
  );
}

export default App;
