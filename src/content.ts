export const studies = [{ id: 'document-processing', title: 'Document Processing Platform', status: 'Design study', summary: 'Durable ingestion, asynchronous processing, and recoverable failures.' }]
export const overview = `## Architecture is a set of decisions
Start with the constraints. Explain the boundaries. Make the failure modes visible.

This lab collects original, hypothetical system designs. It separates assumptions, proposed targets, and measured results. No production performance is claimed.

## Reading a case study
Each study follows the same path: requirements, architecture, contracts, data, security boundaries, failure handling, operations, and tradeoffs.

## What is available
Read the Document Processing Platform study for a concrete design of durable ingestion, isolated extraction, and recoverable publication.

## Evidence policy
Examples use synthetic workloads. Capacity calculations are planning estimates, never benchmarks. Designs contain no employer or customer material.
`
export const diagram = 'flowchart LR\n R[Requirements] --> A[Architecture]\n A --> D[Decisions]\n D --> O[Operational tradeoffs]\n O --> R'
