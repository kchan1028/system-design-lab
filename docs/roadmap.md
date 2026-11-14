# Roadmap

## Milestone 1: foundation

Responsive React/Vite/TypeScript documentation, honest planned study navigation, Mermaid with source fallback, tests, read-only CI, contributing and security guidance. No hosting or license selection.

## Milestone 2: separate content PR

Document Processing Platform: requirements and exclusions, architecture, APIs, tenant-scoped data model, threat boundaries, retry and idempotency semantics, failure recovery, observability, explicit cost/capacity arithmetic, ADRs, alternatives, and open questions. Original hypothetical design only.

## Milestone 3: architecture explorer (review checkpoint)

Native component buttons grouped by boundary; directional connection navigation; responsibilities, security and failure recovery. The Document Processing Platform is the first data set. Keep the existing full-flow Mermaid diagram. Review this component schema and interaction before extending it to more studies.

## Remaining milestones

- Tradeoff analyzer: implemented in a separate review PR; explicit draft/apply assumptions, unknown values and qualitative comparisons. Review before extending the rule set.
- Event-driven orders: independent study in a separate review PR; no backend implementation or measured results.
- Multi-tenant SaaS: independent study in a separate review PR; authorization and isolation semantics need implementation validation.
- High-traffic API: independent study in a separate review PR; cache age, quota and overload guarantees need provider/load validation.
- RAG document search: independent study in a separate review PR; authorization, index freshness and evaluation decisions need owner review. No retrieval backend, model calls or evaluation results.
- Cross-study mobile/accessibility polish, validation, deployment verification and profile README integration.

Main requires PRs through its ruleset, and branch protection currently requires the `check` CI status with strict up-to-date branches. Repository administration changes require a separate owner decision; do not bypass protection or widen collaborator permissions. No license has been selected.
