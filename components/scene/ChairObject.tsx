"use client";

// components/scene/ChairObject.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Chair primitive built from BoxGeometry / CylinderGeometry parts:
//   - Seat pad
//   - Backrest (taller for ergonomic, shorter for standard)
//   - Armrests
//   - Gas-lift column
//   - 5-star base arms
//   - 5 caster wheels
// Geometry & colour driven by the selected ItemConfig.
// GSAP swap fires on selection change via useMeshSwap.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useState, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { useConfigStore } from "@/store/useConfigStore";
import { ALL_ITEMS } from "@/data/items";
import { useMeshSwap } from "./useMeshSwap";

export function ChairObject() {
  const groupRef = useRef<Group>(null!);

  const selectedChair = useConfigStore((s) => s.selectedChair);
  const [displayId, setDisplayId] = useState(selectedChair);

  const item = ALL_ITEMS.find((i) => i.id === displayId);
  const color = item?.color ?? "#2C2C2C";
  const isGaming = displayId === "chair-gaming";
  const isStandard = displayId === "chair-standard";

  const onSwap = useCallback(() => {
    setDisplayId(useConfigStore.getState().selectedChair);
  }, []);

  useMeshSwap(groupRef, { category: "chair", onSwap });

  // Gentle idle sway
  const swayRef = useRef(0);
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    swayRef.current += delta;
    groupRef.current.rotation.y = Math.sin(swayRef.current * 0.35) * 0.04;
    groupRef.current.position.y =
      (item?.placement.position[1] ?? 0.45) +
      Math.sin(swayRef.current * 0.55) * 0.006;
  });

  const pos = item?.placement.position ?? [0, 0.45, 1.4];

  // Derived dimensions
  const seatW = isGaming ? 0.58 : isStandard ? 0.5 : 0.55;
  const seatD = isGaming ? 0.58 : isStandard ? 0.48 : 0.52;
  const seatH = 0.075;
  const backH = isGaming ? 0.88 : isStandard ? 0.52 : 0.72;
  const backW = seatW - 0.04;
  const backT = 0.07;
  const armH = isStandard ? 0 : 0.22; // standard has no armrests
  const columnH = 0.42;
  const baseRadius = 0.34;

  const bodyColor = color;
  const frameColor = shadeColor(color, isGaming ? 10 : -20);
  const darkColor = "#1A1A1A";
  const casterColor = "#222222";

  return (
    <group ref={groupRef} position={pos} scale={[0, 0, 0]}>
      {/* ── Seat cushion ── */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[seatW, seatH, seatD]} />
        <meshStandardMaterial
          color={bodyColor}
          roughness={0.75}
          metalness={0.04}
        />
      </mesh>

      {/* ── Seat front chamfer highlight ── */}
      <mesh position={[0, -seatH / 2 - 0.004, seatD / 2]}>
        <boxGeometry args={[seatW, 0.008, 0.008]} />
        <meshStandardMaterial color={frameColor} roughness={0.5} />
      </mesh>

      {/* ── Backrest ── */}
      <mesh
        castShadow
        position={[0, seatH / 2 + backH / 2 + 0.01, -seatD / 2 + backT / 2]}
      >
        <boxGeometry args={[backW, backH, backT]} />
        <meshStandardMaterial
          color={bodyColor}
          roughness={0.7}
          metalness={0.04}
        />
      </mesh>

      {/* ── Backrest lumbar ridge ── */}
      <mesh
        position={[0, seatH / 2 + backH * 0.28, -seatD / 2 + backT + 0.008]}
      >
        <boxGeometry args={[backW * 0.7, backH * 0.18, 0.018]} />
        <meshStandardMaterial
          color={shadeColor(bodyColor, 12)}
          roughness={0.6}
        />
      </mesh>

      {/* ── Headrest (ergonomic + gaming only) ── */}
      {!isStandard && (
        <mesh
          castShadow
          position={[0, seatH / 2 + backH + 0.06, -seatD / 2 + backT / 2]}
        >
          <boxGeometry args={[backW * 0.62, 0.18, backT + 0.02]} />
          <meshStandardMaterial
            color={isGaming ? shadeColor(bodyColor, 18) : bodyColor}
            roughness={0.65}
          />
        </mesh>
      )}

      {/* ── Armrests (not on standard) ── */}
      {armH > 0 && (
        <>
          {[-1, 1].map((side) => (
            <group key={side} position={[side * (seatW / 2 + 0.025), 0, 0]}>
              {/* Vertical post */}
              <mesh castShadow position={[0, armH / 2, -seatD * 0.05]}>
                <boxGeometry args={[0.028, armH, 0.028]} />
                <meshStandardMaterial
                  color={frameColor}
                  roughness={0.4}
                  metalness={0.2}
                />
              </mesh>
              {/* Horizontal pad */}
              <mesh position={[0, armH, -seatD * 0.05]}>
                <boxGeometry args={[0.06, 0.022, seatD * 0.55]} />
                <meshStandardMaterial color={darkColor} roughness={0.85} />
              </mesh>
            </group>
          ))}
        </>
      )}

      {/* ── Gas-lift column ── */}
      <mesh castShadow position={[0, -seatH / 2 - columnH / 2, 0]}>
        <cylinderGeometry args={[0.028, 0.038, columnH, 12]} />
        <meshStandardMaterial
          color="#444444"
          roughness={0.3}
          metalness={0.55}
        />
      </mesh>

      {/* ── 5-star base ── */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2;
        const bx = Math.cos(angle) * baseRadius;
        const bz = Math.sin(angle) * baseRadius;
        return (
          <mesh
            key={i}
            castShadow
            position={[bx / 2, -seatH / 2 - columnH - 0.018, bz / 2]}
            rotation={[0, -angle, 0]}
          >
            <boxGeometry args={[baseRadius, 0.022, 0.042]} />
            <meshStandardMaterial
              color={darkColor}
              roughness={0.5}
              metalness={0.3}
            />
          </mesh>
        );
      })}

      {/* ── 5 caster wheels ── */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2;
        const cx = Math.cos(angle) * baseRadius;
        const cz = Math.sin(angle) * baseRadius;
        return (
          <mesh
            key={i}
            castShadow
            position={[cx, -seatH / 2 - columnH - 0.04, cz]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.038, 0.038, 0.035, 10]} />
            <meshStandardMaterial color={casterColor} roughness={0.7} />
          </mesh>
        );
      })}
    </group>
  );
}

function shadeColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}
