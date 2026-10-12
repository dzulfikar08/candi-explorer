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

1. Create `src/candi/<name>/` and implement `CandiDefinition` from `src/candi/types.ts`.
2. Keep plan geometry (measurements, counts) separate from mesh building, like
   `borobudur/layout.ts` vs `borobudur/model.ts`, and test the layout.
3. Provide hotspots, a tour, and a walk spawn point.
4. Open an issue with the "New candi" template before starting, so work isn't duplicated.

## Commit messages

Imperative mood, one line summary under ~72 characters, details in the body if needed
(e.g. `Add Prambanan Shiva temple layout`).

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
