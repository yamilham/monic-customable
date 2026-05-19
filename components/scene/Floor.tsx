"use client";

// components/scene/Floor.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Scene floor: a flat BoxGeometry platform.
// Two layers:
//   1. Main floor slab  — warm cream, receives shadows
//   2. Thin rim/edge    — slightly darker, gives depth to the platform
//   3. Subtle disc glow — faked ambient occlusion pool under furniture
// ─────────────────────────────────────────────────────────────────────────────

export function Floor() {
  return (
    <group>
      {/* ── Main floor slab ── */}
      <mesh
        receiveShadow
        position={[0, -0.05, 0]}
        rotation={[0, 0, 0]}
      >
        <boxGeometry args={[14, 0.1, 9]} />
        <meshStandardMaterial
          color="#E8DFC8"
          roughness={0.88}
          metalness={0.0}
        />
      </mesh>

      {/* ── Platform rim — slightly darker edge for depth ── */}
      <mesh position={[0, -0.11, 0]}>
        <boxGeometry args={[14.12, 0.04, 9.12]} />
        <meshStandardMaterial
          color="#C8B99A"
          roughness={0.92}
          metalness={0.0}
        />
      </mesh>

      {/* ── Fake AO disc — dark ellipse under the furniture zone ── */}
      <mesh
        position={[0, -0.001, 0.6]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ellipseGeometry args={[2.2, 1.4, 48]} />
        <meshBasicMaterial
          color="#8B7355"
          transparent
          opacity={0.07}
          depthWrite={false}
        />
      </mesh>

      {/* ── Soft spotlight pool on floor (visual warmth) ── */}
      <mesh
        position={[0, -0.002, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[4.5, 64]} />
        <meshBasicMaterial
          color="#FFE8A0"
          transparent
          opacity={0.06}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}