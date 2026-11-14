# System Design Lab

Original, hypothetical architecture case studies that make requirements, decisions, failure modes, security boundaries, and operational costs reviewable. No employer or customer material is used.

## Status

Milestone 1 supplies the responsive documentation shell, hash-based case-study navigation, and a lazy-loaded Mermaid renderer with readable source fallback. The architecture explorer adds keyboard-operable component inspection, directional dependencies, trust boundaries and failure recovery without interpreting Mermaid output as interactive controls. Milestone 2 adds the [Document Processing Platform study](src/document-processing.md), covering contracts, isolation, publication semantics, operations, capacity arithmetic and five ADRs. The [Event-Driven Order Processing study](src/event-driven-orders.md) adds an independent commerce saga design with outbox/inbox semantics, stock holds, payment uncertainty, compensation and reconciliation. The [Multi-Tenant SaaS Platform study](src/multi-tenant-saas.md) covers layered tenant isolation, current authorization, scoped exports and revocation-aware recovery. The [High-Traffic API Platform study](src/high-traffic-api.md) covers public cache eligibility, bounded freshness, rate limiting, overload handling and observability. The [RAG Document Search study](src/rag-document-search.md) covers permission-filtered hybrid retrieval, versioned index publication, deletion and ACL freshness, citation integrity, prompt-injection limits and an evaluation plan; no retrieval system or evaluation has been built or run. These are design exercises; this repository implements no backend for them.

## Browse the documentation

The site is published with GitHub Pages at [kchan1028.github.io/system-design-lab](https://kchan1028.github.io/system-design-lab/). Each merge to main is deployed by the Publish documentation workflow after the same checks as CI. Use the on-page contents to jump to a topic; section URLs can be shared and reloaded.

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

`npm run preview` serves the built `dist/` directory. Relative asset paths and hash routes support static subdirectory hosting without route rewrites. GitHub Pages publishes the verified static build after a merge to main. The deployment job alone has Pages/OIDC write access; PR checks remain read-only.

## Design and evidence

Case studies are independent exercises, not descriptions of deployed systems. Proposed targets and workload assumptions must be labelled. Capacity arithmetic is not measured performance. Only reproducible measurements may be called benchmarks.

The site uses React, Vite, TypeScript, plain CSS, react-markdown, and Mermaid. Markdown is repository-owned; raw HTML is not enabled. Mermaid runs in strict mode. Never render external diagram input without a separate security review.

## Interactive tradeoffs

The Document Processing Platform analyzer compares synchronous requests, queue/outbox workers and durable workflows. Edit duration, arrival pattern, recovery and operating-capacity assumptions, then apply them to update qualitative reasoning. Unknown values remain unresolved. Evidence notes do not alter the rules. State is local to the mounted page and resets on reload; there is no storage, telemetry or external service. Comparisons are authored hypotheses, not rankings, benchmarks or vendor quotes.

## Failure-handling evidence

Run `npm run simulate` to inspect deterministic duplicate-delivery, worker-crash, stale-lease, and deletion scenarios. [Model assumptions and limits](docs/simulation.md) explain what this demonstrates and what still needs real infrastructure tests. No throughput or production-correctness claim is made.

## Repository guide

- `src/content.ts`: original documentation and study index
- `src/App.tsx`: navigation and document layout
- `src/Diagram.tsx`: lazy diagram rendering, cleanup, and fallback
- `e2e/`: Chromium navigation, responsive layout (320 to 1440px), focus, history and automated axe checks. Manual screen-reader testing has not been performed.
- [Contributing](CONTRIBUTING.md), [Security](SECURITY.md), [Roadmap](docs/roadmap.md)

## License

No project license has been selected. Public availability does not grant a general license to reuse this project. Dependency licenses remain their own.
