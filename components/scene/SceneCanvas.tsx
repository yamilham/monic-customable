"use client";

// components/scene/SceneCanvas.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Root R3F Canvas. Owns:
//   - Perspective camera (position, fov)
//   - Three-point lighting rig
//   - Shadow configuration
//   - OrbitControls (constrained — no flip, limited polar)
//   - Suspense boundary with null fallback (SceneLoader handles UI)
//   - Signals scene-ready to Zustand once mounted
// ─────────────────────────────────────────────────────────────────────────────

import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, SoftShadows } from "@react-three/drei";
import { SceneStage } from "@/components/scene/SceneStage";
import { useSceneReady } from "@/store/useConfigStore";

function SceneReadySignal() {
  const { setReady } = useSceneReady();
  useEffect(() => {
    // Small delay so the canvas has painted at least one frame
    const t = setTimeout(() => setReady(true), 400);
    return () => clearTimeout(t);
  }, [setReady]);
  return null;
}

export function SceneCanvas() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{
        position: [4.5, 3.5, 5.5],
        fov: 42,
        near: 0.1,
        far: 100,
      }}
      gl={{
        antialias: true,
        alpha: false,
      }}
      style={{ background: "transparent" }}
    >
      {/* Soft shadow quality */}
      <SoftShadows size={18} samples={14} focus={0.5} />

      {/* Scene content inside Suspense */}
      <Suspense fallback={null}>
        <SceneStage />
        <SceneReadySignal />
      </Suspense>

      {/* ── OrbitControls ── constrained for a showroom feel */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        zoomSpeed={0.5}
        minDistance={3.5}
        maxDistance={11}
        minPolarAngle={Math.PI / 6} // 30° — never go below floor
        maxPolarAngle={Math.PI / 2.4} // ~75° — no top-down
        minAzimuthAngle={-Math.PI / 2.2}
        maxAzimuthAngle={Math.PI / 2.2}
        target={[0, 0.6, 0]}
        dampingFactor={0.06}
        enableDamping
      />
    </Canvas>
  );
}
