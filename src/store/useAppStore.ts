import { create } from 'zustand';
import type { WasteType } from '../utils/energy';
import { calculateEnergy, calculateCO2Offset } from '../utils/energy';

export type TripStatus = 'pending' | 'in-progress' | 'arriving' | 'completed';
export type AppView = 'landing' | 'user' | 'driver' | 'admin';

export interface Trip {
  id: string;
  userId: string;
  userName: string;
  address: string;
  pickupLocation: [number, number];
  wasteType: WasteType;
  weight_kg: number;
  status: TripStatus;
  driverId?: string;
  timestamp: string;
  scheduledDate?: string;
}

interface AppState {
  view: AppView;
  theme: 'dark' | 'light';
  userRole: 'admin' | 'user' | 'driver';
  trips: Trip[];
  notifications: string[];
  driverLocation: [number, number];
  totalKWh: number;
  totalCO2Offset: number;
  totalRevenue: number;

  setView: (view: AppView) => void;
  toggleTheme: () => void;
  setRole: (role: 'admin' | 'user' | 'driver') => void;
  addTrip: (trip: Omit<Trip, 'id' | 'status' | 'timestamp'>) => void;
  updateTripStatus: (tripId: string, status: TripStatus) => void;
  setDriverLocation: (location: [number, number]) => void;
  addNotification: (message: string) => void;
}

const SEED_TRIPS: Trip[] = [
  {
    id: '1',
    userId: 'u1',
    userName: 'Arjun Mehta',
    address: '14, MG Road, Bangalore',
    pickupLocation: [12.9716, 77.5946],
    wasteType: 'Plastic',
    weight_kg: 25,
    status: 'in-progress',
    timestamp: new Date().toISOString(),
    scheduledDate: '2026-04-05',
  },
  {
    id: '2',
    userId: 'u2',
    userName: 'Priya Nair',
    address: '7, Koramangala, Bangalore',
    pickupLocation: [12.9352, 77.6245],
    wasteType: 'Organic',
    weight_kg: 40,
    status: 'pending',
    timestamp: new Date().toISOString(),
    scheduledDate: '2026-04-06',
  },
  {
    id: '3',
    userId: 'u3',
    userName: 'Ravi Kumar',
    address: '22, Whitefield, Bangalore',
    pickupLocation: [12.9698, 77.7499],
    wasteType: 'Metal',
    weight_kg: 60,
    status: 'completed',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    scheduledDate: '2026-04-03',
  },
];

export const useAppStore = create<AppState>((set) => ({
  view: 'landing',
  theme: 'dark',
  userRole: 'user',
  trips: SEED_TRIPS,
  notifications: [],
  driverLocation: [12.96, 77.58],
  totalKWh: 1240.5,
  totalCO2Offset: 3100.25,
  totalRevenue: 84200,

  setView: (view) => set({ view }),
  toggleTheme: () => set((state) => {
    const next = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    return { theme: next };
  }),
  setRole: (role) => set({ userRole: role }),

  addTrip: (tripData) => set((state) => {
    const newTrip: Trip = {
      ...tripData,
      id: Math.random().toString(36).substring(7),
      status: 'pending',
      timestamp: new Date().toISOString(),
    };
    return { trips: [...state.trips, newTrip] };
  }),

  updateTripStatus: (tripId, status) => set((state) => {
    const updatedTrips = state.trips.map((t) =>
      t.id === tripId ? { ...t, status } : t
    );
    const completedTrip = state.trips.find(t => t.id === tripId);
    let extraStats = {};
    if (status === 'completed' && completedTrip && completedTrip.status !== 'completed') {
      const kWh = calculateEnergy(completedTrip.weight_kg, completedTrip.wasteType);
      const co2 = calculateCO2Offset(completedTrip.weight_kg);
      extraStats = {
        totalKWh: state.totalKWh + kWh,
        totalCO2Offset: state.totalCO2Offset + co2,
        totalRevenue: state.totalRevenue + completedTrip.weight_kg * 12,
      };
    }
    return { trips: updatedTrips, ...extraStats };
  }),

  setDriverLocation: (location) => set({ driverLocation: location }),

  addNotification: (message) => set((state) => ({
    notifications: [message, ...state.notifications].slice(0, 5),
  })),
}));
