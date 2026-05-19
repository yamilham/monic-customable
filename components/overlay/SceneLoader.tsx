"use client";

// components/overlay/SceneLoader.tsx
import { useEffect, useRef } from "react";
import { useSceneReady } from "@/store/useConfigStore";
import { gsap } from "@/lib/gsap";

export function SceneLoader() {
  const isReady = useSceneReady(); // boolean
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReady && loaderRef.current) {
      gsap.to(loaderRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => {
          if (loaderRef.current) loaderRef.current.style.display = "none";
        },
      });
    }
  }, [isReady]);

  return (
    <div
      ref={loaderRef}
      className="absolute inset-0 z-50 bg-canvas flex flex-col items-center justify-center gap-5"
    >
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-ink flex items-center justify-center shadow-float">
          <span className="font-display text-3xl text-amber leading-none">
            M
          </span>
        </div>
        <div className="absolute inset-0 rounded-2xl border-2 border-amber/30 animate-spin [animation-duration:2s]" />
      </div>

      <div className="flex flex-col items-center gap-1">
        <p className="font-display text-xl text-ink">Monis</p>
        <p className="font-body text-[11px] text-ink-muted tracking-widest uppercase">
          Loading workspace…
        </p>
      </div>

      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-amber animate-bounce"
            style={{
              animationDelay: `${i * 0.15}s`,
              animationDuration: "0.8s",
            }}
          />
        ))}
      </div>
    </div>
  );
}
