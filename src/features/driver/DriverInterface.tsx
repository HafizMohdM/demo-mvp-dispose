import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  MapPin, Navigation, CheckCircle, Clock, Package,
  Leaf, Zap, Truck, ChevronRight, Star
} from 'lucide-react';
import TopNav from '../../components/TopNav';

const WASTE_ICONS: Record<string, React.ReactNode> = {
  Organic: <Leaf size={16} />,
  Plastic: <Zap size={16} />,
  Metal:   <Package size={16} />,
};

const DriverInterface: React.FC = () => {
  const { trips, updateTripStatus, setDriverLocation, driverLocation, addNotification, setView } = useAppStore();
  const [currentTripId, setCurrentTripId] = useState<string | null>(null);
  const [isDriving, setIsDriving]         = useState(false);

  const queue          = trips.filter(t => t.status !== 'completed');
  const completedToday = trips.filter(t => t.status === 'completed').length;
  const totalEarnings  = completedToday * 450;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isDriving && currentTripId) {
      const trip = trips.find(t => t.id === currentTripId);
      if (trip) {
        interval = setInterval(() => {
          setDriverLocation([
            driverLocation[0] + (trip.pickupLocation[0] - driverLocation[0]) * 0.1,
            driverLocation[1] + (trip.pickupLocation[1] - driverLocation[1]) * 0.1,
          ]);
          const dist = Math.sqrt(
            Math.pow(trip.pickupLocation[0] - driverLocation[0], 2) +
            Math.pow(trip.pickupLocation[1] - driverLocation[1], 2)
          );
          if (dist < 0.001) {
            setIsDriving(false);
            updateTripStatus(currentTripId, 'arriving');
            addNotification('Driver arriving at pickup location.');
            clearInterval(interval);
          }
        }, 1000);
      }
    }
    return () => clearInterval(interval);
  }, [isDriving, currentTripId, driverLocation]);

  const startTrip = (id: string) => {
    setCurrentTripId(id); setIsDriving(true);
    updateTripStatus(id, 'in-progress');
    addNotification('Driver started trip.');
  };
  const completeTrip = (id: string) => {
    updateTripStatus(id, 'completed');
    setCurrentTripId(null); setIsDriving(false);
    addNotification('Trip completed. Waste collected.');
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <TopNav
        pageLabel="Driver"
        right={
          <div className="flex items-center gap-2">
            <span className="badge-green flex items-center gap-1.5">
              <span className="live-dot" style={{ width: 6, height: 6 }}></span>On Duty
            </span>
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm"
              style={{ background: 'var(--yellow-dim)', color: 'var(--yellow)' }}>R</div>
          </div>
        }
      />

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Profile strip */}
        <div className="card flex items-center gap-4 fade-up">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg"
            style={{ background: 'var(--yellow-dim)', color: 'var(--yellow)' }}>R</div>
          <div className="flex-1">
            <p className="font-black text-base">Rahul Sharma</p>
            <div className="flex items-center gap-1 mt-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} style={{ color: 'var(--yellow)', fill: 'var(--yellow)' }} />
              ))}
              <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>4.9 · Platinum Driver</span>
            </div>
          </div>
          <div className="text-right">
            <p className="font-black" style={{ color: 'var(--yellow)' }}>₹{totalEarnings}</p>
            <p className="label">Today</p>
          </div>
        </div>

        {/* Session stats */}
        <div className="grid grid-cols-3 gap-3 fade-up-2">
          <div className="card text-center !py-4">
            <p className="text-xl font-black">{completedToday}</p>
            <p className="label mt-1">Completed</p>
          </div>
          <div className="card text-center !py-4">
            <p className="text-xl font-black">{queue.length}</p>
            <p className="label mt-1">In Queue</p>
          </div>
          <div className="card text-center !py-4">
            <p className="text-xl font-black" style={{ color: 'var(--yellow)' }}>₹50</p>
            <p className="label mt-1">Energy Bonus</p>
          </div>
        </div>

        {/* Task queue */}
        <div className="fade-up-3">
          <div className="flex justify-between items-center mb-3">
            <p className="label">Active Queue</p>
            <span className="badge-muted">{queue.length} tasks</span>
          </div>

          {queue.length === 0 ? (
            <div className="card text-center py-16">
              <div className="icon-box-green mx-auto mb-3"><CheckCircle size={20} /></div>
              <p className="font-bold text-sm mb-1">All tasks complete</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Great work today, Rahul.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {queue.map(trip => {
                const isActive = currentTripId === trip.id;
                return (
                  <div key={trip.id} className="rounded-2xl p-5 space-y-4 transition-all"
                    style={{
                      background: 'var(--bg-card)',
                      border: isActive ? '1px solid var(--green)' : '1px solid var(--border)',
                    }}
                  >
                    {/* Task header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={isActive ? 'icon-box-green' : 'icon-box-muted'}>
                          {WASTE_ICONS[trip.wasteType] || <Package size={16} />}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{trip.userName}</p>
                          <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            <MapPin size={11} /> {trip.address}
                          </p>
                        </div>
                      </div>
                      <span className={isActive ? 'badge-green' : 'badge-muted'}>
                        {isActive ? trip.status : 'pending'}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Waste Type', val: trip.wasteType, color: 'var(--text)' },
                        { label: 'Weight',     val: `${trip.weight_kg} kg`, color: 'var(--text)' },
                        { label: 'Reward',     val: `₹${trip.weight_kg * 8}`, color: 'var(--yellow)' },
                      ].map(item => (
                        <div key={item.label} className="rounded-xl p-3" style={{ background: 'var(--bg-card-2)' }}>
                          <p className="label mb-1">{item.label}</p>
                          <p className="font-bold text-sm" style={{ color: item.color }}>{item.val}</p>
                        </div>
                      ))}
                    </div>

                    {/* Progress when active */}
                    {isActive && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                            <Clock size={12} /> En route
                          </span>
                          <span className="font-bold" style={{ color: 'var(--green)' }}>ETA ~8 min</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                          <div className="h-full rounded-full w-[65%]" style={{ background: 'var(--green)' }}></div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                      {isActive ? (
                        <>
                          <button className="btn-outline flex-1 justify-center py-2.5 text-sm"
                            onClick={() => window.open(`https://maps.google.com/?q=${trip.pickupLocation[0]},${trip.pickupLocation[1]}`, '_blank')}>
                            <Navigation size={15} /> Navigate
                          </button>
                          <button className="btn-green flex-1 justify-center py-2.5 text-sm"
                            onClick={() => completeTrip(trip.id)}>
                            <CheckCircle size={15} /> Complete
                          </button>
                        </>
                      ) : (
                        <button className="btn-green w-full justify-center py-2.5 text-sm"
                          disabled={!!currentTripId} onClick={() => startTrip(trip.id)}>
                          <Truck size={15} /> Start Trip <ChevronRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverInterface;
