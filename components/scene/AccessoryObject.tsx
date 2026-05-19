"use client";

// components/scene/AccessoryObject.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Accessory primitives placed on top of the desk surface.
// Each accessory ID maps to a different mesh composition:
//
//   acc-ergo-keyboard   → split-body keyboard + wrist rest
//   acc-mech-keyboard   → compact TKL slab with key rows
//   acc-mouse           → vertical oval mouse body
//   acc-mousepad        → flat wide rectangle
//
// Placement is relative to the desk's top surface (y ≈ 0.79 world space).
// GSAP swap fires on selection change via useMeshSwap.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useState, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { useConfigStore } from "@/store/useConfigStore";
import { ALL_ITEMS } from "@/data/items";
import { useMeshSwap } from "./useMeshSwap";

export function AccessoryObject() {
  const groupRef = useRef<Group>(null!);

  const selectedAccessory = useConfigStore((s) => s.selectedAccessory);
  const [displayId, setDisplayId] = useState(selectedAccessory);

  const item = ALL_ITEMS.find((i) => i.id === displayId);
  const color = item?.color ?? "#E8E0D0";
  const pos = item?.placement.position ?? [0, 0.79, 0.25];

  const onSwap = useCallback(() => {
    setDisplayId(useConfigStore.getState().selectedAccessory);
  }, []);

  useMeshSwap(groupRef, { category: "accessory", onSwap });

  // Gentle hover
  const hoverRef = useRef(0);
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    hoverRef.current += delta;
    groupRef.current.position.y =
      pos[1] + Math.sin(hoverRef.current * 0.8) * 0.005;
  });

  return (
    <group ref={groupRef} position={pos} scale={[0, 0, 0]}>
      {displayId === "acc-ergo-keyboard" && <ErgoKeyboard color={color} />}
      {displayId === "acc-mech-keyboard" && <MechKeyboard color={color} />}
      {displayId === "acc-mouse" && <MouseObject color={color} />}
      {displayId === "acc-mousepad" && <MousePad color={color} />}
    </group>
  );
}

// ─── Sub-meshes ───────────────────────────────────────────────────────────────

function ErgoKeyboard({ color }: { color: string }) {
  const keyColor = shadeColor(color, -15);
  return (
    <group>
      {/* Left half */}
      <mesh castShadow position={[-0.14, 0, 0]} rotation={[0, 0.12, 0]}>
        <boxGeometry args={[0.22, 0.024, 0.175]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.05} />
      </mesh>
      {/* Right half */}
      <mesh castShadow position={[0.14, 0, 0]} rotation={[0, -0.12, 0]}>
        <boxGeometry args={[0.22, 0.024, 0.175]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.05} />
      </mesh>
      {/* Key rows — left */}
      {[0, 1, 2, 3].map((row) => (
        <mesh
          key={row}
          position={[-0.14, 0.014, -0.055 + row * 0.033]}
          rotation={[0, 0.12, 0]}
        >
          <boxGeometry args={[0.19, 0.006, 0.022]} />
          <meshStandardMaterial color={keyColor} roughness={0.5} />
        </mesh>
      ))}
      {/* Key rows — right */}
      {[0, 1, 2, 3].map((row) => (
        <mesh
          key={row}
          position={[0.14, 0.014, -0.055 + row * 0.033]}
          rotation={[0, -0.12, 0]}
        >
          <boxGeometry args={[0.19, 0.006, 0.022]} />
          <meshStandardMaterial color={keyColor} roughness={0.5} />
        </mesh>
      ))}
      {/* Wrist rest */}
      <mesh position={[0, -0.004, 0.115]}>
        <boxGeometry args={[0.42, 0.014, 0.055]} />
        <meshStandardMaterial color={shadeColor(color, 8)} roughness={0.8} />
      </mesh>
    </group>
  );
}

