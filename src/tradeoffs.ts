export type Assumptions = {
  duration: 'bounded' | 'variable' | 'unknown'
  arrivals: 'steady' | 'bursty' | 'unknown'
  recovery: 'restart' | 'resume' | 'unknown'
  operations: 'limited' | 'experienced' | 'unknown'
}
export const defaultAssumptions: Assumptions = {
  duration: 'variable', arrivals: 'bursty', recovery: 'restart', operations: 'limited',
}
export type Comparison = { name: string; reliability: string; complexity: string; cost: string; scalability: string; validate: string }

// Authored decision rules, not measured rankings or a provider recommendation engine.
export function compareArchitectures(a: Assumptions): Comparison[] {
  return [
    {
      name: 'Synchronous request processing',
      reliability: a.duration === 'bounded'
        ? 'Bounded work may fit a request deadline after measurement. A lost response still requires idempotency.'
        : a.duration === 'variable'
          ? 'Variable extraction time makes request timeouts ambiguous. Client retries can duplicate work unless intent is durable.'
          : 'Duration is unknown: measure tail latency before assuming work fits a request deadline.',
      complexity: 'Fewer dispatch components, but durable intent, isolation, idempotency and recovery still need design. Do not run untrusted parsing in the API process.',
      cost: 'Avoids a separate queue or workflow service; request concurrency, isolated compute, retries and idle headroom can outweigh that saving. No total-cost ordering is established.',
      scalability: a.arrivals === 'bursty'
        ? 'Bursts directly consume request and worker concurrency. Admission control is necessary; there is no durable buffer in this option.'
        : a.arrivals === 'steady'
          ? 'Steady arrivals may simplify capacity planning, subject to measured tail latency and saturation limits.'
          : 'Arrival shape is unknown: measure burst duration and concurrency before sizing request capacity.',
      validate: 'Test lost responses, client disconnects, duplicate submissions, parser isolation and saturation; measure deadline violations.',
    },
    {
      name: 'Queue, transactional outbox and workers',
      reliability: a.recovery === 'resume'
        ? 'Step-level resume requires additional durable checkpoints or separate jobs. Outbox delivery alone does not resume partial extraction.'
        : a.recovery === 'restart'
          ? 'Restartable jobs fit lease-based retries. Outbox intent, fenced publication and reconciliation remain required; duplicate computation is possible.'
          : 'Recovery needs are unknown: identify which side effects can repeat and which steps require durable checkpoints.',
      complexity: a.operations === 'limited'
        ? 'Limited operating capacity is a concern: a relay, leases, dead letters and reconciliation each need ownership and runbooks.'
        : a.operations === 'experienced'
          ? 'Experienced operators can reuse queue runbooks, but relay lag, lease expiry and deletion reconciliation still require monitoring.'
          : 'Operating capacity is unknown: assign ownership for relay, queue, workers and reconciliation before adoption.',
      cost: 'Adds queue requests, relay operation and retained backlog. Retries, OCR, worker utilization and storage retention drive spend; obtain rates and measure amplification.',
      scalability: a.arrivals === 'bursty'
        ? 'A durable queue buffers bounded bursts; it does not create capacity. Set backlog limits, tenant fairness and completion-age alerts.'
        : a.arrivals === 'steady'
          ? 'Workers scale separately from the API. Measure service-time distribution and oldest-job age before setting concurrency.'
          : 'Arrival shape is unknown: size backlog storage and admission limits only after measuring bursts.',
      validate: 'Exercise commit-to-dispatch gaps, duplicate delivery, expired leases, deletion races and backlog recovery. The existing publication model covers only a subset.',
    },
    {
      name: 'Durable workflow orchestration',
      reliability: a.recovery === 'resume'
        ? 'Durable step history can support resume and compensation. Activities still need idempotency; external side effects are not automatically exactly once.'
        : a.recovery === 'restart'
          ? 'Durable step history may add little value for one restartable extraction job. Activity retries still require idempotency and safe publication.'
          : 'Recovery needs are unknown: map long-running steps, compensation and history requirements before choosing orchestration.',
      complexity: a.operations === 'limited'
        ? 'A managed engine may reduce scheduler operation, but introduces workflow semantics, versioning, history limits and provider dependence. A self-hosted engine adds operating duties.'
        : a.operations === 'experienced'
          ? 'Existing engine expertise can help; workflow versioning, history growth, activity isolation and disaster recovery still require explicit design.'
          : 'Operating capacity is unknown: compare managed and self-hosted responsibilities, including incident recovery and upgrades.',
      cost: 'Account for executions or transitions, history retention, workers, retries, provider minimums and migration. Billing semantics vary; no price or savings claim is made.',
      scalability: a.arrivals === 'bursty'
        ? 'Workflow and activity quotas can throttle bursts. Validate backlog behavior, per-tenant fairness and history growth with the chosen engine.'
        : a.arrivals === 'steady'
          ? 'Activity concurrency can scale separately; validate scheduler quotas and history growth under the sustained workload.'
          : 'Arrival shape is unknown: measure demand and check engine quotas before committing to scale targets.',
      validate: 'Prototype worker termination, replay/version upgrades, repeated side effects, retention and deletion, quota exhaustion and engine recovery.',
    },
  ]
}
