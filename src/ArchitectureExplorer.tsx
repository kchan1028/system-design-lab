import { useRef, useState } from 'react'
import { documentArchitecture as components } from './architecture'

export function ArchitectureExplorer() {
  const buttons = useRef<Record<string, HTMLButtonElement | null>>({})
  function follow(id: string) { setSelectedId(id); buttons.current[id]?.focus() }
  const [selectedId, setSelectedId] = useState('api')
  const selected = components.find(component => component.id === selectedId)!
  const incoming = components.filter(component => component.dependencies.some(edge => edge.id === selectedId))
  return <section className="explorer" aria-labelledby="architecture-explorer">
    <h2 id="architecture-explorer">Architecture explorer</h2>
    <p>Inspect the Document Processing Platform design. Select a component with Tab, then Enter or Space. Dependency buttons follow a connection; following a dependency moves focus to that component.</p>
    <p className="explorer-note">Hypothetical design, not live health data. Connections describe interactions, not deployment order. The diagram below remains the full flow reference.</p>
    <div className="component-groups" role="group" aria-label="Architecture components">
      {[...new Set(components.map(component => component.boundary))].map(boundary => <fieldset key={boundary}><legend>{boundary}</legend>
        {components.filter(component => component.boundary === boundary).map(component => <button type="button" key={component.id} ref={button => { buttons.current[component.id] = button }} aria-pressed={selectedId === component.id} aria-controls="component-inspection" onClick={() => setSelectedId(component.id)}>{component.name}</button>)}
      </fieldset>)}
    </div>
    <p role="status" className="selection-status">Inspecting: {selected.name}</p>
    <div id="component-inspection" role="region" aria-labelledby="component-name">
      <h3 id="component-name">{selected.name}</h3>
      <dl><dt>Responsibility</dt><dd>{selected.responsibility}</dd><dt>Security boundary: {selected.boundary}</dt><dd>{selected.security}</dd><dt>Failure and recovery</dt><dd>{selected.failure}</dd></dl>
      <h4>Outgoing dependencies</h4>
      {selected.dependencies.length ? <ul>{selected.dependencies.map(edge => <li key={edge.id}><button type="button" onClick={() => follow(edge.id)}>Inspect {components.find(component => component.id === edge.id)!.name}</button><span> — {edge.purpose}</span></li>)}</ul> : <p>No outgoing dependency is modeled. This does not imply failure independence.</p>}
      <h4>Incoming connections</h4>
      {incoming.length ? <ul>{incoming.map(component => <li key={component.id}><button type="button" onClick={() => follow(component.id)}>Inspect {component.name}</button><span> — {component.dependencies.find(edge => edge.id === selectedId)!.purpose}</span></li>)}</ul> : <p>No incoming connection is modeled.</p>}
    </div>
  </section>
}
