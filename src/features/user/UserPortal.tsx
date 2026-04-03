import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Calendar, MapPin, Zap, Leaf, Truck, CheckCircle, ChevronRight, BarChart3 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { calculateEnergy, calculateCO2Offset } from '../../utils/energy';
import { z } from 'zod';

const pickupSchema = z.object({
  wasteType: z.enum(['Organic', 'Plastic', 'Metal']),
  weight: z.number().min(1, 'Weight must be at least 1kg').max(500, 'Max 500kg per pickup'),
  date: z.string().min(1, 'Pickup date is required'),
});

const UserPortal: React.FC = () => {
  const { addTrip, trips, driverLocation } = useAppStore();
  const [wasteType, setWasteType] = useState<'Organic' | 'Plastic' | 'Metal'>('Plastic');
  const [weight, setWeight] = useState(10);
  const [pickupDate, setPickupDate] = useState('');
  const [success, setSuccess] = useState(false);

  const activeTrip = trips.find(t => t.status !== 'completed');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      pickupSchema.parse({ wasteType, weight, date: pickupDate });
      addTrip({
        userId: 'u1',
        userName: 'Current User',
        pickupLocation: [12.9716, 77.5946],
        wasteType,
        weight_kg: weight,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert('Validation Error. Check weight (1-500kg) and date.');
    }
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 animate-fade-in pb-32">
      {/* Left Column: Hero & Stats */}
      <div className="lg:col-span-8 space-y-8">
        <header className="relative h-[240px] rounded-[32px] overflow-hidden group stagger-1">
          <img 
            src="/hero.png" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            alt="Sustainability City"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
            <h1 className="text-4xl font-black text-white tracking-tight">Elevate Your Impact. <br/><span className="text-emerald-400">Power Your City.</span></h1>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-2">
          <div className="glass-card flex flex-col gap-3 group">
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 w-fit group-hover:scale-110 transition-transform">
              <Zap size={24} />
            </div>
            <div>
              <p className="text-emerald-500/50 text-xs font-bold uppercase tracking-widest mb-1">Energy Credit</p>
              <p className="text-3xl font-black">{calculateEnergy(weight, wasteType).toFixed(1)} <span className="text-sm font-normal opacity-50">kWh</span></p>
            </div>
          </div>
          
          <div className="glass-card flex flex-col gap-3 group">
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 w-fit group-hover:scale-110 transition-transform">
              <Leaf size={24} />
            </div>
            <div>
              <p className="text-emerald-500/50 text-xs font-bold uppercase tracking-widest mb-1">CO2 Diverted</p>
              <p className="text-3xl font-black text-white">{calculateCO2Offset(weight).toFixed(1)} <span className="text-sm font-normal opacity-50">kg</span></p>
            </div>
          </div>

          <div className="glass-card flex flex-col gap-3 group">
            <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500 w-fit group-hover:scale-110 transition-transform">
              <BarChart3 size={24} />
            </div>
            <div>
              <p className="text-amber-500/50 text-xs font-bold uppercase tracking-widest mb-1">Rank Status</p>
              <p className="text-3xl font-black text-white">#12 <span className="text-sm font-normal opacity-50">Region</span></p>
            </div>
          </div>
        </div>

        {activeTrip ? (
           <div className="glass-card !p-0 overflow-hidden relative border-emerald-500/40 stagger-3">
             <div className="p-6 bg-emerald-900/10 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="status-pulse border-2 border-emerald-500/20 shadow-lg"></div>
                  <div>
                    <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Active Fleet Tracking</p>
                    <p className="font-black text-white">Truck #04 is En Route</p>
                  </div>
                </div>
                <div className="px-4 py-2 bg-emerald-500 rounded-full text-xs font-black uppercase">ETA: 12 MIN</div>
             </div>
             
             <div className="h-[450px]">
                <MapContainer center={[12.9716, 77.5946]} zoom={15} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  />
                  <Marker position={[12.9716, 77.5946]} /> {/* User Location */}
                  <Marker position={driverLocation} />   {/* Driver Location */}
                  <Polyline 
                    positions={[driverLocation, [12.9716, 77.5946]]} 
                    pathOptions={{ color: "#10b981", dashArray: "12, 12", weight: 3, opacity: 0.8 }}
                  />
                </MapContainer>
             </div>
           </div>
        ) : (
          <div className="glass-card flex flex-col items-center justify-center py-20 space-y-6 text-center border-dashed border-2 border-emerald-500/20 stagger-3">
             <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                <MapPin size={40} className="text-emerald-500" />
             </div>
             <div>
                <h3 className="text-2xl font-black tracking-tight text-white">No active pickups detected</h3>
                <p className="text-emerald-500/50 max-w-sm mx-auto">Start your sustainability journey by scheduling a waste-to-energy collection.</p>
             </div>
          </div>
        )}
      </div>

      {/* Right Column: Scheduler */}
      <div className="lg:col-span-4 stagger-2">
        <div className="glass-card sticky top-8 border-emerald-500/40 !p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-emerald-500/10 rounded-2xl">
              <Truck className="text-emerald-500" size={28} />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight leading-none">Schedule<br/><span className="text-emerald-500">Pickup</span></h2>
          </div>
          
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <label className="block text-xs font-black text-emerald-500/50 uppercase tracking-widest">Waste Category</label>
              <div className="grid grid-cols-1 gap-3">
                {(['Organic', 'Plastic', 'Metal'] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setWasteType(type)}
                    className={`group px-6 py-4 rounded-2xl border-2 text-sm font-black transition-all flex items-center justify-between ${wasteType === type ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-white/5 text-white/40 hover:border-emerald-500/20 hover:text-white/60'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${wasteType === type ? 'bg-emerald-500 text-white' : 'bg-white/5'}`}>
                        {type === 'Organic' && <Leaf size={18} />}
                        {type === 'Plastic' && <Zap size={18} />}
                        {type === 'Metal' && <CheckCircle size={18} />}
                      </div>
                      <span className="uppercase tracking-tight">{type}</span>
                    </div>
                    {wasteType === type && <ChevronRight size={20} className="text-emerald-500" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-baseline mb-2">
                <label className="text-xs font-black text-emerald-500/50 uppercase tracking-widest">Est. Weight</label>
                <span className="text-2xl font-black text-white">{weight}kg</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="100" 
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value))}
              />
              <p className="text-xs font-bold text-center text-emerald-500/40 uppercase tracking-widest">Potential ~{(weight * 0.5).toFixed(1)} kWh Generator</p>
            </div>

            <div className="grid grid-cols-1 gap-6 pt-4 border-t border-white/5">
               <div className="space-y-2">
                  <label className="block text-xs font-black text-emerald-500/50 uppercase tracking-widest">Service Date</label>
                  <div className="relative">
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500/50 pointer-events-none" size={18} />
                    <input 
                      type="date" 
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                    />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="block text-xs font-black text-emerald-500/50 uppercase tracking-widest">Preferred Slot</label>
                  <div className="relative">
                    <select>
                      <option>मॉर्निंग (09:00 - 12:00)</option>
                      <option>इव्हनिंग (15:00 - 18:00)</option>
                    </select>
                  </div>
               </div>
            </div>

            <button 
              type="submit" 
              disabled={success}
              className={`w-full btn-primary py-5 !rounded-2xl text-xl font-black uppercase tracking-widest group ${success ? 'bg-emerald-600' : ''}`}
            >
              {success ? (
                <>SUCCESS! <CheckCircle className="animate-bounce" /></>
              ) : (
                <>REQUEST PICKUP <Truck size={24} className="group-hover:translate-x-2 transition-transform" /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserPortal;
