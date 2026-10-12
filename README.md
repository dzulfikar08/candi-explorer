# Candi Explorer

[![CI](https://github.com/dzulfikar08/candi-explorer/actions/workflows/ci.yml/badge.svg)](https://github.com/dzulfikar08/candi-explorer/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Interactive 3D explorer for Indonesian temples (candi), built with Three.js + Vite. Starts with
**Candi Borobudur**.

**Live: https://candi-explorer.by.dzulfikar.com**

Requires a browser with WebGL 2. Walk mode needs a mouse and keyboard; orbit and the tour work on
touch devices.

## Development

Needs [Bun](https://bun.sh) 1.x.

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

Everything is procedural; there are no model or texture assets.

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
walk spawn point. Then pass it to `start()` in `src/main.ts`. See [CONTRIBUTING.md](CONTRIBUTING.md)
for the full checklist.

## Deploying

`bun run deploy` builds and publishes `dist/` as a Cloudflare Worker with static assets
(`wrangler.jsonc`). The config is pinned to the maintainer's account and custom domain; in a fork,
change `account_id` and `routes` (or drop `routes` and set `"workers_dev": true`). `dist/` is a
plain static site, so any static host works too.

## Promo card

Under the title, a card rotates (every 5 s) through other products by the same makers: data and
logic in `src/promo.ts`, icons in `public/ad-icons/`. Links carry `utm_source=candi-explorer`. It
pauses on hover or focus, stays still with reduced motion, hides in walk mode, and on phones shrinks
to a name pill and hides during the tour. "Your product here" opens an email for sponsor slots.
Forks should replace or remove it.

## Contributing

Bug reports, accuracy corrections with sources, and new candi are welcome. Read
[CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md). Report security
issues privately as described in [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE) © Dzulfikar Ats Tsauri

The product names and icons in `public/ad-icons/` are trademarks of their owners and are not
covered by the MIT license.
