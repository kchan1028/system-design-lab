import { useState } from 'react'
import { compareArchitectures, defaultAssumptions } from './tradeoffs'
import type { Assumptions } from './tradeoffs'

export function TradeoffAnalyzer() {
  const [draft, setDraft] = useState<Assumptions>({...defaultAssumptions})
  const [applied, setApplied] = useState<Assumptions>({...defaultAssumptions})
  const [notes, setNotes] = useState('Assume extraction can restart from an immutable source. Confirm with a pilot.')
  const [appliedNotes, setAppliedNotes] = useState(notes)
  const [revision, setRevision] = useState(0)
  const dirty = JSON.stringify(draft) !== JSON.stringify(applied) || notes !== appliedNotes
  return <section className="analyzer" aria-labelledby="architecture-tradeoff-analyzer">
    <h2 id="architecture-tradeoff-analyzer">Architecture tradeoff analyzer</h2>
    <p>Compare three processing approaches for this document platform. These authored rules explain consequences of assumptions; they do not score designs, predict throughput or quote prices.</p>
    <form onSubmit={event => { event.preventDefault(); setApplied({...draft}); setAppliedNotes(notes); setRevision(value => value + 1) }}>
      <fieldset><legend>Editable planning assumptions</legend>
        <div className="assumption-fields">
          <label>Processing duration<select value={draft.duration} onChange={event => setDraft({...draft, duration:event.target.value as Assumptions['duration']})}><option value="bounded">Bounded within a measured request deadline</option><option value="variable">Variable or long-running extraction</option><option value="unknown">Unknown; needs measurement</option></select></label>
          <label>Arrival pattern<select value={draft.arrivals} onChange={event => setDraft({...draft, arrivals:event.target.value as Assumptions['arrivals']})}><option value="steady">Mostly steady</option><option value="bursty">Bursty</option><option value="unknown">Unknown; needs measurement</option></select></label>
          <label>Recovery requirement<select value={draft.recovery} onChange={event => setDraft({...draft, recovery:event.target.value as Assumptions['recovery']})}><option value="restart">Restart a whole job safely</option><option value="resume">Resume durable steps or compensate</option><option value="unknown">Unknown; needs discovery</option></select></label>
          <label>Operating capacity<select value={draft.operations} onChange={event => setDraft({...draft, operations:event.target.value as Assumptions['operations']})}><option value="limited">Limited on-call capacity</option><option value="experienced">Experienced with the chosen infrastructure</option><option value="unknown">Unknown; ownership unresolved</option></select></label>
        </div>
        <label>Evidence and unresolved constraints<textarea rows={3} maxLength={2000} value={notes} onChange={event => setNotes(event.target.value)} aria-describedby="assumption-notes-help"/></label>
        <p id="assumption-notes-help">Notes are for your review and do not change the comparison rules. All edits stay in this page session and reset on reload. Do not enter confidential information.</p>
        <div className="analyzer-actions"><button type="submit">Apply assumptions</button><button type="button" onClick={() => { setDraft({...defaultAssumptions}); setNotes('Assume extraction can restart from an immutable source. Confirm with a pilot.') }}>Reset draft to study assumptions</button></div>
      </fieldset>
    </form>
    <p role="status">{dirty ? 'Unapplied edits. Comparisons still use the last applied assumptions.' : revision ? `Comparison updated (revision ${revision}).` : 'Comparisons use the initial hypothetical study assumptions.'}</p>
    <div className="comparison-results">
      <h3>Applied assumption record</h3>
      <dl className="assumption-record"><dt>Duration</dt><dd>{applied.duration}</dd><dt>Arrivals</dt><dd>{applied.arrivals}</dd><dt>Recovery</dt><dd>{applied.recovery}</dd><dt>Operations</dt><dd>{applied.operations}</dd></dl>
      <p className="applied-notes">{appliedNotes.trim() || 'No evidence notes supplied. Validate these assumptions before making a commitment.'}</p>
      <p>Fixed scope: tenant-scoped, untrusted documents; private immutable storage; authenticated access; one authoritative result per generation. Changing these constraints requires a new design review. Every option needs isolation, authorization, retention and deletion controls.</p>
      {compareArchitectures(applied).map(comparison => <article key={comparison.name} aria-label={comparison.name}>
        <h3>{comparison.name}</h3>
        <dl><dt>Reliability and recovery</dt><dd>{comparison.reliability}</dd><dt>Implementation and operations</dt><dd>{comparison.complexity}</dd><dt>Cost drivers</dt><dd>{comparison.cost}</dd><dt>Scalability and capacity</dt><dd>{comparison.scalability}</dd><dt>Evidence to gather</dt><dd>{comparison.validate}</dd></dl>
      </article>)}
      <h3>Decision checkpoint</h3>
      <p>The study proposes queue, outbox and workers (ADR 001). This is a starting hypothesis, not an automatic winner. Test request deadlines and burst recovery, identify repeated side effects and compare operating responsibilities before changing it. Use regional quotes and measured workload distributions for any later cost model.</p>
    </div>
  </section>
}
