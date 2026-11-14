import { useEffect, useState } from 'react'
import { headingId, headings, readLocation, sectionLink } from './navigation'
import Markdown from 'react-markdown'
import { Diagram } from './Diagram'
import { studies, overview, diagram } from './content'
import './App.css'
import { ArchitectureExplorer } from './ArchitectureExplorer'
import documentStudy from './document-processing.md?raw'
export default function App() {
  const [{route, section}, setLocation] = useState(readLocation)
  useEffect(() => { const update = () => setLocation(readLocation()); addEventListener('hashchange', update); return () => removeEventListener('hashchange', update) }, [])
  const study = studies.find(s => route === `/studies/${s.id}`)
  const home = route === '/'
  useEffect(() => {
    if (section) document.getElementById(section)?.scrollIntoView()
  }, [route, section])
  const contents = headings(home ? overview : documentStudy)
  if (study) contents.unshift({id:'architecture-explorer', title:'Architecture explorer'})

  return <><a className="skip" href="#main" onClick={event => { event.preventDefault(); document.getElementById("main")?.focus() }}>Skip to content</a><header><a className="brand" href="#/">System Design Lab</a><a href="https://github.com/kchan1028/system-design-lab">GitHub ↗</a></header>
    <div className="layout"><aside><p className="nav-label">FIELD NOTES IN ARCHITECTURE</p><nav aria-label="Case studies"><a aria-current={home ? 'page' : undefined} href="#/">Overview</a><p className="nav-label">CASE STUDIES</p>{studies.map(s => <a key={s.id} aria-current={study?.id === s.id ? 'page' : undefined} href={`#/studies/${s.id}`}>{s.title}<small>{s.status}</small></a>)}</nav><p className="sidebar-note">Requirements → decisions → consequences</p><a href="https://kalunchan.dev">KC Chan · Portfolio ↗</a></aside>
    <main id="main" tabIndex={-1}><p className="eyebrow">Engineering architecture & decision-making</p><h1>{home ? 'Designing for real constraints.' : study?.title || 'Page not found'}</h1><p className="lead">{home ? 'A working notebook of systems, their boundaries, and the choices that make them operable.' : study?.summary || 'Choose a case study from the navigation.'}</p>
    {(home || study) && <nav className="contents" aria-label="On this page"><p>On this page</p><ul>{contents.map(item => <li key={item.id}><a href={sectionLink(route,item.id)}>{item.title}</a></li>)}</ul></nav>}
    {home ? <><div className="notice">Independent design exercises. Explicit assumptions. No claimed production benchmarks.</div><Markdown components={{h2({children}) { const id=headingId(String(children)); return <h2 id={id}><a className="section-link" href={sectionLink(route,id)}>{children}</a></h2> }}}>{overview}</Markdown><h2>The design loop</h2><Diagram source={diagram}/></> : study ? <><ArchitectureExplorer/><Markdown components={{ h2({children}) { const id=headingId(String(children)); return <h2 id={id}><a className="section-link" href={sectionLink(route,id)}>{children}</a></h2> }, code({ className, children, ...props }) { return className === 'language-mermaid' ? <Diagram source={String(children).trim()} /> : <code className={className} {...props}>{children}</code> }, pre({children}) { return <div className="code-block">{children}</div> }, h1() { return null } }}>{documentStudy}</Markdown></> : <a href="#/">Return to overview</a>}
    <footer>Original hypothetical designs · <a href="https://github.com/kchan1028/system-design-lab">Source and review history</a></footer></main></div></>
}
