# Publication failure simulation

Run `npm run simulate` with Node.js 24. No services or credentials are required. `npm test` also verifies the model's invariants.

This deterministic, single-job state model makes four interleavings inspectable:

- Duplicate queue delivery after publication but before acknowledgement: ready work is not reclaimed.
- Crash after writing output but before publication: a replacement can publish while the first object remains an orphan.
- Expired worker resumes after a new claim: its fencing token cannot publish.
- Deletion races with publication: the tombstone prevents a late result from becoming readable.

Each trace shows the authoritative pointer and objects awaiting cleanup. An orphan is deliberately retained to demonstrate the storage cost and need for a sweeper. Deletion revokes the model pointer immediately; it does not pretend to remove physical storage or backups.

The model assumes atomic conditional state transitions, immutable output objects, one tenant and one generation. Lease expiry is an explicit event, not wall-clock behavior. It does not implement PostgreSQL locking, object-store version checks, transactions, retries, fairness, outbox dispatch, scanner isolation, multi-tenant authorization, or distributed concurrency. Passing these tests supports the consistency of this small model, not a claim of production correctness, exactly-once processing, or performance.

The next implementation-level evidence would be a database-backed test that terminates workers at each publication boundary and exercises competing transactions. That is not claimed here.
