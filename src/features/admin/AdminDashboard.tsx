import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Zap, Leaf, Globe, Truck, ArrowUpRight, Filter, Download, BarChart3 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const AdminDashboard: React.FC = () => {
  const { totalKWh, totalCO2Offset, trips, driverLocation } = useAppStore();

  return (
    <div className="p-8 max-w-[1500px] mx-auto space-y-10 animate-fade-in pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 stagger-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-500 font-black text-xs uppercase tracking-[0.2em] mb-1">
            <span className="w-8 h-[2px] bg-emerald-500"></span>
            System Intelligence
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter leading-none">Waste-to-Energy<br/><span className="text-emerald-500">Orchestrator</span></h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="glass-card !py-3 !px-6 flex items-center gap-3 !rounded-2xl border-white/5 hover:border-emerald-500/20">
            <Globe size={18} className="text-emerald-500" />
            <select className="bg-transparent border-none text-white outline-none cursor-pointer font-bold text-sm tracking-tight capitalize">
              <option value="bangalore">Bangalore Metropolitan</option>
              <option value="mumbai">Mumbai Region</option>
            </select>
          </div>
          <button className="glass-card !p-3 !rounded-2xl border-white/5 hover:bg-white/5">
            <Filter size={20} className="text-white/60" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-2">
        {/* Metric 1 */}
        <div className="glass-card group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap size={80} className="text-emerald-500" />
          </div>
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
                <Zap size={24} />
              </div>
              <span className="text-emerald-500 text-xs font-black flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-lg">
                <ArrowUpRight size={14} /> +12.4%
              </span>
            </div>
            <div>
              <h3 className="font-bold text-emerald-500/50 text-xs uppercase tracking-widest mb-1">Total Generated Output</h3>
              <p className="text-5xl font-black text-white tracking-tighter">{totalKWh.toLocaleString()} <span className="text-lg font-bold opacity-30">kWh</span></p>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-card group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Leaf size={80} className="text-emerald-500" />
          </div>
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
                <Leaf size={24} />
              </div>
              <span className="text-emerald-500 text-xs font-black flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-lg">
                <ArrowUpRight size={14} /> +8.1%
              </span>
            </div>
            <div>
              <h3 className="font-bold text-emerald-500/50 text-xs uppercase tracking-widest mb-1">Carbon Offset Index</h3>
              <p className="text-5xl font-black text-white tracking-tighter">{totalCO2Offset.toLocaleString()} <span className="text-lg font-bold opacity-30">kg</span></p>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-card group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Truck size={80} className="text-amber-500" />
          </div>
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center">
              <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500">
                <Truck size={24} />
              </div>
              <span className="text-amber-500 text-xs font-black flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-lg">
                LIVE
              </span>
            </div>
            <div>
              <h3 className="font-bold text-amber-500/50 text-xs uppercase tracking-widest mb-1">Active Logistics Fleet</h3>
              <p className="text-5xl font-black text-white tracking-tighter">04 <span className="text-lg font-bold opacity-30">Trucks</span></p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 stagger-3">
        {/* Map View */}
        <div className="lg:col-span-8 glass-card !p-0 overflow-hidden relative border-emerald-500/20 shadow-2xl min-h-[600px]">
          <div className="absolute top-6 left-6 z-[500] glass-card !bg-black/80 !py-3 !px-5 !rounded-2xl flex items-center gap-4">
            <div className="status-pulse border-2 border-emerald-500/30"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Fleet Operations</span>
              <span className="text-xs font-bold text-white">Live Tracking Active</span>
            </div>
            <div className="h-4 w-[1px] bg-white/10 mx-1"></div>
            <button className="text-white/50 hover:text-white transition-colors">
              <Download size={16} />
            </button>
          </div>
          
          <MapContainer center={[12.9716, 77.5946]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {trips.map(trip => (
              <Marker key={trip.id} position={trip.pickupLocation}>
                <Popup>
                  <div className="p-2 font-['Outfit']">
                    <h4 className="font-black text-emerald-900 uppercase tracking-tight">{trip.userName}</h4>
                    <p className="text-xs font-bold text-emerald-700/60 uppercase mb-2">Category: {trip.wasteType}</p>
                    <div className="flex justify-between gap-4 text-[10px] bg-emerald-50 px-2 py-1 rounded">
                      <span className="font-black">Load: {trip.weight_kg}kg</span>
                      <span className="font-black uppercase">{trip.status}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
            <Marker position={driverLocation}>
                <Popup>
                  <div className="p-2 font-['Outfit']">
                    <h4 className="font-black text-blue-900 border-b border-blue-100 mb-1">Fleet-Active-04</h4>
                    <p className="text-[10px] font-bold opacity-60">Status: Tracking Engaged</p>
                  </div>
                </Popup>
            </Marker>
          </MapContainer>
        </div>

        {/* Task Activity Side Panel */}
        <div className="lg:col-span-4 space-y-6">
           <div className="glass-card">
              <h3 className="font-black text-lg mb-6 flex items-center gap-2 tracking-tighter">
                <BarChart3 className="text-emerald-500" size={20} />
                Recent Activity
              </h3>
              <div className="space-y-4">
                 {trips.slice(0, 4).map(trip => (
                   <div key={trip.id} className="flex gap-4 items-center p-3 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                        {trip.wasteType === 'Plastic' ? <Zap size={18} /> : <Leaf size={18} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white text-sm truncate">{trip.userName}</p>
                        <p className="text-[10px] text-emerald-500/50 uppercase font-black tracking-widest">{trip.status}</p>
                      </div>
                      <span className="text-xs font-bold text-white/40">2m ago</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="glass-card bg-emerald-500/5 border-emerald-500/20">
              <p className="text-xs font-black uppercase text-emerald-500 tracking-widest mb-4">Grid Performance</p>
              <div className="space-y-4">
                 <div className="flex justify-between text-sm">
                   <span className="text-white/60">Load distribution</span>
                   <span className="font-bold text-white">92% Optimal</span>
                 </div>
                 <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-[92%] h-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
