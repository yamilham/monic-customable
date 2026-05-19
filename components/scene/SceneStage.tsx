"use client";

// components/scene/SceneStage.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Composes the full 3D scene:
//   Floor → LightingRig → DeskObject → ChairObject → AccessoryObject
// This component lives inside the R3F Canvas / Suspense boundary.
// ─────────────────────────────────────────────────────────────────────────────

import { Floor } from "@/components/scene/Floor";
import { LightingRig } from "@/components/scene/LightingRig";
import { DeskObject } from "@/components/scene/DeskObject";
// import { ChairObject } from "@/components/scene/ChairObject";
// import { AccessoryObject } from "@/components/scene/AccessoryObject";

export function SceneStage() {
  return (
    <group>
      {/* Environment */}
      <LightingRig />
      <Floor />

      {/* Furniture — all placed in world space */}
      <DeskObject />
      {/* <ChairObject /> */}
      {/* <AccessoryObject /> */}
    </group>
  );
}
