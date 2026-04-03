import { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import LandingPage from './features/landing/LandingPage';
import AdminDashboard from './features/admin/AdminDashboard';
import UserPortal from './features/user/UserPortal';
import DriverInterface from './features/driver/DriverInterface';

function App() {
  const { view, theme } = useAppStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
      {view === 'landing' && <LandingPage />}
      {view === 'user'    && <UserPortal />}
      {view === 'driver'  && <DriverInterface />}
      {view === 'admin'   && <AdminDashboard />}
    </>
  );
}

export default App;
