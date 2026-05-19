// ─────────────────────────────────────────────────────────────────────────────
// data/items.ts
// Single source of truth for all rentable items.
// Both the UI overlay and the Three.js scene consume this data.
// ─────────────────────────────────────────────────────────────────────────────

export type ItemCategory = "desk" | "chair" | "accessory";

export type GeometryConfig = {
  width: number;
  height: number;
  depth: number;
};

export type ScenePlacement = {
  /** World-space position [x, y, z] */
  position: [number, number, number];
  /** Optional rotation in radians [x, y, z] */
  rotation?: [number, number, number];
  /** Optional uniform scale override */
  scale?: number;
};

export type ItemConfig = {
  id: string;
  name: string;
  category: ItemCategory;
  tagline: string;
  description: string;
  /** Price in IDR per week */
  pricePerWeek: number;
  /** Hex color for Three.js MeshStandardMaterial */
  color: string;
  /** Accent / highlight color for UI badge */
  accentColor: string;
  /** Box geometry dimensions (meters in scene units) */
  geometry: GeometryConfig;
  /** Where to place this mesh in the scene */
  placement: ScenePlacement;
  /** UI display icon (emoji fallback — replace with SVG later) */
  icon: string;
  /** Feature bullet points for the item card */
  features: string[];
};

// ─── Desks ───────────────────────────────────────────────────────────────────

export const DESKS: ItemConfig[] = [
  {
    id: "desk-electrical",
    name: "Electrical Adjustable Desk",
    category: "desk",
    tagline: "Sit. Stand. Thrive.",
    description:
      "Motorised height adjustment from 62–128 cm with memory presets. Built for endurance work sessions.",
    pricePerWeek: 185_000,
    color: "#D4C5A9",
    accentColor: "#E8A020",
    geometry: { width: 2.4, height: 0.08, depth: 1.0 },
    placement: { position: [0, 0.74, 0] },
    icon: "⚡",
    features: [
      "Electric motor, 4 height presets",
      "Cable management tray included",
      "Anti-collision safety sensor",
      "62–128 cm height range",
    ],
  },
  {
    id: "desk-mechanical",
    name: "Mechanical Adjustable Desk",
    category: "desk",
    tagline: "Manual control, no limits.",
    description:
      "Hand-crank pneumatic lift for silent height adjustment. No power needed — works anywhere.",
    pricePerWeek: 130_000,
    color: "#B8A98A",
    accentColor: "#030616ff",
    geometry: { width: 2.2, height: 0.08, depth: 0.9 },
    placement: { position: [0, 0.74, 0] },
    icon: "🔧",
    features: [
      "Pneumatic gas-lift mechanism",
      "Silent operation, no power required",
      "Solid bamboo surface",
      "70–110 cm height range",
    ],
  },
  {
    id: "desk-standard",
    name: "Standard Desk",
    category: "desk",
    tagline: "Simple. Solid. Ready.",
    description:
      "Fixed-height premium desk with a spacious surface and steel-reinforced legs.",
    pricePerWeek: 75_000,
    color: "#C8B99A",
    accentColor: "#7A7570",
    geometry: { width: 2.0, height: 0.07, depth: 0.85 },
    placement: { position: [0, 0.74, 0] },
    icon: "🪵",
    features: [
      "75 cm fixed height",
      "MDF top with wood veneer",
      "Steel powder-coated legs",
      "Max load 80 kg",
    ],
  },
];

// ─── Chairs ──────────────────────────────────────────────────────────────────

export const CHAIRS: ItemConfig[] = [
  {
    id: "chair-ergonomic",
    name: "Ergonomic Office Chair",
    category: "chair",
    tagline: "Your spine will thank you.",
    description:
      "Full lumbar + headrest support with breathable mesh back. Designed for 8+ hour sessions.",
    pricePerWeek: 120_000,
    color: "#2C2C2C",
    accentColor: "#E8A020",
    geometry: { width: 0.65, height: 0.9, depth: 0.65 },
    placement: { position: [0, 0.45, 1.4] },
    icon: "🪑",
    features: [
      "Adjustable lumbar + headrest",
      "4D armrests",
      "Breathable mesh backrest",
      "Seat depth & tilt adjustment",
    ],
  },
  {
    id: "chair-gaming",
    name: "Gaming Chair",
    category: "chair",
    tagline: "Built for the long grind.",
    description:
      "Racing-style bucket seat with neck and lumbar pillows. Wide recline range up to 165°.",
    pricePerWeek: 95_000,
    color: "#1A1A2E",
    accentColor: "#E8A020",
    geometry: { width: 0.7, height: 1.0, depth: 0.7 },
    placement: { position: [0, 0.5, 1.4] },
    icon: "🎮",
    features: [
      "165° recline range",
      "Integrated neck + lumbar pillows",
      "PU leather cold-cure foam",
      "Steel frame 150 kg rated",
    ],
  },
  {
    id: "chair-standard",
    name: "Standard Chair",
    category: "chair",
    tagline: "No fuss, just comfort.",
    description:
      "Classic task chair with padded seat and adjustable height. Lightweight and easy to move.",
    pricePerWeek: 45_000,
    color: "#4A4A4A",
    accentColor: "#7A7570",
    geometry: { width: 0.55, height: 0.75, depth: 0.55 },
    placement: { position: [0, 0.38, 1.4] },
    icon: "💺",
    features: [
      "Pneumatic height adjustment",
      "360° swivel base",
      "Padded fabric seat",
      "Max load 100 kg",
    ],
  },
];

