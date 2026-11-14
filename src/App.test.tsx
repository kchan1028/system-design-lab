import { render, screen, act, within } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import App from './App'
vi.mock('./Diagram', () => ({ Diagram: () => <figure aria-label="Architecture diagram"/> }))
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
