"use client";

// components/scene/DeskObject.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Desk primitive built from BoxGeometry parts:
//   - Tabletop slab
//   - 4 legs
//   - Subtle under-shelf (cable tray detail)
// Geometry & color driven by the selected ItemConfig from the store.
// GSAP swap animation fires on selection change via useMeshSwap.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useState, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { useConfigStore } from "@/store/useConfigStore";
import { ALL_ITEMS } from "@/data/items";
import { useMeshSwap } from "./useMeshSwap";

export function DeskObject() {
  const groupRef = useRef<Group>(null!);

  const selectedDesk = useConfigStore((s) => s.selectedDesk);
  const [displayId, setDisplayId] = useState(selectedDesk);

  const item = ALL_ITEMS.find((i) => i.id === displayId);
  const {
    width: W,
    height: H,
    depth: D,
  } = item?.geometry ?? { width: 2.2, height: 0.08, depth: 1.0 };
  const color = item?.color ?? "#D4C5A9";

  // Leg colour — slightly darker than surface
  const legColor = shadeColor(color, -18);

  const onSwap = useCallback(() => {
    setDisplayId(useConfigStore.getState().selectedDesk);
  }, []);

  useMeshSwap(groupRef, { category: "desk", onSwap });

  // Gentle idle float
  const floatRef = useRef(0);
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    floatRef.current += delta;
    groupRef.current.position.y =
      (item?.placement.position[1] ?? 0.74) +
      Math.sin(floatRef.current * 0.6) * 0.008;
  });

  const LEG_H = 0.72;
  const LEG_W = 0.055;
  const LEG_INSET_X = W / 2 - 0.1;
  const LEG_INSET_Z = D / 2 - 0.08;
  const LEG_Y = -LEG_H / 2 - H / 2;

  return (
    <group
      ref={groupRef}
      position={item?.placement.position ?? [0, 0.74, 0]}
      scale={[0, 0, 0]} // GSAP animates to [1,1,1]
      castShadow
    >
      {/* ── Tabletop ── */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial color={color} roughness={0.55} metalness={0.04} />
      </mesh>

      {/* ── Front-left lip edge ── gives desk a slight beveled feel */}
      <mesh position={[0, -H / 2 - 0.006, D / 2]}>
        <boxGeometry args={[W, 0.012, 0.012]} />
        <meshStandardMaterial color={legColor} roughness={0.6} />
      </mesh>

      {/* ── Four legs ── */}
      {[
        [LEG_INSET_X, LEG_Y, LEG_INSET_Z],
        [-LEG_INSET_X, LEG_Y, LEG_INSET_Z],
        [LEG_INSET_X, LEG_Y, -LEG_INSET_Z],
        [-LEG_INSET_X, LEG_Y, -LEG_INSET_Z],
      ].map(([x, y, z], i) => (
        <mesh key={i} castShadow position={[x, y, z]}>
          <boxGeometry args={[LEG_W, LEG_H, LEG_W]} />
          <meshStandardMaterial
            color={legColor}
            roughness={0.45}
            metalness={0.18}
          />
        </mesh>
      ))}

      {/* ── Cross-brace (back, connects rear legs) ── */}
      <mesh castShadow position={[0, LEG_Y + 0.18, -LEG_INSET_Z]}>
        <boxGeometry args={[W - 0.22, 0.03, LEG_W]} />
        <meshStandardMaterial
          color={legColor}
          roughness={0.5}
          metalness={0.15}
        />
      </mesh>

      {/* ── Cable tray under the desk ── */}
      <mesh position={[0, -H / 2 - 0.06, -D / 2 + 0.18]}>
        <boxGeometry args={[W * 0.55, 0.018, 0.12]} />
        <meshStandardMaterial
          color={legColor}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

/** Darken/lighten a hex color by `amount` (-255 to 255) */
function shadeColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}
