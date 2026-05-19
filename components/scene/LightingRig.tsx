"use client";

// components/scene/LightingRig.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Three-point lighting rig:
//   1. Key light   — warm directional from upper-right, casts shadows
//   2. Fill light  — cool soft from upper-left, no shadow (lifts blacks)
//   3. Rim light   — warm backlight from behind, defines silhouette
//   4. Ambient     — very low base so nothing goes pure black
//   5. Hemisphere  — sky/ground colour bleed for realism
// ─────────────────────────────────────────────────────────────────────────────

export function LightingRig() {
  return (
    <>
      {/* ── Ambient base ── */}
      <ambientLight
        intensity={0.35}
        color="#FFF5E0" // warm white
      />

      {/* ── Hemisphere — sky warm, ground cool ── */}
      <hemisphereLight args={["#FFE8B0", "#C8B89A", 0.45]} />

      {/* ── Key light — warm, upper-right, shadow-casting ── */}
      <directionalLight
        position={[5, 7, 4]}
        intensity={1.6}
        color="#FFE4A0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-bias={-0.0003}
        shadow-normalBias={0.02}
      />

      {/* ── Fill light — cool, upper-left, no shadow ── */}
      <directionalLight
        position={[-4, 5, 2]}
        intensity={0.55}
        color="#D0E8FF"
      />

      {/* ── Rim / backlight — warm, behind scene ── */}
      <directionalLight
        position={[-1, 4, -5]}
        intensity={0.7}
        color="#FFD080"
      />

      {/* ── Under-floor bounce (very subtle) ── */}
      <pointLight
        position={[0, -0.5, 0]}
        intensity={0.12}
        color="#E8C870"
        distance={6}
      />
    </>
  );
}
