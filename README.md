# System Design Lab

Original, hypothetical architecture case studies that make requirements, decisions, failure modes, security boundaries, and operational costs reviewable. No employer or customer material is used.

## Status

Six design studies are published, each opening with an answer-first summary of its critical path. None has a backend; they are design exercises, and no measured production result is claimed.

- [Open Source Voice Platform](src/global-voice-platform.md): regional SIP and WebRTC calling with OpenSIPS, MediaProxy and rtpengine, Asterisk load balancing, quality-aware least cost routing, prepaid billing and a LAMP reseller system.
- [Document Processing Platform](src/document-processing.md): durable ingestion, sandboxed extraction, fenced publication, capacity arithmetic and five ADRs.
- [Event-Driven Order Processing](src/event-driven-orders.md): an orchestrated saga with outbox and inbox, stock holds, uncertain payments, compensation and reconciliation.
- [Multi-Tenant SaaS Platform](src/multi-tenant-saas.md): layered tenant isolation, per-operation authorization, scoped exports and revocation-aware recovery.
- [High-Traffic API Platform](src/high-traffic-api.md): public cache eligibility, a bounded freshness envelope, quotas, admission control and observability.
- [RAG Document Search](src/rag-document-search.md): permission-filtered hybrid retrieval, versioned indexes, deletion and access freshness, citation integrity, prompt-injection limits and an evaluation plan. No retrieval system or evaluation has been built or run.

Two interactive tools exist, for the Document Processing Platform only: a keyboard-operable architecture explorer and an assumption-driven tradeoff analyzer. The site shell provides hash routing, shareable section links and lazy-loaded Mermaid diagrams with a readable source fallback.

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

`npm run build` also prerenders a static, crawlable page for each study at `studies/<id>/` and writes `sitemap.xml`; those pages hand over to the interactive hash route when JavaScript loads. Run the build before `npm run test:e2e`, which checks the built pages. `npm run preview` serves the built `dist/` directory. Relative asset paths and hash routes support static subdirectory hosting without route rewrites. GitHub Pages publishes the verified static build after a merge to main. The deployment job alone has Pages/OIDC write access; PR checks remain read-only.

## Design and evidence

Case studies are independent exercises, not descriptions of deployed systems. Proposed targets and workload assumptions must be labelled. Capacity arithmetic is not measured performance. Only reproducible measurements may be called benchmarks.

The site uses React, Vite, TypeScript, plain CSS, react-markdown, and Mermaid. Markdown is repository-owned; raw HTML is not enabled. Mermaid runs in strict mode. Never render external diagram input without a separate security review. Mermaid is loaded only when a diagram renders and keeps its default ELK layout for readability; the resulting large-chunk build warning is an accepted, [measured tradeoff](docs/performance.md).

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
