import { render, screen, act } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import App from './App'
vi.mock('./Diagram', () => ({ Diagram: () => <figure aria-label="Architecture diagram"/> }))
test('overview gives honest provenance and accessible navigation', () => { location.hash = '#/'; render(<App/>); expect(screen.getByRole('navigation', {name:'Case studies'})).toBeVisible(); expect(screen.getByRole('heading',{level:1})).toHaveTextContent('Designing for real constraints'); expect(screen.getByText(/No claimed production benchmarks/)).toBeVisible() })
test('hash navigation and unknown routes', () => { location.hash = '#/'; render(<App/>); act(() => { location.hash='#/studies/document-processing'; dispatchEvent(new Event('hashchange')) }); expect(screen.getByRole('heading',{level:1})).toHaveTextContent('Document Processing Platform'); expect(screen.getByRole('heading',{name:'Idempotency and publication protocol'})).toBeVisible(); act(() => { location.hash='#/missing'; dispatchEvent(new Event('hashchange')) }); expect(screen.getByRole('heading',{level:1})).toHaveTextContent('Page not found') })
