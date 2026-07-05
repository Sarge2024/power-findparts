import { Part, Vehicle, VehicleLink, TechGroup, ActivityLog } from './types';

export const INITIAL_PARTS: Part[] = [
  {
    number: "5U0 903 025 B",
    name: "Alternador (14V/90A)",
    extraInfo: "BR SPEC",
    priceEst: "R$ 1.840,00",
    manufacturer: "Valeo Automotive",
    inventoryCode: "BR-903-000-E1",
    group: "Elétrica"
  },
  {
    number: "030 903 137 AE",
    name: "Correia em V (21.18x1150)",
    extraInfo: "VALEO",
    priceEst: "R$ 145,50",
    manufacturer: "Valeo Automotive",
    inventoryCode: "BR-903-000-E2",
    group: "Elétrica"
  },
  {
    number: "5Z0 915 105 A",
    name: "Bateria Principal Chumbo-Ácido",
    extraInfo: "12V/60AH",
    priceEst: "R$ 620,00",
    manufacturer: "Moura S.A.",
    inventoryCode: "BR-903-000-E3",
    group: "Elétrica"
  },
  {
    number: "02T 911 023 G",
    name: "Motor de Partida (0.9KW)",
    extraInfo: "STARTER",
    priceEst: "R$ 980,00",
    manufacturer: "Bosch Automotive",
    inventoryCode: "BR-903-000-E4",
    group: "Elétrica"
  }
];

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: "gol-2013",
    brand: "Volkswagen",
    model: "Gol",
    modification: "Gol / G6 Trend",
    year: "2013",
    region: "BR"
  },
  {
    id: "voyage-2011",
    brand: "Volkswagen",
    model: "Voyage",
    modification: "Voyage / 5U2*** Highline",
    year: "2011",
    region: "BR"
  },
  {
    id: "saveiro-2013",
    brand: "Volkswagen",
    model: "Saveiro",
    modification: "Saveiro / Cross Cabine Estendida",
    year: "2013",
    region: "BR"
  }
];

export const INITIAL_TECH_GROUPS: TechGroup[] = [
  { id: "eletrica", name: "Elétrica", groupCode: "GRP. 9", icon: "bolt", subgroupCount: 14 },
  { id: "suspensao", name: "Suspensão", groupCode: "GRP. 4", icon: "settings_input_component", subgroupCount: 8 },
  { id: "motor", name: "Motor", groupCode: "GRP. 1", icon: "oil_barrel", subgroupCount: 22 },
  { id: "rodas_freios", name: "Rodas e Freios", groupCode: "GRP. 6", icon: "tire_repair", subgroupCount: 5 }
];

export const INITIAL_LINKS: VehicleLink[] = [
  {
    id: "link-1",
    partNumber: "5U0 903 025 B",
    vehicleId: "gol-2013",
    group: "Elétrica",
    subgroup: "903-000",
    timestamp: "2026-07-05T10:30:00"
  },
  {
    id: "link-2",
    partNumber: "5U0 903 025 B",
    vehicleId: "saveiro-2013",
    group: "Elétrica",
    subgroup: "903-000",
    timestamp: "2026-07-05T10:45:00"
  }
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: "log-1",
    timestamp: "10:30",
    partNumber: "5U0 903 025 B",
    partName: "Alternador (14V/90A)",
    vehicleName: "Gol 2013 BR",
    action: "linked"
  },
  {
    id: "log-2",
    timestamp: "10:45",
    partNumber: "5U0 903 025 B",
    partName: "Alternador (14V/90A)",
    vehicleName: "Saveiro 2013 BR",
    action: "linked"
  }
];

export const IMAGE_LINKS = {
  engineBg: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJh1pQBzRjhwiCiRv8rr5sjNgN-fDh0GeuwgA65Oqoh67U7iC56cTP_KgGcdPrJlzAITDAQV0oIbXmNjtHmb8lMNCsf6Rn-ATMyjiJ_9Af1SqDBBloTs2_loN1gVHOCcxlu5_yUNdZZAw9EyTSfPnWBiP6LnOB3F-NVYf8QAAFjNGSaS79QS0uQLyS7I4Sfa0G6UjNFiEgEFmQL7LftO3LmFa_fL6M3pqo3C93wDgtv-Psb7LAns3qRg",
  scannerFeed: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6akjte8Fs0SStCNgXFGMMXuJWn60QMd6-IQJLy7t3BC3DbzCmbFU_AyodLs_XzGmnhcIYjbtWXcldhYiAx_Po3dDlVnwhTOxDYuhfLHG0k0FetvSpnQume4KUwgXPMyPFWqdArP9cwStf7bcXeglvjx_AyI948Fn-gXyulQirFvFr3cUqDLTfnzRYCos1hrRYLzP8iM6W0SXQJOyBjAxKbhz2Oulb9t9OPhlg7C2ZFi-WFvMJZaZ2BQ",
  alternatorReal: "https://lh3.googleusercontent.com/aida-public/AB6AXuAheJix2HfNLjYvRF3bN6uy8Fl6sjkfONsjqVZigQZlNab4r-Wm4fjUojQUz10bP0EEy4p19imlJ2ZVIDSFbxVNWAL-Ib4u1UOStebdISBSrE0Ivo7JJ7D4YXpxLlmYbNtHb8v7ZLAqM5TUPCt73GVxRQeW8rqbqGcIw9tXwkGzhz_x_2e0GdDZzY5tjfIeitVj74D3H3EOT74w9Lr18OBSpzQBz9LTNLjxRvYnAy1u51zA3e_Byeg-_w"
};
