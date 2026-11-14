import type { Glance } from './glance'

export function StudyGlance({ glance }: { glance: Glance }) {
  return <section className="glance" aria-labelledby="study-at-a-glance">
    <h2 id="study-at-a-glance">Study at a glance</h2>
    <p className="glance-answer">{glance.answer}</p>
    <figure className="glance-figure">
      <figcaption>{glance.path}: where each guarantee is enforced</figcaption>
      <ol className="glance-path">
        {glance.steps.map(item => <li key={item.step}><strong>{item.step}</strong><span>{item.guard}</span></li>)}
      </ol>
    </figure>
    <p className="glance-unproven"><strong>Not yet validated:</strong> {glance.unproven}</p>
  </section>
}
