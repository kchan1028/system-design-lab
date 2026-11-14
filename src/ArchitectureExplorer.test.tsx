import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import { ArchitectureExplorer } from './ArchitectureExplorer'
import { documentArchitecture } from './architecture'

test('keyboard inspection follows dependencies and preserves a useful focus target', async () => {
  const user = userEvent.setup()
  render(<ArchitectureExplorer />)
  const worker = screen.getByRole('button', {name:'Extraction worker'})
  worker.focus()
  await user.keyboard(' ')
  expect(worker).toHaveAttribute('aria-pressed','true')
  expect(screen.getByRole('region', {name:'Extraction worker'})).toHaveTextContent('Stale leases and deletion tombstones')
  const database = screen.getByRole('button', {name:'Inspect PostgreSQL metadata and outbox'})
  database.focus()
  await user.keyboard('{Enter}')
  expect(screen.getByRole('button', {name:'PostgreSQL metadata and outbox'})).toHaveFocus()
  expect(screen.getByRole('status')).toHaveTextContent('Inspecting: PostgreSQL')
  expect(screen.getByRole('region', {name:'PostgreSQL metadata and outbox'})).toHaveTextContent('No outgoing dependency is modeled')
  expect(screen.getByRole('region', {name:'PostgreSQL metadata and outbox'})).toHaveTextContent('Inspect Extraction worker')
})

test('architecture connections resolve to unique components with complete inspection content', () => {
  const ids = documentArchitecture.map(component => component.id)
  expect(new Set(ids).size).toBe(ids.length)
  for (const component of documentArchitecture) {
    for (const field of ['name','boundary','responsibility','security','failure'] as const) expect(component[field].length).toBeGreaterThan(0)
    for (const edge of component.dependencies) { expect(ids).toContain(edge.id); expect(edge.purpose.length).toBeGreaterThan(0) }
  }
})
