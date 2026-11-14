# System Design Lab

Original, hypothetical architecture case studies that make requirements, decisions, failure modes, security boundaries, and operational costs reviewable. No employer or customer material is used.

## Status

Milestone 1 supplies the responsive documentation shell, hash-based case-study navigation, and a lazy-loaded Mermaid renderer with readable source fallback. The architecture explorer adds keyboard-operable component inspection, directional dependencies, trust boundaries and failure recovery without interpreting Mermaid output as interactive controls. Milestone 2 adds the [Document Processing Platform study](src/document-processing.md), covering contracts, isolation, publication semantics, operations, capacity arithmetic and five ADRs. This repository does not implement a document-processing backend.

## Browse the documentation

The planned GitHub Pages address is [System Design Lab](https://kchan1028.github.io/system-design-lab/). Publication is verified separately from this source change. Use the on-page contents to jump to a topic; section URLs can be shared and reloaded.

## Run locally

Use Node.js 24 and npm. No environment variables, account, or credentials are needed.

```sh
npm ci
npm run dev
```

Open the address printed by Vite. To validate:

```sh
npm test
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

`npm run preview` serves the built `dist/` directory. Relative asset paths and hash routes support static subdirectory hosting without route rewrites. GitHub Pages publishes the verified static build after a merge to main. The deployment job alone has Pages/OIDC write access; PR checks remain read-only. The expected public URL is https://kchan1028.github.io/system-design-lab/.

## Design and evidence

Case studies are independent exercises, not descriptions of deployed systems. Proposed targets and workload assumptions must be labelled. Capacity arithmetic is not measured performance. Only reproducible measurements may be called benchmarks.

The site uses React, Vite, TypeScript, plain CSS, react-markdown, and Mermaid. Markdown is repository-owned; raw HTML is not enabled. Mermaid runs in strict mode. Never render external diagram input without a separate security review.

## Failure-handling evidence

Run `npm run simulate` to inspect deterministic duplicate-delivery, worker-crash, stale-lease, and deletion scenarios. [Model assumptions and limits](docs/simulation.md) explain what this demonstrates and what still needs real infrastructure tests. No throughput or production-correctness claim is made.

## Repository guide

- `src/content.ts`: original documentation and study index
- `src/App.tsx`: navigation and document layout
- `src/Diagram.tsx`: lazy diagram rendering, cleanup, and fallback
- `e2e/`: Chromium navigation, responsive layout, and automated accessibility checks
- [Contributing](CONTRIBUTING.md), [Security](SECURITY.md), [Roadmap](docs/roadmap.md)

## License

No project license has been selected. Public availability does not grant a general license to reuse this project. Dependency licenses remain their own.