function MechKeyboard({ color }: { color: string }) {
  const keyColor = shadeColor(color, 28);
  const accentKey = "#E8A020";
  return (
    <group>
      {/* Body slab */}
      <mesh castShadow>
        <boxGeometry args={[0.37, 0.032, 0.135]} />
        <meshStandardMaterial color={color} roughness={0.45} metalness={0.08} />
      </mesh>
      {/* Angled front edge */}
      <mesh position={[0, 0.016, 0.068]} rotation={[0.18, 0, 0]}>
        <boxGeometry args={[0.37, 0.006, 0.012]} />
        <meshStandardMaterial color={shadeColor(color, -10)} roughness={0.4} />
      </mesh>
      {/* Key rows */}
      {[0, 1, 2, 3, 4].map((row) => (
        <mesh key={row} position={[0, 0.018, -0.042 + row * 0.022]}>
          <boxGeometry args={[0.35, 0.008, 0.016]} />
          <meshStandardMaterial color={keyColor} roughness={0.5} />
        </mesh>
      ))}
      {/* Accent keycap row (top fn row) */}
      <mesh position={[0, 0.018, -0.044]}>
        <boxGeometry args={[0.35, 0.009, 0.016]} />
        <meshStandardMaterial color={accentKey} roughness={0.45} />
      </mesh>
      {/* USB-C port */}
      <mesh position={[-0.187, 0, 0]}>
        <boxGeometry args={[0.004, 0.008, 0.014]} />
        <meshStandardMaterial color="#555" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function MouseObject({ color }: { color: string }) {
  return (
    <group>
      {/* Main body — vertical grip */}
      <mesh castShadow>
        <boxGeometry args={[0.072, 0.088, 0.115]} />
        <meshStandardMaterial color={color} roughness={0.55} metalness={0.06} />
      </mesh>
      {/* Rounded top dome */}
      <mesh position={[0, 0.046, -0.015]} scale={[1, 0.5, 1]}>
        <sphereGeometry args={[0.05, 14, 10]} />
        <meshStandardMaterial color={shadeColor(color, 8)} roughness={0.5} />
      </mesh>
      {/* Scroll wheel */}
      <mesh position={[0, 0.048, -0.018]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.009, 0.009, 0.038, 10]} />
        <meshStandardMaterial color="#777" roughness={0.4} metalness={0.4} />
      </mesh>
      {/* Side buttons */}
      {[-0.025, 0.01].map((z, i) => (
        <mesh key={i} position={[0.038, 0.022, z]}>
          <boxGeometry args={[0.006, 0.012, 0.022]} />
          <meshStandardMaterial color={shadeColor(color, 15)} roughness={0.6} />
        </mesh>
      ))}
      {/* USB-C base */}
      <mesh position={[0, -0.046, 0.04]}>
        <boxGeometry args={[0.014, 0.006, 0.01]} />
        <meshStandardMaterial color="#444" metalness={0.7} roughness={0.2} />
      </mesh>
    </group>
  );
}

function MousePad({ color }: { color: string }) {
  return (
    <group>
      {/* Main pad surface */}
      <mesh receiveShadow>
        <boxGeometry args={[0.88, 0.004, 0.38]} />
        <meshStandardMaterial color={color} roughness={0.92} metalness={0.0} />
      </mesh>
      {/* Stitched edge border — 4 sides */}
      {/* Front */}
      <mesh position={[0, 0.003, 0.192]}>
        <boxGeometry args={[0.88, 0.003, 0.006]} />
        <meshStandardMaterial color="#E8A020" roughness={0.7} />
      </mesh>
      {/* Back */}
      <mesh position={[0, 0.003, -0.192]}>
        <boxGeometry args={[0.88, 0.003, 0.006]} />
        <meshStandardMaterial color="#E8A020" roughness={0.7} />
      </mesh>
      {/* Left */}
      <mesh position={[-0.444, 0.003, 0]}>
        <boxGeometry args={[0.006, 0.003, 0.38]} />
        <meshStandardMaterial color="#E8A020" roughness={0.7} />
      </mesh>
      {/* Right */}
      <mesh position={[0.444, 0.003, 0]}>
        <boxGeometry args={[0.006, 0.003, 0.38]} />
        <meshStandardMaterial color="#E8A020" roughness={0.7} />
      </mesh>
      {/* Rubber base lip */}
      <mesh position={[0, -0.004, 0]}>
        <boxGeometry args={[0.875, 0.003, 0.375]} />
        <meshStandardMaterial color="#111111" roughness={0.95} />
      </mesh>
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
