// ─────────────────────────────────────────────────────────────────────────────
// lib/gsap.ts
// Centralised GSAP helpers for both 3D scene and UI animations.
// Import from here — never import gsap directly in components.
// ─────────────────────────────────────────────────────────────────────────────

import gsap from "gsap";
import type { Object3D } from "three";

// ─── Re-export gsap instance ──────────────────────────────────────────────────
export { gsap };

// ─── Three.js Object Animations ──────────────────────────────────────────────

/**
 * Animate a Three.js object entering the scene.
 * Scales from 0 → 1 on all axes with a spring-like overshoot.
 */
export function animateObjectIn(
  object: Object3D,
  options: {
    duration?: number;
    delay?: number;
    onComplete?: () => void;
  } = {},
): gsap.core.Tween {
  const { duration = 0.5, delay = 0, onComplete } = options;

  // Start from zero scale
  object.scale.set(0, 0, 0);

  return gsap.to(object.scale, {
    x: 1,
    y: 1,
    z: 1,
    duration,
    delay,
    ease: "back.out(1.4)",
    onComplete,
  });
}

/**
 * Animate a Three.js object leaving the scene.
 * Scales down to 0 on all axes.
 */
export function animateObjectOut(
  object: Object3D,
  options: {
    duration?: number;
    delay?: number;
    onComplete?: () => void;
  } = {},
): gsap.core.Tween {
  const { duration = 0.3, delay = 0, onComplete } = options;

  return gsap.to(object.scale, {
    x: 0,
    y: 0,
    z: 0,
    duration,
    delay,
    ease: "power2.in",
    onComplete,
  });
}

/**
 * Swap animation: scale out old → scale in new.
 * Used when user changes item selection.
 */
export function animateSwap(
  object: Object3D,
  onMidpoint: () => void,
  options: {
    outDuration?: number;
    inDuration?: number;
  } = {},
): void {
  const { outDuration = 0.22, inDuration = 0.45 } = options;

  // Kill any running tweens on this object's scale
  gsap.killTweensOf(object.scale);

  gsap.to(object.scale, {
    x: 0,
    y: 0,
    z: 0,
    duration: outDuration,
    ease: "power2.in",
    onComplete: () => {
      // Swap the geometry/material at the invisible midpoint
      onMidpoint();

      gsap.to(object.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: inDuration,
        ease: "back.out(1.6)",
      });
    },
  });
}

/**
 * Float animation — gentle perpetual Y hover for selected objects.
 */
export function animateFloat(
  object: Object3D,
  options: {
    amplitude?: number;
    duration?: number;
  } = {},
): gsap.core.Tween {
  const { amplitude = 0.04, duration = 2.2 } = options;
  const baseY = object.position.y;

  return gsap.to(object.position, {
    y: baseY + amplitude,
    duration,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  });
}

/**
 * Stop float animation and return object to base Y.
 */
export function stopFloat(object: Object3D, baseY: number): void {
  gsap.killTweensOf(object.position);
  gsap.to(object.position, { y: baseY, duration: 0.3, ease: "power2.out" });
}

// ─── UI / DOM Animations ──────────────────────────────────────────────────────

/**
 * Animate a DOM element sliding in from below with fade.
 */
export function animatePanelIn(
  el: HTMLElement,
  options: { delay?: number } = {},
): gsap.core.Tween {
  return gsap.fromTo(
    el,
    { opacity: 0, y: 16 },
    {
      opacity: 1,
      y: 0,
      duration: 0.35,
      delay: options.delay ?? 0,
      ease: "power3.out",
    },
  );
}

/**
 * Animate a card popping in with scale + fade.
 */
export function animateCardIn(el: HTMLElement): gsap.core.Tween {
  return gsap.fromTo(
    el,
    { opacity: 0, scale: 0.94, y: 8 },
    { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out(1.2)" },
  );
}

/**
 * Stagger animate a list of elements.
 */
export function animateStaggerIn(
  els: HTMLElement[] | NodeListOf<Element>,
  options: { stagger?: number; delay?: number } = {},
): gsap.core.Tween {
  return gsap.fromTo(
    els,
    { opacity: 0, y: 10 },
    {
      opacity: 1,
      y: 0,
      duration: 0.28,
      stagger: options.stagger ?? 0.06,
      delay: options.delay ?? 0,
      ease: "power2.out",
    },
  );
}
