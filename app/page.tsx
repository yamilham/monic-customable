"use client";

// app/page.tsx — Phase 3: 3D canvas wired in
import dynamic from "next/dynamic";
import {
  Header,
  CategoryPanel,
  ItemCard,
  RentModal,
  SummaryBar,
  SceneLoader,
} from "@/components/overlay/Index";

// Dynamic import — Three.js must never run on the server
const SceneCanvas = dynamic(
  () => import("@/components/scene/SceneCanvas").then((m) => m.SceneCanvas),
  { ssr: false },
);

export default function HomePage() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-canvas">
      {/* Loading overlay — fades out once scene signals ready */}
      <SceneLoader />

      {/* 3D Canvas — fills entire background */}
      <div className="absolute inset-0 z-0">
        <SceneCanvas />
      </div>

      {/* UI Overlay layer */}
      <Header />
      <CategoryPanel />
      <ItemCard />
      <SummaryBar />
      <RentModal />
    </main>
  );
}
