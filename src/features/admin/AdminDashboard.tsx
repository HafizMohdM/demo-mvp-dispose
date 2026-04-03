import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  Zap, Leaf, Truck, IndianRupee, ArrowUpRight,
  BarChart3, Clock, MapPin, Filter, Download
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import TopNav from '../../components/TopNav';

L.Marker.prototype.options.icon = L.icon({ iconUrl: markerIcon, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41] });

const STATUS_BADGE: Record<string, string> = {
  pending: 'badge-muted', 'in-progress': 'badge-green',
  arriving: 'badge-yellow', completed: 'badge-muted',
};

const AdminDashboard: React.FC = () => {
  const { totalKWh, totalCO2Offset, totalRevenue, trips, driverLocation, setView } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');

  const activeFleet = trips.filter(t => t.status === 'in-progress' || t.status === 'arriving').length;
  const filtered    = filter === 'all' ? trips : trips.filter(t => t.status === filter);

  const METRICS = [
    { icon: <Zap size={18} />,         label: 'Energy Generated', value: `${totalKWh.toLocaleString()} kWh`,    delta: '+12.4%', yellow: false },
    { icon: <Leaf size={18} />,        label: 'CO₂ Offset',       value: `${totalCO2Offset.toLocaleString()} kg`, delta: '+8.1%',  yellow: false },
    { icon: <Truck size={18} />,       label: 'Active Fleet',     value: `${activeFleet} Trucks`,               delta: 'LIVE',   yellow: true  },
    { icon: <IndianRupee size={18} />, label: 'Revenue',          value: `₹${totalRevenue.toLocaleString()}`,   delta: '+5.3%',  yellow: false },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <TopNav
        pageLabel="Admin"
        right={
          <div className="flex items-center gap-2">
            <button className="btn-outline text-xs py-1.5 px-3 gap-1.5">
              <Download size={13} /> Export
            </button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm"
              style={{ background: 'var(--green-dim)', border: '1px solid var(--border-green)', color: 'var(--green)' }}>A</div>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 space-y-8">
        {/* Title */}
        <div className="fade-up">
          <h1 className="text-2xl font-black tracking-tight">Operations Overview</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Bangalore Metropolitan · Live data</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 fade-up-2">
          {METRICS.map(m => (
            <div key={m.label} className="card">
              <div className="flex justify-between items-start mb-4">
                <div className={m.yellow ? 'icon-box-yellow' : 'icon-box-green'}>{m.icon}</div>
                <span className={m.yellow ? 'badge-yellow flex items-center gap-1' : 'badge-green flex items-center gap-1'}>
                  {m.delta !== 'LIVE' && <ArrowUpRight size={11} />}{m.delta}
                </span>
              </div>
              <p className="text-2xl font-black tracking-tight">{m.value}</p>
              <p className="label mt-1">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Map + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 fade-up-3">
          {/* Map */}
          <div className="lg:col-span-8">
            <div className="card !p-0 overflow-hidden">
              <div className="flex justify-between items-center px-5 py-4"
                style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="flex items-center gap-3">
                  <span className="live-dot"></span>
                  <div>
                    <p className="font-bold text-sm">Fleet Tracking</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Live positions · {activeFleet} active</p>
                  </div>
                </div>
                <button className="btn-outline text-xs py-1.5 px-3 gap-1.5">
                  <Filter size={12} /> Filter
                </button>
              </div>
              <div className="h-[480px]">
                <MapContainer center={[12.9716, 77.5946]} zoom={12} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                  {trips.map(trip => (
                    <Marker key={trip.id} position={trip.pickupLocation}>
                      <Popup>
                        <div style={{ fontFamily: 'Outfit, sans-serif', padding: 4 }}>
                          <p style={{ fontWeight: 800, marginBottom: 4 }}>{trip.userName}</p>
                          <p style={{ fontSize: 11, opacity: 0.6 }}>{trip.wasteType} · {trip.weight_kg} kg</p>
                          <p style={{ fontSize: 11, fontWeight: 700, marginTop: 4, textTransform: 'uppercase' }}>{trip.status}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                  <Marker position={driverLocation}>
                    <Popup>
                      <div style={{ fontFamily: 'Outfit, sans-serif', padding: 4 }}>
                        <p style={{ fontWeight: 800 }}>Fleet-04 · Active</p>
                        <p style={{ fontSize: 11, opacity: 0.6 }}>Tracking engaged</p>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>

          {/* Side panel */}
          <div className="lg:col-span-4 space-y-4">
            {/* Grid performance */}
            <div className="card">
              <p className="label mb-4">Grid Performance</p>
              <div className="space-y-4">
                {[
                  { label: 'Load Distribution', val: 92 },
                  { label: 'Fleet Efficiency',   val: 87 },
                  { label: 'Route Optimization', val: 78 },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                      <span className="font-bold text-xs" style={{ color: 'var(--green)' }}>{item.val}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${item.val}%`, background: 'var(--green)' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent activity */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={16} style={{ color: 'var(--green)' }} />
                <p className="font-bold text-sm">Recent Activity</p>
              </div>
              <div className="space-y-3">
                {trips.slice(0, 5).map(trip => (
                  <div key={trip.id} className="flex items-center gap-3 py-2"
                    style={{ borderBottom: '1px solid var(--border)' }}>
                    <div className="icon-box-muted !w-8 !h-8 !rounded-lg"><MapPin size={13} /></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs truncate">{trip.userName}</p>
                      <p className="text-[10px] flex items-center gap-1 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        <Clock size={9} /> {trip.wasteType} · {trip.weight_kg} kg
                      </p>
                    </div>
                    <span className={STATUS_BADGE[trip.status] || 'badge-muted'}>{trip.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trips table */}
        <div className="fade-up-4">
          <div className="flex justify-between items-center mb-4">
            <p className="font-bold text-sm">All Trips</p>
            <div className="flex gap-2">
              {(['all', 'pending', 'in-progress', 'completed'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className="text-xs py-1.5 px-3 rounded-lg font-medium transition-all capitalize"
                  style={{
                    border: filter === f ? '1px solid var(--green)' : '1px solid var(--border)',
                    background: filter === f ? 'var(--green-dim)' : 'transparent',
                    color: filter === f ? 'var(--green)' : 'var(--text-muted)',
                  }}
                >{f}</button>
              ))}
            </div>
          </div>
          <div className="card !p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['User', 'Address', 'Type', 'Weight', 'Energy', 'Revenue', 'Status'].map(h => (
                    <th key={h} className="text-left px-4 py-3 label">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}
                    className="transition-colors hover:bg-[rgba(0,0,0,0.02)]">
                    <td className="px-4 py-3 font-medium text-sm">{t.userName}</td>
                    <td className="px-4 py-3 text-xs max-w-[160px] truncate" style={{ color: 'var(--text-muted)' }}>{t.address}</td>
                    <td className="px-4 py-3 text-sm">{t.wasteType}</td>
                    <td className="px-4 py-3 text-sm">{t.weight_kg} kg</td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--green)' }}>{(t.weight_kg * 0.5).toFixed(1)} kWh</td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--yellow)' }}>₹{t.weight_kg * 12}</td>
                    <td className="px-4 py-3"><span className={STATUS_BADGE[t.status] || 'badge-muted'}>{t.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
