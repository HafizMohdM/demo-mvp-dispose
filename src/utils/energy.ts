export type WasteType = 'Organic' | 'Plastic' | 'Metal';

export const ENERGY_FACTORS: Record<WasteType, number> = {
  Organic: 0.15, // kWh/kg (Biogas)
  Plastic: 0.5,  // kWh/kg (Waste-to-Energy combustion)
  Metal: 0.1,    // kWh/kg (Energy saved via recycling)
};

export const CO2_FACTOR = 2.5; // kg CO2 offset per kg waste

export const calculateEnergy = (weight: number, type: WasteType): number => {
  return weight * (ENERGY_FACTORS[type] || 0.1);
};

export const calculateCO2Offset = (weight: number): number => {
  return weight * CO2_FACTOR;
};
