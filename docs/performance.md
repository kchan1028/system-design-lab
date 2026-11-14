# Diagram bundle decision

`npm run build` warns that some chunks exceed 500 kB. The warning is accepted on purpose and kept visible rather than suppressed.

## What loads

Mermaid is imported dynamically by `src/Diagram.tsx`, so the entry bundle does not contain it. A page without a diagram, such as "Page not found", loads no Mermaid chunks; an end-to-end test checks this.

Since Mermaid 12, the ELK layout engine is bundled with `mermaid` and is the default layout for flowcharts. Every page here renders a flowchart, so each one fetches the ELK chunk (about 1.5 MB raw, about 466 kB gzip at build time).

Local measurement against `vite preview` in Chromium on 14 November 2026, Mermaid 12.3, three routes (overview, order study, RAG study):

| Layout | JavaScript files | Raw JavaScript | Diagram visible after navigation |
|---|---|---|---|
| ELK (default, kept) | 27 | 2,686 KB | 290 to 360 ms |
| Dagre (`layout: 'dagre'`) | 26 | 1,263 KB | 150 to 300 ms |

These numbers come from one local machine with a warm disk cache and no network throttling. They are not field data and do not predict load times on slow connections.

## Decision

Keep ELK. Side-by-side screenshots at desktop width showed ELK producing a taller layout with readable labels and grouped boundaries. Dagre laid the same diagrams out wide and scaled the text down, which matters more on a site whose purpose is reading architecture diagrams.

Costs accepted: roughly 1.4 MB more raw JavaScript per diagram page and the persistent build warning. Revisit if real-device measurements show slow diagram rendering, if Mermaid offers a smaller ELK build, or if pre-rendering diagrams to static SVG at build time becomes worthwhile; that last option would remove Mermaid from the browser entirely but adds a build step and a headless renderer.

## Intermittent CI timeout

A previous main run failed the five-second mobile order-diagram assertion and passed on rerun. Downloading and running ELK is a plausible contributor, but this was not proven and the failed run is no longer available to inspect. The assertion is unchanged.