// ─── Accessories ─────────────────────────────────────────────────────────────

export const ACCESSORIES: ItemConfig[] = [
  {
    id: "acc-ergo-keyboard",
    name: "Ergonomic Keyboard",
    category: "accessory",
    tagline: "Type in comfort, all day.",
    description:
      "Split-layout ergonomic keyboard with negative tilt and wrist rest. Reduces RSI risk significantly.",
    pricePerWeek: 55_000,
    color: "#E8E0D0",
    accentColor: "#E8A020",
    geometry: { width: 0.5, height: 0.03, depth: 0.2 },
    placement: { position: [-0.15, 0.79, 0.25] },
    icon: "⌨️",
    features: [
      "Split V-angle layout",
      "Detachable wrist rest",
      "Low-actuation silent keys",
      "USB-C + Bluetooth",
    ],
  },
  {
    id: "acc-mech-keyboard",
    name: "Mechanical Keyboard",
    category: "accessory",
    tagline: "Every keystroke, intentional.",
    description:
      "Tenkeyless layout with Cherry MX Brown switches. Satisfying tactile feedback for coders and writers.",
    pricePerWeek: 65_000,
    color: "#3A3530",
    accentColor: "#C47A10",
    geometry: { width: 0.38, height: 0.04, depth: 0.14 },
    placement: { position: [-0.15, 0.79, 0.25] },
    icon: "🎹",
    features: [
      "Cherry MX Brown switches",
      "TKL (tenkeyless) layout",
      "Doubleshot PBT keycaps",
      "N-key rollover",
    ],
  },
  {
    id: "acc-mouse",
    name: "Ergonomic Mouse",
    category: "accessory",
    tagline: "Precision, zero strain.",
    description:
      "Vertical ergonomic mouse with adjustable DPI 400–3200. Keeps your wrist in a natural handshake position.",
    pricePerWeek: 35_000,
    color: "#2A2825",
    accentColor: "#E8A020",
    geometry: { width: 0.08, height: 0.07, depth: 0.12 },
    placement: { position: [0.45, 0.79, 0.25] },
    icon: "🖱️",
    features: [
      "Vertical grip ergonomics",
      "400–3200 adjustable DPI",
      "Programmable side buttons",
      "USB-C charging",
    ],
  },
  {
    id: "acc-mousepad",
    name: "Extended Mouse Pad",
    category: "accessory",
    tagline: "The full-desk foundation.",
    description:
      "900×400 mm extended pad with micro-textured surface and stitched anti-fray edges.",
    pricePerWeek: 20_000,
    color: "#1C1A17",
    accentColor: "#7A7570",
    geometry: { width: 0.9, height: 0.004, depth: 0.4 },
    placement: { position: [0, 0.783, 0.2] },
    icon: "🟫",
    features: [
      "900×400 mm full-desk size",
      "3 mm natural rubber base",
      "Stitched anti-fray edge",
      "Micro-textured speed surface",
    ],
  },
];

// ─── Aggregated exports ───────────────────────────────────────────────────────

export const ALL_ITEMS: ItemConfig[] = [...DESKS, ...CHAIRS, ...ACCESSORIES];

export const ITEMS_BY_CATEGORY: Record<ItemCategory, ItemConfig[]> = {
  desk: DESKS,
  chair: CHAIRS,
  accessory: ACCESSORIES,
};

/** Default selections shown on first load */
export const DEFAULT_SELECTIONS: Record<ItemCategory, string> = {
  desk: "desk-electrical",
  chair: "chair-ergonomic",
  accessory: "acc-ergo-keyboard",
};

/** Format price in IDR */
export function formatPrice(pricePerWeek: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(pricePerWeek);
}

/** Get total price for a selection set */
export function getTotalPrice(selectedIds: string[]): number {
  return selectedIds.reduce((sum, id) => {
    const item = ALL_ITEMS.find((i) => i.id === id);
    return sum + (item?.pricePerWeek ?? 0);
  }, 0);
}
