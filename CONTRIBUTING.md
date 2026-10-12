# Contributing

Thanks for helping. Bug fixes, accuracy corrections, performance work and new candi are all welcome.

## Setup

You need [Bun](https://bun.sh) 1.x and a browser with WebGL 2.

```bash
git clone https://github.com/dzulfikar08/candi-explorer.git
cd candi-explorer
bun install
bun run dev
```

## Before opening a pull request

Run the same checks CI runs:

```bash
bun run typecheck
bun run test
bun run build
```

Then open the app and exercise what you changed: orbit, walk (mouse and keyboard), the pradaksina
tour, and a narrow mobile viewport if you touched the UI.

## Guidelines

- **Keep it procedural.** The model is generated in code; there are no model or texture files. If
  you think a change needs an external asset, open an issue first so we can discuss licensing and
  bundle size.
- **Cite your sources.** Dimensions, counts, orientation and historical notes should come from a
  published source. Put the reference in the PR description, and in a code comment when the number
  isn't obvious.
- **Say when you simplify.** If geometry departs from the real monument (for walkability or
  performance), add it to "Known simplifications" in the README.
- **Test the data, not the wiring.** Layout counts and geometry invariants belong in
  `*.test.ts` next to the layout (see `src/candi/borobudur/layout.test.ts`).
- **One concern per PR.** Small focused PRs get reviewed faster.

## Adding a new candi

1. Open an issue with the "New candi" template before starting, so work isn't duplicated.
2. Create `src/candi/<id>/index.ts` exporting a `CandiDefinition` (`src/candi/types.ts`) and add one
   line for it to `src/candi/index.ts`. Start from `src/candi/mendut/index.ts`.
3. Build it with the shared kit in `src/candi/kit/` where you can: a `ShrineSpec` per temple form
   and `buildCompound` for the site. Write custom geometry only for what the kit can't express
   (Borobudur, gates, bathing places), inside the temple's own folder. If the kit needs a new
   feature, add it there as a separate change.
4. Put sources in the file header and keep every dimension, count and date traceable to them. Say
   in the notes where the model departs from the real temple.
5. Provide hotspots, topics and a tour; check that each hotspot view frames its subject.
6. When a temple has published counts or heights, test them (see `prambanan/layout.test.ts`).

## Commit messages

Imperative mood, one line summary under ~72 characters, details in the body if needed
(e.g. `Add Prambanan Shiva temple layout`).

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
