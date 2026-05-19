// data/items.ts
export type ItemConfig = {
  id: string;
  name: string;
  category: "desk" | "chair" | "accessory";
  pricePerWeek: number; // e.g. 25000 (IDR)
  description: string;
  color: string; // hex for Three.js mesh material
  geometry: {
    width: number;
    height: number;
    depth: number;
  };
  position: [number, number, number]; // world position in scene
};
