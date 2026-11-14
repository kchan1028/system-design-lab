export type Glance = {
  answer: string
  path: string
  steps: { step: string; guard: string }[]
  unproven: string
}

// One answer-first summary per study. Every statement must trace to that study's Markdown.
export const glances: Record<string, Glance> = {
  'global-voice-platform': {
    answer: 'Run three independent voice regions that keep media close to callers, spread calls across capacity-tested Asterisk pools, and rank carriers by cost and quality from one Python policy. Each prepaid balance has one owner, so regions cannot spend the same credit.',
    path: 'From SIP or WebRTC call to settled charge',
    steps: [
      { step: 'Choose a region', guard: 'Geography sets the first preference; measured latency, loss, capacity and carrier reach refine it.' },
      { step: 'Admit the call', guard: 'OpenSIPS identifies the customer and reseller and checks regional health and capacity first.' },
      { step: 'Allocate media', guard: 'A healthy local relay is chosen: MediaProxy for SIP, rtpengine for WebRTC. Established calls stay pinned.' },
      { step: 'Pick an Asterisk server', guard: 'Calls are tracked against each server’s tested capacity, with separate pools for transcoding and recording.' },
      { step: 'Route to a carrier', guard: 'Versioned Python route tables: longest prefix match, ASR, PDD and ACD filters, then bounded failover before answer.' },
      { step: 'Authorize and settle', guard: 'Funds are reserved before connect; correlated events and unique transaction keys prevent duplicate charges.' },
    ],
    unproven: 'No load test has run. The 6,000-call peak and 500 calls per Asterisk server are planning targets that need benchmarks with real codecs and call flows.',
  },
  'document-processing': {
    answer: 'Accept each document durably, process it asynchronously in a sandbox, and let only the current worker for the current generation publish a result. Duplicate deliveries and crashes cost extra work, never a second or stale result.',
    path: 'From upload to published result',
    steps: [
      { step: 'Register', guard: 'An idempotency key is reserved with the document row, so a retried request returns the same document.' },
      { step: 'Upload', guard: 'A short-lived, size-limited grant writes an immutable object version; completion verifies size, checksum and tenant.' },
      { step: 'Queue', guard: 'The job and its outbox event commit in one transaction. The queue delivers; PostgreSQL holds the truth.' },
      { step: 'Extract', guard: 'The parser runs sandboxed, with no network access, resource limits and no control-plane credentials.' },
      { step: 'Publish', guard: 'A conditional update checks generation, lease token and active lifecycle, so a stale worker cannot publish.' },
      { step: 'Read or delete', guard: 'Results are served only when ready. A deletion tombstone blocks reads and publication before cleanup runs.' },
    ],
    unproven: 'No load test, OCR benchmark or real worker has run. The npm run simulate model covers publication races only.',
  },
  'event-driven-orders': {
    answer: 'Accept an order only after it is stored, then drive stock, payment and shipping through an orchestrated saga with stable operation keys. A payment timeout stays unknown until it is resolved, so a lost response does not turn into a second charge or an unpaid shipment.',
    path: 'From order to shipment',
    steps: [
      { step: 'Accept', guard: 'The order and its reserve-inventory command persist together. Acceptance means processing started, not success.' },
      { step: 'Reserve stock', guard: 'Inbox deduplication and a conditional reservation; a duplicate message returns the recorded outcome.' },
      { step: 'Capture payment', guard: 'Intent is recorded before the provider call, with one idempotency key. A timeout becomes unknown, never a decline.' },
      { step: 'Confirm', guard: 'The order is confirmed only if cancellation has not won; otherwise the capture is refunded and stock released.' },
      { step: 'Authorize shipment', guard: 'Requires confirmed capture and committed inventory, with one authorization per order generation.' },
      { step: 'Reconcile', guard: 'Aged holds, unknown payments and missing acknowledgements go to lookup and escalation, not blind retries.' },
    ],
    unproven: 'No commerce backend or payment provider integration exists. Stock can stay held during provider incidents; that cost is accepted and needs alerting.',
  },
  'multi-tenant-saas': {
    answer: 'Keep tenants in shared tables, but check current membership on every operation and carry tenant identity through queries, caches, files and jobs. A wrong URL, cache key or background job should end in a deny, not in another organization’s data.',
    path: 'From request to tenant data',
    steps: [
      { step: 'Authenticate', guard: 'Proves who the user is. A workspace name, email domain or resource ID never proves membership.' },
      { step: 'Resolve membership', guard: 'The current role is read from the primary database for each operation, not trusted from a long-lived token.' },
      { step: 'Authorize the action', guard: 'A fixed role and action matrix with object scope. Unknown roles, actions or missing context are denied.' },
      { step: 'Query data', guard: 'Tenant-scoped keys, composite constraints and row-security policies act as separate layers.' },
      { step: 'Caches, files and jobs', guard: 'Every cache entry, object and background job carries a server-validated tenant identity.' },
      { step: 'Export', guard: 'Downloads go through an authorized proxy, so a copied link grants nothing on its own.' },
    ],
    unproven: 'Isolation has not been tested against an implementation. Revocation cannot recall bytes already downloaded or responses already in flight.',
  },
  'high-traffic-api': {
    answer: 'Serve the public catalog from a shared cache with a hard 90-second age limit, and protect the origin with admission limits that are separate from caller quotas. Past that limit the API returns unavailable instead of old data, and private or admin responses never enter the shared cache.',
    path: 'From client request to catalog database',
    steps: [
      { step: 'Edge filter', guard: 'Coarse abuse limits at the edge. IP limits are signals, not identities.' },
      { step: 'Shared cache', guard: 'Only allowlisted public GET and HEAD responses: fresh for 30 seconds, then stale for at most 60 more.' },
      { step: 'Admission', guard: 'Admits only work that fits a deadline and resource budget, rejecting before an unbounded queue forms.' },
      { step: 'Quota check', guard: 'Token buckets per organization and credential. Counter outages degrade public reads; expensive actions fail closed.' },
      { step: 'Revalidate', guard: 'Freshness is renewed only from the primary database, never from a lagging replica.' },
      { step: 'Publish changes', guard: 'A revision and its invalidation intent commit together. Purges speed freshness; the age limit is the backstop.' },
    ],
    unproven: 'No load, cache-provider or limiter experiment has run. The 90-second bound must be tested against the chosen cache products.',
  },
  'rag-document-search': {
    answer: 'Filter by permission inside retrieval, recheck access before the model sees evidence and again before answers or citations are returned, and abstain when the permitted evidence does not support an answer. Every citation points to a retrieved passage of a specific document version.',
    path: 'From indexed document to cited answer',
    steps: [
      { step: 'Publish the index', guard: 'A document version becomes searchable only when all its chunks and embeddings land in one index generation.' },
      { step: 'Retrieve', guard: 'Lexical and vector search both apply the caller’s access filter, so restricted chunks are never candidates.' },
      { step: 'Recheck access', guard: 'Current access is checked with the authorization service before any passage enters the model context.' },
      { step: 'Generate', guard: 'The model sees only authorized evidence, has no tools and treats retrieved text as data.' },
      { step: 'Verify citations', guard: 'Citations must match retrieved spans, weak support is flagged and access is checked again.' },
      { step: 'Open a citation', guard: 'The viewer proxy checks access once more and serves only the cited version’s passage.' },
    ],
    unproven: 'No retrieval system, model call or evaluation has run, and no quality scores exist. The evaluation plan defines what would count as evidence.',
  },
}
