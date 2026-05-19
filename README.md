# Monis — 3D Office Configurator

An interactive 3D office equipment rental configurator. Browse desks, chairs, and accessories, see them appear live in a 3D scene, and rent your full setup — weekly.

---

## Approach

The build was structured as four time-boxed phases: data & state layer, UI overlay, 3D scene, then integration. Separating concerns early meant the UI team and 3D scene could be developed independently against the same Zustand store, with zero shared component coupling. The store was designed around a `swapSignal` counter per category — a single integer increment that 3D objects subscribe to, triggering GSAP swap animations without the scene ever needing to know what the UI is doing.

For the 3D scene, all objects are built from Three.js `BoxGeometry` and `CylinderGeometry` primitives rather than imported GLTF models. This kept the MVP scope tight and load time near-zero, while still producing recognisable silhouettes through deliberate proportions, leg details, armrests, caster wheels, and accent edges. A three-point lighting rig (warm key, cool fill, rim backlight) with `SoftShadows` gives the scene the warmth the brand palette calls for.

---

## Tech Choices

| Layer     | Choice                                     | Reason                                                                                                                   |
| --------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Framework | Next.js 14 App Router                      | Zero-config deploy to Vercel, RSC-ready for future server features                                                       |
| 3D        | `@react-three/fiber` + `@react-three/drei` | Declarative Three.js that lives inside React's render cycle cleanly                                                      |
| Animation | GSAP 3                                     | Precise timeline control over Three.js `mesh.scale` — CSS animations can't touch scene objects                           |
| State     | Zustand 5 with `subscribeWithSelector`     | Flat primitive selectors prevent object-ref re-renders in React 19; scene components subscribe only to their swap signal |
| Styling   | Tailwind CSS v4 + `@theme` block           | Design tokens live in CSS, not JS — no config file, faster HMR                                                           |
| UI        | shadcn/ui (Radix primitives)               | Accessible dialog and tabs without behaviour overhead                                                                    |
| Fonts     | DM Serif Display + DM Sans + DM Mono       | Coherent type family across display, body, and price figures                                                             |

---

## What I'd Improve With More Time

**3D fidelity** — Replace `BoxGeometry` primitives with purpose-built GLTF models per item. Even low-poly hand-modelled assets would dramatically improve the configurator's perceived value. Add a subtle HDRI environment map for realistic reflections on desk surfaces and chair materials.

**Accessory placement logic** — Currently accessories sit at a hardcoded world position. With more time, accessories would snap relative to the active desk's geometry — so a narrow standard desk positions items differently than a wide electrical desk.

**Responsive & mobile** — The current layout is desktop-first with fixed pixel positions. A proper mobile layout would stack the category panel as a bottom sheet and shift the scene camera to a front-facing isometric angle.

**Real rental flow** — The "Confirm Rental" button currently just closes the modal.

**Persistence** — Save a user's configuration to `localStorage` or a short shareable URL so they can return to or send their setup to a colleague.

**Info: Price tag** -- Add a price tag; weekly rental price for the item

---

## Project Structure

```
monis/
├── app/                    # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css         # Tailwind v4 @theme tokens
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── overlay/            # UI overlay (Header, CategoryPanel, ItemCard, RentModal, SummaryBar)
│   └── scene/              # R3F scene (Canvas, Floor, Desk, Chair, Accessory, Lighting)
├── data/
│   └── items.ts            # Single source of truth — geometry, pricing, placement
├── store/
│   └── useConfigStore.ts   # Zustand store with flat primitive selectors
└── lib/
    ├── gsap.ts             # Reusable GSAP animation helpers
    └── utils.ts            # cn() utility
```

## Running Locally

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Deploy

Push to GitHub and connect to [Vercel](https://vercel.com) — zero additional configuration required.
