import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  Calendar, MapPin, Zap, Leaf, Truck, CheckCircle,
  ChevronRight, BarChart3, Clock, Package, ArrowRight
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { calculateEnergy, calculateCO2Offset } from '../../utils/energy';
import type { WasteType } from '../../utils/energy';
import { z } from 'zod';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import TopNav from '../../components/TopNav';

L.Marker.prototype.options.icon = L.icon({ iconUrl: markerIcon, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41] });

const schema = z.object({
  wasteType: z.enum(['Organic', 'Plastic', 'Metal']),
  weight: z.number().min(1).max(500),
  date: z.string().min(1),
});

const WASTE_OPTS: { type: WasteType; icon: React.ReactNode; desc: string }[] = [
  { type: 'Organic', icon: <Leaf size={16} />,    desc: 'Food, garden waste'  },
  { type: 'Plastic', icon: <Zap size={16} />,     desc: 'Bottles, packaging'  },
  { type: 'Metal',   icon: <Package size={16} />, desc: 'Cans, scrap metal'   },
];

const STATUS_BADGE: Record<string, string> = {
  pending: 'badge-muted', 'in-progress': 'badge-green',
  arriving: 'badge-yellow', completed: 'badge-muted',
};

const UserPortal: React.FC = () => {
  const { addTrip, trips, driverLocation, setView } = useAppStore();
  const [wasteType, setWasteType] = useState<WasteType>('Plastic');
  const [weight, setWeight]       = useState(20);
  const [pickupDate, setPickupDate] = useState('');
  const [slot, setSlot]           = useState('morning');
  const [success, setSuccess]     = useState(false);

  const myTrips   = trips.filter(t => t.userId === 'u1');
  const activeTrip = myTrips.find(t => t.status === 'in-progress' || t.status === 'arriving');
  const upcoming  = myTrips.filter(t => t.status === 'pending');
  const history   = myTrips.filter(t => t.status === 'completed');

  const estKWh     = calculateEnergy(weight, wasteType);
  const estCO2     = calculateCO2Offset(weight);
  const estEarnings = (weight * 12).toFixed(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      schema.parse({ wasteType, weight, date: pickupDate });
      addTrip({ userId: 'u1', userName: 'Arjun Mehta', address: '14, MG Road, Bangalore',
        pickupLocation: [12.9716, 77.5946], wasteType, weight_kg: weight, scheduledDate: pickupDate });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch { alert('Please fill all fields correctly.'); }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <TopNav
        pageLabel="User Portal"
        right={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm"
              style={{ background: 'var(--green-dim)', border: '1px solid var(--border-green)', color: 'var(--green)' }}>A</div>
            <span className="text-sm font-medium hidden md:block">Arjun Mehta</span>
          </div>
        }
      />

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left */}
        <div className="lg:col-span-8 space-y-6">
          <div className="fade-up">
            <h1 className="text-2xl font-black tracking-tight">Dashboard</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Welcome back, Arjun. Here's your waste activity.</p>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4 fade-up-2">
            <div className="card">
              <div className="icon-box-green mb-3"><Zap size={18} /></div>
              <p className="text-xl font-black">{estKWh.toFixed(1)} <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>kWh</span></p>
              <p className="label mt-1">Energy Credit</p>
            </div>
            <div className="card">
              <div className="icon-box-green mb-3"><Leaf size={18} /></div>
              <p className="text-xl font-black">{estCO2.toFixed(1)} <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>kg</span></p>
              <p className="label mt-1">CO₂ Offset</p>
            </div>
            <div className="card">
              <div className="icon-box-yellow mb-3"><BarChart3 size={18} /></div>
              <p className="text-xl font-black" style={{ color: 'var(--yellow)' }}>₹{estEarnings}</p>
              <p className="label mt-1">Rewards Earned</p>
            </div>
          </div>

          {/* Active tracking */}
          {activeTrip ? (
            <div className="card-green fade-up-2">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <span className="live-dot"></span>
                  <div>
                    <p className="font-bold text-sm">Truck #04 is En Route</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Active Fleet Tracking</p>
                  </div>
                </div>
                <span className="badge-green">ETA: 12 min</span>
              </div>
              <div className="rounded-xl overflow-hidden h-[300px]">
                <MapContainer center={[12.9716, 77.5946]} zoom={14} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                  <Marker position={[12.9716, 77.5946]} />
                  <Marker position={driverLocation} />
                  <Polyline positions={[driverLocation, [12.9716, 77.5946]]}
                    pathOptions={{ color: '#10b981', dashArray: '10,8', weight: 2.5, opacity: 0.8 }} />
                </MapContainer>
              </div>
            </div>
          ) : (
            <div className="card text-center py-12 fade-up-2" style={{ borderStyle: 'dashed' }}>
              <div className="icon-box-muted mx-auto mb-3"><MapPin size={20} /></div>
              <p className="font-bold text-sm mb-1">No active pickup</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Schedule one using the form →</p>
            </div>
          )}

          {/* Upcoming */}
          {upcoming.length > 0 && (
            <div className="fade-up-3">
              <p className="label mb-3">Upcoming Pickups</p>
              <div className="space-y-3">
                {upcoming.map(t => (
                  <div key={t.id} className="card flex items-center gap-4">
                    <div className="icon-box-green"><Truck size={18} /></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm">{t.wasteType} · {t.weight_kg} kg</p>
                      <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        <Clock size={11} /> {t.scheduledDate || 'Date TBD'} · {t.address}
                      </p>
                    </div>
                    <span className={STATUS_BADGE[t.status]}>{t.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History table */}
          {history.length > 0 && (
            <div className="fade-up-4">
              <p className="label mb-3">Waste History</p>
              <div className="card !p-0 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Date', 'Type', 'Weight', 'Energy', 'Earnings', 'Status'].map(h => (
                        <th key={h} className="text-left px-4 py-3 label">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {history.map(t => (
                      <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}
                        className="transition-colors hover:bg-[rgba(0,0,0,0.02)]">
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{t.scheduledDate || '—'}</td>
                        <td className="px-4 py-3 font-medium">{t.wasteType}</td>
                        <td className="px-4 py-3">{t.weight_kg} kg</td>
                        <td className="px-4 py-3" style={{ color: 'var(--green)' }}>{calculateEnergy(t.weight_kg, t.wasteType).toFixed(1)} kWh</td>
                        <td className="px-4 py-3" style={{ color: 'var(--yellow)' }}>₹{(t.weight_kg * 12).toFixed(0)}</td>
                        <td className="px-4 py-3"><span className="badge-muted">Completed</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right: Schedule form */}
        <div className="lg:col-span-4 fade-up-2">
          <div className="card sticky top-6" style={{ borderColor: 'var(--border-green)' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="icon-box-green"><Truck size={18} /></div>
              <div>
                <h2 className="font-black text-base">Schedule Pickup</h2>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Book a collection slot</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Waste type */}
              <div>
                <p className="label mb-2">Waste Category</p>
                <div className="space-y-2">
                  {WASTE_OPTS.map(({ type, icon, desc }) => (
                    <button key={type} type="button" onClick={() => setWasteType(type)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                      style={{
                        border: wasteType === type ? '1px solid var(--green)' : '1px solid var(--border)',
                        background: wasteType === type ? 'var(--green-dim)' : 'transparent',
                        color: wasteType === type ? 'var(--text)' : 'var(--text-muted)',
                      }}
                    >
                      <span style={{ color: wasteType === type ? 'var(--green)' : 'var(--text-muted)' }}>{icon}</span>
                      <span className="flex-1 text-left">{type}</span>
                      <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>{desc}</span>
                      {wasteType === type && <ChevronRight size={14} style={{ color: 'var(--green)' }} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="label">Estimated Weight</p>
                  <span className="font-black text-base">{weight} kg</span>
                </div>
                <input type="range" min="1" max="100" value={weight} onChange={e => setWeight(+e.target.value)} />
                <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-subtle)' }}>
                  <span>1 kg</span><span>100 kg</span>
                </div>
              </div>

              {/* Estimate preview */}
              <div className="rounded-xl p-3 grid grid-cols-2 gap-3" style={{ background: 'var(--bg-card-2)' }}>
                <div>
                  <p className="label mb-1">Est. Energy</p>
                  <p className="font-bold text-sm" style={{ color: 'var(--green)' }}>{estKWh.toFixed(1)} kWh</p>
                </div>
                <div>
                  <p className="label mb-1">Est. Earnings</p>
                  <p className="font-bold text-sm" style={{ color: 'var(--yellow)' }}>₹{estEarnings}</p>
                </div>
              </div>

              {/* Date & slot */}
              <div className="space-y-3">
                <div>
                  <p className="label mb-1.5">Service Date</p>
                  <div className="relative">
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" size={16}
                      style={{ color: 'var(--text-muted)' }} />
                    <input type="date" value={pickupDate} onChange={e => setPickupDate(e.target.value)} />
                  </div>
                </div>
                <div>
                  <p className="label mb-1.5">Preferred Slot</p>
                  <select value={slot} onChange={e => setSlot(e.target.value)}>
                    <option value="morning">Morning (09:00 – 12:00)</option>
                    <option value="evening">Evening (15:00 – 18:00)</option>
                  </select>
                </div>
              </div>

              <button type="submit" disabled={success} className="btn-green w-full justify-center py-3.5 text-sm">
                {success ? <><CheckCircle size={16} /> Pickup Scheduled!</> : <>Request Pickup <ArrowRight size={16} /></>}
              </button>
            </form>

            {/* Plan info */}
            <div className="mt-6 pt-5" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="label mb-0.5">Current Plan</p>
                  <p className="font-bold text-sm">Premium · Flat</p>
                </div>
                <span className="badge-green">Active</span>
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>4 of 6 pickups used this month</p>
              <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                <div className="h-full rounded-full" style={{ width: '66%', background: 'var(--green)' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPortal;
