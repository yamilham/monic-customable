"use client";

// components/scene/SceneCanvas.tsx
import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, SoftShadows } from "@react-three/drei";
import { SceneStage } from "./SceneStage";
import { useSetSceneReady } from "@/store/useConfigStore";

function SceneReadySignal() {
  const setReady = useSetSceneReady(); // stable function ref

  useEffect(() => {
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
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <SoftShadows size={18} samples={14} focus={0.5} />

      <Suspense fallback={null}>
        <SceneStage />
        <SceneReadySignal />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        zoomSpeed={0.5}
        minDistance={3.5}
        maxDistance={11}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.4}
        minAzimuthAngle={-Math.PI / 2.2}
        maxAzimuthAngle={Math.PI / 2.2}
        target={[0, 0.6, 0]}
        dampingFactor={0.06}
        enableDamping
      />
    </Canvas>
  );
}
