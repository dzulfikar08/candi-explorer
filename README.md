# Candi Explorer

Interactive 3D explorer for Indonesian temples (candi), built with Three.js + Vite. Starts with
**Candi Borobudur**.

```bash
bun install
bun run dev        # http://localhost:5173
bun run build      # static site in dist/
bun run typecheck
bun run test
```

## What you can do

- **Orbit**: drag to rotate, scroll to zoom. Numbered markers fly the camera to a feature and open
  its notes (hidden foot, Buddha niches, east stairway, first gallery, circular terraces, perforated
  stupa, main stupa, Merapi & Merbabu).
- **Walk**: first-person, `W A S D` / arrows, `Shift` to hurry, click to capture the mouse, `Esc` to
  release. Stairs are climbable and walls block you. Needs a mouse and keyboard.
- **Pradaksina tour**: walks the pilgrim route: enter from the east, circle every level clockwise,
  climb the east stairway, finish at the main stupa. Notes follow the section; pause, skip, 1–8× speed.
- **Three realms**: tints Kamadhatu / Rupadhatu / Arupadhatu.
- **Time of day** (WIB): real solar position for Borobudur's latitude/longitude and today's date,
  with morning mist over the Kedu Plain.

## How the model is made

Everything is procedural; there are no model or image assets.

- `src/candi/borobudur/layout.ts`: plan geometry in metres: redented square terraces, stair
  notches, niche and stupa placement, stair flights. Counts follow published figures (432 niched
  Buddhas as 104/104/88/72/64, 72 perforated stupas as 32/24/16); `layout.test.ts` checks them.
- `model.ts` builds merged meshes per realm and material, plus instanced niches, statues and stupas.
  `sculpture.ts` has the Buddha (hands per mudra by facing direction), niche, stupa and main stupa.
- `src/render/stone.ts` paints andesite masonry, paving, relief panels and stupa lattice alpha maps
  on canvases at startup.
- `src/render/environment.ts`: sky, sun, mist, terrain, trees, and horizon volcanoes placed at their
  true bearings with their true angular height.

Known simplifications: the upper corridors are 3 m apart instead of the real ~2 m so they can be
walked, carving is stylised, and the stairs are steep approximations.

## Adding another candi

Implement a `CandiDefinition` (`src/candi/types.ts`): topics, hotspots, horizon landmarks, a home
camera view, and a `build(textures)` that returns the model, collidable meshes, tour sections and a
walk spawn point. Then pass it to `start()` in `src/main.ts`.
