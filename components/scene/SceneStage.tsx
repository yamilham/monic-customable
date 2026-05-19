"use client";

// components/scene/SceneStage.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Composes the full 3D scene:
//   Floor → LightingRig → DeskObject → ChairObject → AccessoryObject
// This component lives inside the R3F Canvas / Suspense boundary.
// ─────────────────────────────────────────────────────────────────────────────

import { Floor } from "./Floor";
import { LightingRig } from "./LightingRig";
import { DeskObject } from "./DeskObject";
import { ChairObject } from "./ChairObject";
import { AccessoryObject } from "./AccessoryObject";

export function SceneStage() {
  return (
    <group>
      {/* Environment */}
      <LightingRig />
      <Floor />

      {/* Furniture — all placed in world space */}
      <DeskObject />
      <ChairObject />
      <AccessoryObject />
    </group>
  );
}