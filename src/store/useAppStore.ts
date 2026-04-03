import { create } from 'zustand';
import type { WasteType } from '../utils/energy';
import { calculateEnergy, calculateCO2Offset } from '../utils/energy';

export type TripStatus = 'pending' | 'in-progress' | 'arriving' | 'completed';

export interface Trip {
  id: string;
  userId: string;
  userName: string;
  pickupLocation: [number, number]; // Lat, Lng
  wasteType: WasteType;
  weight_kg: number;
  status: TripStatus;
  driverId?: string;
  timestamp: string;
}

interface AppState {
  userRole: 'admin' | 'user' | 'driver';
  trips: Trip[];
  notifications: string[];
  driverLocation: [number, number];
  totalKWh: number;
  totalCO2Offset: number;
  
  // Actions
  setRole: (role: 'admin' | 'user' | 'driver') => void;
  addTrip: (trip: Omit<Trip, 'id' | 'status' | 'timestamp'>) => void;
  updateTripStatus: (tripId: string, status: TripStatus) => void;
  setDriverLocation: (location: [number, number]) => void;
  addNotification: (message: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  userRole: 'user',
  trips: [
    {
      id: '1',
      userId: 'u1',
      userName: 'John Doe',
      pickupLocation: [12.9716, 77.5946], // Bangalore center
      wasteType: 'Plastic',
      weight_kg: 25,
      status: 'pending',
      timestamp: new Date().toISOString(),
    }
  ],
  notifications: [],
  driverLocation: [12.96, 77.58], // Starting somewhere near
  totalKWh: 1240.5,
  totalCO2Offset: 3100.25,

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
    
    // If completed, update global stats
    const completedTrip = state.trips.find(t => t.id === tripId);
    let extraStats = {};
    if (status === 'completed' && completedTrip && completedTrip.status !== 'completed') {
      const kWh = calculateEnergy(completedTrip.weight_kg, completedTrip.wasteType);
      const co2 = calculateCO2Offset(completedTrip.weight_kg);
      extraStats = {
        totalKWh: state.totalKWh + kWh,
        totalCO2Offset: state.totalCO2Offset + co2,
      };
    }

    return { 
      trips: updatedTrips,
      ...extraStats
    };
  }),

  setDriverLocation: (location) => set({ driverLocation: location }),
  
  addNotification: (message) => set((state) => ({ 
    notifications: [message, ...state.notifications].slice(0, 5) 
  })),
}));
