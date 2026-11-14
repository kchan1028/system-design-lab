# Roadmap

## Milestone 1: foundation

Responsive React/Vite/TypeScript documentation, honest planned study navigation, Mermaid with source fallback, tests, read-only CI, contributing and security guidance. No hosting or license selection.

## Milestone 2: separate content PR

Document Processing Platform: requirements and exclusions, architecture, APIs, tenant-scoped data model, threat boundaries, retry and idempotency semantics, failure recovery, observability, explicit cost/capacity arithmetic, ADRs, alternatives, and open questions. Original hypothetical design only.

## Milestone 3: architecture explorer (review checkpoint)

Native component buttons grouped by boundary; directional connection navigation; responsibilities, security and failure recovery. The Document Processing Platform is the first data set. Keep the existing full-flow Mermaid diagram. Review this component schema and interaction before extending it to more studies.

## Remaining milestones

- Editable assumptions and qualitative architecture tradeoff comparisons, with no invented precision.
- Independent event-driven orders, multi-tenant SaaS, high-traffic API and RAG search studies.
- Cross-study mobile/accessibility polish, validation, deployment verification and profile README integration.

Main currently requires PRs but does not require CI status checks in its ruleset. Repository administration changes require a separate owner decision; do not bypass protection or widen collaborator permissions. No license has been selected.
