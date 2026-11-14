import documentStudy from './document-processing.md?raw'
import orderStudy from './event-driven-orders.md?raw'
import tenantStudy from './multi-tenant-saas.md?raw'
import apiStudy from './high-traffic-api.md?raw'
export const studies = [{ id: 'document-processing', title: 'Document Processing Platform', status: 'Design study', summary: 'Durable ingestion, asynchronous processing, and recoverable failures.', content: documentStudy }, { id: 'event-driven-orders', title: 'Event-Driven Order Processing', status: 'Design study', summary: 'Durable order intent, idempotent effects, and reconciliation across inventory, payments and fulfillment.', content: orderStudy }, { id: 'multi-tenant-saas', title: 'Multi-Tenant SaaS Platform', status: 'Design study', summary: 'Tenant isolation, current authorization, scoped background work and auditable recovery.', content: tenantStudy }, { id: 'high-traffic-api', title: 'High-Traffic API Platform', status: 'Design study', summary: 'Public cache contracts, bounded freshness, quota fairness and observable overload protection.', content: apiStudy }]
export const overview = `## Architecture is a set of decisions
Start with the constraints. Explain the boundaries. Make the failure modes visible.

This lab collects original, hypothetical system designs. It separates assumptions, proposed targets, and measured results. No production performance is claimed.

## Reading a case study
Each study follows the same path: requirements, architecture, contracts, data, security boundaries, failure handling, operations, and tradeoffs.

## What is available
Read the Document Processing Platform study for a concrete design of durable ingestion, isolated extraction, and recoverable publication. The Event-Driven Order Processing study explores inventory reservations, uncertain payment outcomes, compensation and reconciliation. The Multi-Tenant SaaS Platform study examines tenant-scoped data, membership revocation, background exports and isolation failures. The High-Traffic API Platform study covers cache eligibility, bounded staleness, rate limits, admission control and edge-to-origin observability.

## Evidence policy
Examples use synthetic workloads. Capacity calculations are planning estimates, never benchmarks. Designs contain no employer or customer material.
`
export const diagram = 'flowchart LR\n R[Requirements] --> A[Architecture]\n A --> D[Decisions]\n D --> O[Operational tradeoffs]\n O --> R'
