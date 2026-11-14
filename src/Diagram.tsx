import { useEffect, useId, useState } from 'react'
export function Diagram({ source, onReady }: { source: string; onReady?: () => void }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  const [result, setResult] = useState<{ source: string; svg?: string; error?: boolean }>()
  useEffect(() => {
    let active = true
    import('mermaid').then(async ({ default: mermaid }) => {
      mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: 'neutral', suppressErrorRendering: true })
      const { svg } = await mermaid.render(`diagram${id}`, source)
      if (active) setResult({ source, svg })
    }).catch(() => { if (active) setResult({ source, error: true }) })
    return () => { active = false }
  }, [source, id])
  useEffect(() => {
    if (result?.source === source) onReady?.()
  }, [result, source, onReady])
  return <figure aria-label="Architecture diagram">
    {result?.source === source && result.svg ? <div className="diagram" dangerouslySetInnerHTML={{ __html: result.svg }} /> : <p role="status">{result?.error ? 'Diagram unavailable. Read the source below.' : 'Rendering diagram…'}</p>}
    <figcaption>Repository-owned architecture diagram. Expand the source for nodes, boundaries, and connections.</figcaption>
    <details><summary>Diagram source (text alternative)</summary><pre>{source}</pre></details>
  </figure>
}
