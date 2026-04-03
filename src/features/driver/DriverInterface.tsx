import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { MapPin, Navigation, CheckCircle, Bell, User, Clock, Zap } from 'lucide-react';

const DriverInterface: React.FC = () => {
  const { trips, updateTripStatus, setDriverLocation, driverLocation, addNotification } = useAppStore();
  const [isDriving, setIsDriving] = useState(false);
  const [currentTripId, setCurrentTripId] = useState<string | null>(null);

  const pendingTrips = trips.filter(t => t.status !== 'completed');

  // Simulation logic
  useEffect(() => {
    let interval: any;
    if (isDriving && currentTripId) {
      const trip = trips.find(t => t.id === currentTripId);
      if (trip) {
        interval = setInterval(() => {
          setDriverLocation([
            driverLocation[0] + (trip.pickupLocation[0] - driverLocation[0]) * 0.1,
            driverLocation[1] + (trip.pickupLocation[1] - driverLocation[1]) * 0.1,
          ]);

          // Check proximity
          const distance = Math.sqrt(
            Math.pow(trip.pickupLocation[0] - driverLocation[0], 2) +
            Math.pow(trip.pickupLocation[1] - driverLocation[1], 2)
          );

          if (distance < 0.001) {
            setIsDriving(false);
            updateTripStatus(currentTripId, 'arriving');
            addNotification('Driver is arriving at your location! (5 min away)');
            clearInterval(interval);
          }
        }, 1000);
      }
    }
    return () => clearInterval(interval);
  }, [isDriving, currentTripId, driverLocation]);

  const startTrip = (id: string) => {
    setCurrentTripId(id);
    setIsDriving(true);
    updateTripStatus(id, 'in-progress');
    addNotification('Driver has started the trip to your location.');
  };

  const completeTrip = (id: string) => {
    updateTripStatus(id, 'completed');
    setCurrentTripId(null);
    addNotification('Trip completed! Waste collected and energy credits awarded.');
  };

  return (
    <div className="p-4 px-6 max-w-lg mx-auto space-y-10 animate-fade-in pb-40">
      <header className="flex justify-between items-center py-6 stagger-1">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-emerald-500/20 p-1 bg-emerald-500/5 transition-transform hover:scale-105">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul" alt="Driver" className="rounded-xl" />
          </div>
          <div>
            <h2 className="font-black text-2xl text-white tracking-tight">Rahul Sharma</h2>
            <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full status-pulse"></span>
              Platinum Series
            </p>
          </div>
        </div>
        <div className="glass-card !p-3 !rounded-2xl border-white/5 hover:border-emerald-500/20 active:scale-95 transition-all">
          <Bell size={24} className="text-emerald-500" />
        </div>
      </header>

      {/* Action Card */}
      <div className="glass-card bg-emerald-600/5 border-emerald-500/20 p-6 !rounded-[32px] stagger-2">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-black text-xl text-white tracking-tight">Active Queue</h3>
          <span className="text-[10px] bg-emerald-500/20 px-3 py-1.5 rounded-full text-emerald-500 font-black tracking-widest uppercase">{pendingTrips.length} TASKS REMAINING</span>
        </div>
        
        <div className="space-y-6">
          {pendingTrips.length > 0 ? pendingTrips.map(trip => (
            <div key={trip.id} className={`glass-card !bg-black/20 border-white/5 !p-6 space-y-6 !rounded-3xl transition-all ${currentTripId === trip.id ? 'border-emerald-500 ring-2 ring-emerald-500/10' : ''}`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                   <div className={`p-4 rounded-2xl transition-all ${currentTripId === trip.id ? 'bg-emerald-500 text-white' : 'bg-emerald-500/5 text-emerald-500'}`}>
                     <MapPin size={24} />
                   </div>
                   <div>
                      <p className="font-black text-lg text-white tracking-tight">{trip.userName}</p>
                      <p className="text-xs font-bold text-emerald-500/60 uppercase tracking-widest">{trip.wasteType} • {trip.weight_kg}KG COLLECT</p>
                   </div>
                </div>
                {currentTripId !== trip.id && (
                  <span className="text-[10px] font-black uppercase px-3 py-1 bg-white/5 rounded-lg opacity-40">PENDING</span>
                )}
              </div>

              {currentTripId === trip.id ? (
                <div className="space-y-6 pt-2">
                   <div className="flex items-center gap-3">
                      <Clock size={16} className="text-amber-500" />
                      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[65%] shadow-[0_0_15px_#10b981] animate-pulse"></div>
                      </div>
                      <span className="text-[10px] font-black italic whitespace-nowrap">ETA 8M</span>
                   </div>
                   <button 
                     onClick={() => completeTrip(trip.id)}
                     className="w-full btn-primary bg-emerald-600 justify-center py-5 !rounded-2xl text-lg group"
                   >
                     COMPLETED PICKUP <CheckCircle size={22} className="group-hover:scale-110 transition-transform" />
                   </button>
                </div>
              ) : (
                <button 
                  onClick={() => startTrip(trip.id)}
                  disabled={!!currentTripId}
                  className="w-full btn-primary justify-center py-5 !rounded-2xl text-lg disabled:opacity-30 disabled:grayscale group"
                >
                  START ENGINE <Navigation size={22} className="group-hover:translate-x-2 transition-transform" />
                </button>
              )}
            </div>
          )) : (
            <div className="text-center py-20 space-y-4">
              <div className="w-16 h-16 bg-emerald-500/5 rounded-full flex items-center justify-center mx-auto border border-white/5">
                 <CheckCircle size={32} className="text-emerald-500/20" />
              </div>
              <p className="text-sm font-black uppercase text-emerald-500/30 tracking-widest">Shift Completed • Rest well</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 stagger-3">
        <div className="glass-card !p-6 border-amber-500/20 flex flex-col gap-2">
           <div className="flex items-center gap-2 text-amber-500">
              <User size={18} />
              <h4 className="text-[10px] font-black uppercase tracking-widest">Session Rewards</h4>
           </div>
           <p className="text-2xl font-black text-white tracking-tighter">₹ 450.00</p>
        </div>
        <div className="glass-card !p-6 border-emerald-500/20 flex flex-col gap-2">
           <div className="flex items-center gap-2 text-emerald-500">
              <Zap size={18} />
              <h4 className="text-[10px] font-black uppercase tracking-widest">Energy Bonus</h4>
           </div>
           <p className="text-2xl font-black text-white tracking-tighter">₹ 50.00</p>
        </div>
      </div>
    </div>
  );
};

export default DriverInterface;
