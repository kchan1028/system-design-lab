import { renderToStaticMarkup } from 'react-dom/server'
import Markdown from 'react-markdown'
import { studies } from './content'
import { glances } from './glance'
import { StudyGlance } from './StudyGlance'
import { headingId } from './navigation'

// Build-time only: static, crawlable markup for each study. The browser app replaces it on load.
export function renderStudy(id: string) {
  const study = studies.find(item => item.id === id)
  if (!study) throw new Error(`Unknown study: ${id}`)
  const glance = glances[id]
  return renderToStaticMarkup(<main id="main" tabIndex={-1}>
    <p className="eyebrow">Engineering architecture & decision-making</p>
    <h1>{study.title}</h1>
    <p className="lead">{study.summary}</p>
    {glance && <StudyGlance glance={glance} />}
    <Markdown components={{
      h1() { return null },
      h2({ children }) { return <h2 id={headingId(String(children))}>{children}</h2> },
      pre({ children }) { return <div className="code-block">{children}</div> },
      code({ className, children }) {
        return className === 'language-mermaid'
          ? <figure aria-label="Architecture diagram"><figcaption>Architecture diagram source. The interactive page renders it as a diagram.</figcaption><pre>{String(children).trim()}</pre></figure>
          : <code className={className}>{children}</code>
      },
    }}>{study.content}</Markdown>
  </main>)
}

export const studyPages = studies.map(study => ({ id: study.id, title: study.title, summary: study.summary }))
