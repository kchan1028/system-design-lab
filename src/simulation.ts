/** A deterministic single-job model. It does not emulate a database, queue or clock. */
export class PublicationModel {
  lifecycle: 'active' | 'deleted' = 'active'
  state: 'queued' | 'running' | 'ready' = 'queued'
  token = 0
  result: string | null = null
  objects = new Set<string>()
  trace: string[] = []

  claim() {
    if (this.lifecycle !== 'active' || this.state !== 'queued') {
      this.trace.push('Delivery ignored: job is not claimable.')
      return null
    }
    this.token += 1
    this.state = 'running'
    this.trace.push(`Claim acquired with fencing token ${this.token}.`)
    return this.token
  }

  expireLease() {
    if (this.state !== 'running') throw new Error('No running lease to expire')
    this.state = 'queued'
    this.token += 1 // invalidates the old owner before another claim
    this.trace.push('Lease expired; prior worker is fenced out.')
  }

  writeOutput(name: string) {
    this.objects.add(name)
    this.trace.push(`Attempt object written: ${name}.`)
  }

  publish(token: number, object: string) {
    if (this.lifecycle !== 'active' || this.state !== 'running' || token !== this.token) {
      this.trace.push('Publication refused: stale lease, terminal job, or deletion.')
      return false
    }
    if (!this.objects.has(object)) throw new Error('Cannot publish a missing object')
    this.result = object
    this.state = 'ready'
    this.trace.push(`Authoritative result published: ${object}.`)
    return true
  }

  deleteDocument() {
    this.lifecycle = 'deleted'
    this.result = null
    this.token += 1
    this.trace.push('Deletion tombstone blocks reads and publication; physical cleanup remains pending.')
  }

  get orphanObjects() { return [...this.objects].filter(object => object !== this.result) }
}

export function runScenario(name: 'duplicate' | 'crash' | 'stale' | 'delete') {
  const model = new PublicationModel()
  const first = model.claim()!
  model.writeOutput('attempt-a')
  if (name === 'duplicate') {
    model.publish(first, 'attempt-a')
    model.trace.push('Worker crashes before queue acknowledgement; delivery repeats.')
    model.claim()
  } else if (name === 'crash') {
    model.trace.push('Worker crashes after object write, before publication.')
    model.expireLease()
    const second = model.claim()!
    model.writeOutput('attempt-b')
    model.publish(second, 'attempt-b')
  } else if (name === 'stale') {
    model.expireLease()
    const second = model.claim()!
    model.writeOutput('attempt-b')
    model.publish(first, 'attempt-a')
    model.publish(second, 'attempt-b')
  } else {
    model.deleteDocument()
    model.publish(first, 'attempt-a')
  }
  return model
}
