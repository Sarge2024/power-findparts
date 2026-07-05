export interface Part {
  number: string;
  name: string;
  extraInfo: string;
  priceEst: string;
  manufacturer: string;
  inventoryCode: string;
  group: string; // e.g. "Elétrica", "Suspensão", "Motor", "Rodas e Freios"
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
