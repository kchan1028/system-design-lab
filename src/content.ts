import voiceStudy from './global-voice-platform.md?raw'
import documentStudy from './document-processing.md?raw'
import orderStudy from './event-driven-orders.md?raw'
import tenantStudy from './multi-tenant-saas.md?raw'
import apiStudy from './high-traffic-api.md?raw'
import ragStudy from './rag-document-search.md?raw'
export const studies = [{ id: 'global-voice-platform', title: 'Open Source Voice Platform', status: 'Design study', summary: 'Regional SIP and media routing, capacity-tested Asterisk pools, quality-aware least cost routing and prepaid billing for 50 million minutes a month.', content: voiceStudy }, { id: 'document-processing', title: 'Document Processing Platform', status: 'Design study', summary: 'Durable ingestion, asynchronous processing, and recoverable failures.', content: documentStudy }, { id: 'event-driven-orders', title: 'Event-Driven Order Processing', status: 'Design study', summary: 'Durable order intent, idempotent effects, and reconciliation across inventory, payments and fulfillment.', content: orderStudy }, { id: 'multi-tenant-saas', title: 'Multi-Tenant SaaS Platform', status: 'Design study', summary: 'Tenant isolation, current authorization, scoped background work and auditable recovery.', content: tenantStudy }, { id: 'high-traffic-api', title: 'High-Traffic API Platform', status: 'Design study', summary: 'Public cache contracts, bounded freshness, quota fairness and observable overload protection.', content: apiStudy }, { id: 'rag-document-search', title: 'RAG Document Search', status: 'Design study', summary: 'Permission-aware retrieval, inspectable citations, safe abstention and a reproducible evaluation plan.', content: ragStudy }]
export const siteDescription = 'Six original system design case studies, from an open source voice platform to RAG search, with explicit assumptions, failure handling and tradeoffs.'
export const overview = `## What is System Design Lab?
System Design Lab is a set of six original, hypothetical architecture studies by KC Chan. Each one starts from a business problem, states its assumptions and proposed targets, and shows where the design can fail and what each decision costs. Nothing here describes a deployed system, and no production performance is claimed.

## How is each study organized?
Each study opens with Study at a glance: the design's answer in two sentences, then the critical path step by step with the control that protects each step, then what has not been validated. The detail follows: requirements, architecture and trust boundaries, contracts, data rules, failure handling, operations, decision records and a validation plan. Section links can be shared and reloaded.

## What is available
Six independent design studies, each with requirements, a diagram, contracts, failure handling, operations, decision records and a validation plan:

- [Open Source Voice Platform](studies/global-voice-platform/): regional SIP and media routing, Asterisk load balancing, quality-aware least cost routing and prepaid billing across three continents.
- [Document Processing Platform](studies/document-processing/): durable ingestion, isolated extraction and recoverable publication.
- [Event-Driven Order Processing](studies/event-driven-orders/): inventory holds, uncertain payment outcomes, compensation and reconciliation.
- [Multi-Tenant SaaS Platform](studies/multi-tenant-saas/): tenant-scoped data, membership revocation, background exports and isolation failures.
- [High-Traffic API Platform](studies/high-traffic-api/): cache eligibility, bounded staleness, rate limits, admission control and observability.
- [RAG Document Search](studies/rag-document-search/): authorization before evidence reaches a model, versioned indexes, citation integrity and an evaluation plan.

## Interactive tools
Two tools are implemented, for the Document Processing Platform only. The architecture explorer lets you inspect each component's boundary, responsibilities, dependencies and failure recovery by keyboard or pointer. The tradeoff analyzer compares synchronous requests, queue workers and durable workflows against assumptions you edit and apply; it gives no score or winner. A deterministic command-line model of publication failures runs with npm run simulate. The other studies are readable designs without interactive data sets.

## What remains hypothetical
No study has a backend, deployment or load test in this repository. Targets are proposals, capacity figures are arithmetic and frontend tests cover only this site's rendering, navigation and accessibility. They do not validate isolation, payment, cache, quota or retrieval guarantees.

## Evidence policy
Examples use synthetic workloads. Capacity calculations are planning estimates, never benchmarks. Designs contain no employer or customer material.
`
export const diagram = 'flowchart LR\n R[Requirements] --> A[Architecture]\n A --> D[Decisions]\n D --> O[Operational tradeoffs]\n O --> R'
