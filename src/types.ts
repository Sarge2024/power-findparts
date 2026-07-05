export interface Part {
  number: string;
  name: string;
  extraInfo: string;
  priceEst: string;
  manufacturer: string;
  inventoryCode: string;
  group: string; // e.g. "Elétrica", "Suspensão", "Motor", "Rodas e Freios"
  subgroup?: string; // e.g. "Alternador", "Bateria", "Correias"
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  modification: string;
  year: string;
  region: string;
}

export interface VehicleLink {
  id: string;
  partNumber: string;
  vehicleId: string;
  group: string;
  subgroup: string;
  timestamp: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  partNumber: string;
  partName: string;
  vehicleName: string;
  action: 'linked' | 'unlinked' | 'registered';
}

export interface TechGroup {
  id: string;
  name: string;
  groupCode: string;
  icon: string;
  subgroupCount: number;
}

export interface TechSubgroup {
  id: string;
  groupId: string;
  name: string;
}

export interface CosmosPart {
  id: string;
  gtin: string;
  description: string;
  brand: string;
  thumbnail: string;
  vehicleId: string;
  vehicleName: string;
  timestamp: string;
}
