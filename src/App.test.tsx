import { render, screen, act, within } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import App from './App'
const diagram = vi.hoisted(() => ({onReady: undefined as (() => void) | undefined}))
vi.mock('./Diagram', () => ({ Diagram: ({onReady}: {onReady?: () => void}) => { diagram.onReady = onReady; return <figure aria-label="Architecture diagram"/> } }))
test('overview gives honest provenance and accessible navigation', () => { location.hash = '#/'; render(<App/>); expect(screen.getByRole('navigation', {name:'Case studies'})).toBeVisible(); expect(screen.getByRole('heading',{level:1})).toHaveTextContent('Designing for real constraints'); expect(screen.getByText(/No claimed production benchmarks/)).toBeVisible() })
test('hash navigation and unknown routes', () => { location.hash = '#/'; render(<App/>); act(() => { location.hash='#/studies/document-processing'; dispatchEvent(new Event('hashchange')) }); expect(screen.getByRole('heading',{level:1})).toHaveTextContent('Document Processing Platform'); expect(screen.getByRole('heading',{name:'Idempotency and publication protocol'})).toBeVisible(); act(() => { location.hash='#/missing'; dispatchEvent(new Event('hashchange')) }); expect(screen.getByRole('heading',{level:1})).toHaveTextContent('Page not found') })

test('order study has independent content and no document-specific tools', () => {
  location.hash = '#/studies/event-driven-orders'
  render(<App />)
  expect(screen.getByRole('heading',{level:1})).toHaveTextContent('Event-Driven Order Processing')
  expect(screen.getByRole('heading',{name:'Saga and compensation protocol'})).toBeVisible()
  expect(screen.queryByRole('heading',{name:'Idempotency and publication protocol'})).not.toBeInTheDocument()
  expect(screen.queryByRole('heading',{name:'Architecture explorer'})).not.toBeInTheDocument()
  expect(screen.queryByRole('heading',{name:'Architecture tradeoff analyzer'})).not.toBeInTheDocument()
  const contents = screen.getByRole('navigation',{name:'On this page'})
  expect(within(contents).getByRole('link',{name:'Saga and compensation protocol'})).toHaveAttribute('href','#/studies/event-driven-orders?section=saga-and-compensation-protocol')
})

test('tenant study resolves its own content and navigation across study switches', () => {
  location.hash = '#/studies/multi-tenant-saas'
  render(<App />)
  expect(screen.getByRole('heading',{level:1})).toHaveTextContent('Multi-Tenant SaaS Platform')
  expect(screen.getByRole('heading',{name:'Authorization model'})).toBeVisible()
  const contents = screen.getByRole('navigation',{name:'On this page'})
  expect(within(contents).getByRole('link',{name:'Data isolation and connection handling'})).toHaveAttribute('href','#/studies/multi-tenant-saas?section=data-isolation-and-connection-handling')
  expect(screen.queryByRole('heading',{name:'Architecture tradeoff analyzer'})).not.toBeInTheDocument()
  act(() => { location.hash='#/studies/event-driven-orders'; dispatchEvent(new Event('hashchange')) })
  expect(screen.getByRole('heading',{name:'Saga and compensation protocol'})).toBeVisible()
  expect(screen.queryByRole('heading',{name:'Authorization model'})).not.toBeInTheDocument()
})

test.each([false, true])('late diagram restores deep link unless reader interacted: %s', (interacted) => {
  const original = HTMLElement.prototype.scrollIntoView
  const scroll = vi.fn()
  HTMLElement.prototype.scrollIntoView = scroll
  try {
    location.hash = '#/studies/multi-tenant-saas?section=authorization-model'
    render(<App />)
    expect(scroll).toHaveBeenCalledTimes(1)
    if (interacted) dispatchEvent(new Event('wheel'))
    act(() => diagram.onReady?.())
    expect(scroll).toHaveBeenCalledTimes(interacted ? 1 : 2)
    act(() => diagram.onReady?.())
    expect(scroll).toHaveBeenCalledTimes(interacted ? 1 : 2)
  } finally { HTMLElement.prototype.scrollIntoView = original }
})

test('API study has its own cache and overload content and deep links', () => {
  location.hash = '#/studies/high-traffic-api'
  render(<App />)
  expect(screen.getByRole('heading',{level:1})).toHaveTextContent('High-Traffic API Platform')
  expect(screen.getByRole('heading',{name:'Cache eligibility and freshness policy'})).toBeVisible()
  expect(screen.getByRole('heading',{name:'Rate limiting and degraded operation'})).toBeVisible()
  const contents = screen.getByRole('navigation',{name:'On this page'})
  expect(within(contents).getByRole('link',{name:'Stampede protection and origin admission'})).toHaveAttribute('href','#/studies/high-traffic-api?section=stampede-protection-and-origin-admission')
  expect(screen.queryByRole('heading',{name:'Authorization model'})).not.toBeInTheDocument()
  expect(screen.queryByRole('heading',{name:'Architecture tradeoff analyzer'})).not.toBeInTheDocument()
})

test('RAG study has its own authorization and evaluation content and deep links', () => {
  location.hash = '#/studies/rag-document-search'
  render(<App />)
  expect(screen.getByRole('heading',{level:1})).toHaveTextContent('RAG Document Search')
  expect(screen.getByRole('heading',{name:'Authorization before generation'})).toBeVisible()
  expect(screen.getByRole('heading',{name:'Evaluation plan'})).toBeVisible()
  const contents = screen.getByRole('navigation',{name:'On this page'})
  expect(within(contents).getByRole('link',{name:'Citation integrity and answer contract'})).toHaveAttribute('href','#/studies/rag-document-search?section=citation-integrity-and-answer-contract')
  expect(within(contents).queryByRole('link',{name:'Architecture explorer'})).not.toBeInTheDocument()
  expect(screen.queryByRole('heading',{name:'Architecture tradeoff analyzer'})).not.toBeInTheDocument()
  expect(screen.queryByRole('heading',{name:'Cache eligibility and freshness policy'})).not.toBeInTheDocument()
})

test('overview links every study and states which tools exist', () => {
  location.hash = '#/'
  render(<App />)
  const main = screen.getByRole('main')
  for (const name of ['Document Processing Platform','Event-Driven Order Processing','Multi-Tenant SaaS Platform','High-Traffic API Platform','RAG Document Search']) expect(within(main).getByRole('link',{name})).toHaveAttribute('href', expect.stringMatching(/^#\/studies\//))
  expect(screen.getByRole('heading',{name:'Interactive tools'})).toBeVisible()
  expect(screen.getByText(/for the Document Processing Platform only/)).toBeVisible()
  expect(screen.getByRole('heading',{name:'What remains hypothetical'})).toBeVisible()
})

test('route changes update the document title and move focus to main', () => {
  location.hash = '#/'
  render(<App />)
  expect(document.title).toBe('System Design Lab · KC Chan')
  expect(screen.getByRole('main')).not.toHaveFocus()
  act(() => { location.hash='#/studies/rag-document-search'; dispatchEvent(new Event('hashchange')) })
  expect(document.title).toBe('RAG Document Search · System Design Lab')
  expect(screen.getByRole('main')).toHaveFocus()
  act(() => { location.hash='#/missing'; dispatchEvent(new Event('hashchange')) })
  expect(document.title).toBe('Page not found · System Design Lab')
})
